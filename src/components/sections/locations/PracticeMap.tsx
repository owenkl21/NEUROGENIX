"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useImperativeHandle, useRef, useState, type Dispatch, type Ref, type SetStateAction } from "react";
import { createPortal } from "react-dom";
import type * as Leaflet from "leaflet";
import { motion } from "motion/react";
import { CornersOut, Minus, Plus } from "@phosphor-icons/react";
import { locations, practices, type Practice } from "@/content/site";
import { EASE } from "@/components/motion/primitives";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useMediaQuery } from "./useMediaQuery";
import { PracticePopup } from "./PracticePopup";
import styles from "./map.module.css";

export type PracticeMapHandle = {
  /** Fly to a practice and open its details. */
  focusPractice: (id: string) => void;
  /** Frame every practice. */
  showAll: () => void;
  /** Lift a marker while its list entry is hovered or focused. */
  highlight: (id: string | null) => void;
};

type Props = {
  active: string | null;
  setActive: Dispatch<SetStateAction<string | null>>;
  ref?: Ref<PracticeMapHandle>;
  className?: string;
};

type Portals = { popups: Record<string, HTMLElement>; zoom: HTMLElement; frame: HTMLElement };
type Layers = { base: Leaflet.TileLayer; labels: Leaflet.TileLayer | null };

const FOCUS_ZOOM = 13;
const FLY_SECONDS = 1.2;
const MIN_ZOOM = 4;
const MAX_ZOOM = 17;
/** Height a popup takes above its pin (card, tip and anchor), and the depth of the corner controls. */
const POPUP_REACH = 196;
const CONTROLS_DEPTH = 112;

/*
 * Tiles. The intended basemap is CARTO (Positron and Dark Matter), served as
 * separate land and place-name layers so only the land is tinted. CARTO now
 * asks for a free key on every tile URL; set NEXT_PUBLIC_CARTO_BASEMAPS_KEY
 * to use it. Until a key is set, the map falls back to the standard
 * OpenStreetMap tiles (names baked in), tinted the same way, so the preview
 * always shows a real map.
 */
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_BASEMAPS_KEY;

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const CARTO_ATTRIBUTION = `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions">CARTO</a>`;

type TileSet = { base: string; labels: string | null; provider: "carto" | "osm"; attribution: string };

function tileSet(dark: boolean): TileSet {
  if (CARTO_KEY) {
    const url = (style: string) => `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_KEY)}`;
    return {
      base: url(dark ? "dark_nolabels" : "light_nolabels"),
      labels: url(dark ? "dark_only_labels" : "light_only_labels"),
      provider: "carto",
      attribution: CARTO_ATTRIBUTION,
    };
  }
  return { base: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", labels: null, provider: "osm", attribution: OSM_ATTRIBUTION };
}

function markerHtml(p: Practice) {
  const side = p.labelSide === "left" ? styles.chipLeft : styles.chipRight;
  return (
    `<span class="${styles.pin}"><span class="${styles.pulse}"></span><span class="${styles.dot}"></span></span>` +
    `<span class="${styles.chip} ${side}" aria-hidden="true">${p.label}</span>`
  );
}

/** Room left around the markers when every practice is framed: clear of the corner controls and the chips. */
function framePadding(L: typeof Leaflet, map: Leaflet.Map) {
  const narrow = map.getSize().x < 560;
  return {
    paddingTopLeft: L.point(narrow ? 36 : 80, narrow ? 76 : 96),
    paddingBottomRight: L.point(narrow ? 36 : 80, narrow ? 44 : 64),
  };
}

/**
 * Plain Leaflet inside a client component. Leaflet is imported inside the
 * effect, so nothing touches `window` during the server render, and the map
 * is removed again on unmount.
 *
 * The page keeps scrolling past the map: the wheel never zooms, and on touch
 * screens one finger scrolls the page while pinch and the zoom buttons still
 * work. Markers are keyboard reachable, and the location list beside the map
 * is the accessible way to the same information.
 */
export function PracticeMap({ active, setActive, ref, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markersRef = useRef(new Map<string, Leaflet.Marker>());
  const layersRef = useRef<Layers | null>(null);
  const pendingOpen = useRef<(() => void) | null>(null);
  /** Set while we close a popup ourselves, so the close is not read as "deselect". */
  const quietClose = useRef(false);

  const [portals, setPortals] = useState<Portals | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  const reduce = useReducedMotion();
  const reduceRef = useRef(reduce);
  const setActiveRef = useRef(setActive);
  useEffect(() => {
    reduceRef.current = reduce;
    setActiveRef.current = setActive;
  }, [reduce, setActive]);

  const dark = useMediaQuery("(prefers-color-scheme: dark)");

  /* Build the map once. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let map: Leaflet.Map | null = null;
    const markers = markersRef.current;

    // Escape closes an open popup from anywhere in the map (Leaflet only
    // listens while the map itself has focus) and hands focus back to its pin.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      markers.forEach((marker) => {
        if (!marker.isPopupOpen()) return;
        marker.closePopup();
        marker.getElement()?.focus({ preventScroll: true });
      });
    };
    el.addEventListener("keydown", onKeyDown);

    import("leaflet").then((mod) => {
      if (cancelled) return;
      const L = (mod as unknown as { default?: typeof Leaflet }).default ?? mod;
      leafletRef.current = L;

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const touchFirst = window.matchMedia("(pointer: coarse)").matches;

      map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: !touchFirst,
        touchZoom: true,
        keyboard: true,
        zoomSnap: 0.25,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
      });
      mapRef.current = map;
      // Frame every practice first: Leaflet only builds marker elements once the map has a view.
      map.fitBounds(L.latLngBounds(practices.map((p) => p.coords)), { ...framePadding(L, map), animate: false });

      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

      const tiles = tileSet(prefersDark);
      const base = L.tileLayer(tiles.base, {
        subdomains: "abcd",
        maxZoom: MAX_ZOOM,
        maxNativeZoom: tiles.provider === "osm" ? 19 : 20,
        className: `ngx-base ngx-${tiles.provider}`,
        attribution: tiles.attribution,
      }).addTo(map);
      const labels = tiles.labels ? L.tileLayer(tiles.labels, { subdomains: "abcd", maxZoom: MAX_ZOOM, className: "ngx-labels" }).addTo(map) : null;
      layersRef.current = { base, labels };

      const popups: Record<string, HTMLElement> = {};
      for (const p of practices) {
        const icon = L.divIcon({ className: styles.marker, html: markerHtml(p), iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -14] });
        const marker = L.marker(p.coords, { icon, keyboard: true, riseOnHover: true });
        const content = document.createElement("div");
        popups[p.id] = content;
        marker.bindPopup(content, {
          className: styles.popup,
          closeButton: false,
          minWidth: 268,
          maxWidth: 300,
          autoPanPadding: L.point(20, 20),
          // Keep an opened popup clear of the corner controls too.
          autoPanPaddingTopLeft: L.point(20, CONTROLS_DEPTH - 8),
        });
        marker.on("popupopen", () => setActiveRef.current(p.id));
        marker.on("popupclose", () => {
          if (!quietClose.current) setActiveRef.current((prev) => (prev === p.id ? null : prev));
        });
        marker.addTo(map);
        const node = marker.getElement();
        node?.setAttribute("aria-label", `${p.name}, ${p.city}`);
        markers.set(p.id, marker);
      }

      // Our own controls, rendered by React into Leaflet's corners.
      const corner = (position: Leaflet.ControlPosition) => {
        const node = L.DomUtil.create("div", styles.control);
        L.DomEvent.disableClickPropagation(node);
        const control = new L.Control({ position });
        control.onAdd = () => node;
        control.addTo(map!);
        return node;
      };
      const frame = corner("topleft");
      const zoomNode = corner("topright");

      map.on("zoomend", () => setZoom(map!.getZoom()));
      setZoom(map.getZoom());
      setPortals({ popups, zoom: zoomNode, frame });
    });

    return () => {
      cancelled = true;
      el.removeEventListener("keydown", onKeyDown);
      map?.remove();
      mapRef.current = null;
      layersRef.current = null;
      markers.clear();
    };
  }, []);

  /* Follow the colour scheme live. */
  useEffect(() => {
    const layers = layersRef.current;
    if (!layers) return;
    const tiles = tileSet(dark);
    layers.base.setUrl(tiles.base);
    if (tiles.labels) layers.labels?.setUrl(tiles.labels);
  }, [dark, portals]);

  /* Mark the selected practice: it pulses and rises above its neighbours. */
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const on = id === active;
      marker.getElement()?.classList.toggle(styles.isActive, on);
      marker.setZIndexOffset(on ? 1000 : 0);
    });
  }, [active, portals]);

  const closeQuietly = () => {
    const map = mapRef.current;
    if (!map) return;
    quietClose.current = true;
    map.closePopup();
    quietClose.current = false;
    if (pendingOpen.current) {
      map.off("moveend", pendingOpen.current);
      pendingOpen.current = null;
    }
  };

  const showAll = () => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    closeQuietly();
    setActive(null);
    const bounds = L.latLngBounds(practices.map((p) => p.coords));
    const padding = framePadding(L, map);
    if (reduceRef.current) map.fitBounds(bounds, { ...padding, animate: false });
    else map.flyToBounds(bounds, { ...padding, duration: FLY_SECONDS });
  };

  const focusPractice = (id: string) => {
    const map = mapRef.current;
    const marker = markersRef.current.get(id);
    if (!map || !marker) return;
    closeQuietly();
    setActive(id);

    // Land with the pin below centre so the pin and its open popup sit
    // centred together, and on a short (phone) map low enough that the popup
    // clears the corner controls, so the map never has to nudge itself again.
    const half = map.getSize().y / 2;
    const lift = Math.max(POPUP_REACH / 2, CONTROLS_DEPTH + POPUP_REACH - half);
    const target = map.unproject(map.project(marker.getLatLng(), FOCUS_ZOOM).subtract([0, lift]), FOCUS_ZOOM);

    const open = () => {
      pendingOpen.current = null;
      marker.openPopup();
    };
    pendingOpen.current = open;
    map.once("moveend", open);
    if (reduceRef.current) map.setView(target, FOCUS_ZOOM, { animate: false });
    else map.flyTo(target, FOCUS_ZOOM, { duration: FLY_SECONDS });
  };

  /** The popup's own close button: close it and put focus back on its pin, not on the page. */
  const closeAndReturn = (id: string) => {
    const marker = markersRef.current.get(id);
    marker?.closePopup();
    marker?.getElement()?.focus({ preventScroll: true });
  };

  const highlight = (id: string | null) => {
    markersRef.current.forEach((marker, key) => marker.getElement()?.classList.toggle(styles.isHover, key === id));
  };

  useImperativeHandle(ref, () => ({ focusPractice, showAll, highlight }));

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (delta > 0) map.zoomIn(delta, { animate: !reduceRef.current });
    else map.zoomOut(-delta, { animate: !reduceRef.current });
  };

  const control =
    "relative grid place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-[border-color,opacity] duration-300 ease-calm before:absolute before:-inset-0.5 before:content-[''] hover:border-line-strong disabled:opacity-40 disabled:hover:border-line";

  return (
    <motion.div
      className={`relative isolate overflow-hidden rounded-surface bg-paper-2 ${className}`}
      initial={{ clipPath: "inset(7% 5% 7% 5% round 28px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE }}
    >
      <div ref={containerRef} role="region" aria-label={locations.mapLabel} className={`${styles.map} absolute inset-0`} />

      {portals &&
        createPortal(
          <button type="button" onClick={showAll} className={`${control} h-10 gap-2 px-4 text-[0.875rem] font-medium [grid-auto-flow:column]`}>
            <CornersOut size={16} weight="regular" aria-hidden="true" className="text-brass-ink" />
            {locations.showAll}
          </button>,
          portals.frame,
        )}

      {portals &&
        createPortal(
          <div className="flex flex-col gap-1.5">
            <button type="button" aria-label={locations.zoomIn} onClick={() => zoomBy(1)} disabled={zoom !== null && zoom >= MAX_ZOOM} className={`${control} size-10`}>
              <Plus size={16} weight="regular" aria-hidden="true" />
            </button>
            <button type="button" aria-label={locations.zoomOut} onClick={() => zoomBy(-1)} disabled={zoom !== null && zoom <= MIN_ZOOM} className={`${control} size-10`}>
              <Minus size={16} weight="regular" aria-hidden="true" />
            </button>
          </div>,
          portals.zoom,
        )}

      {portals &&
        practices.map((p) =>
          createPortal(<PracticePopup practice={p} onClose={() => closeAndReturn(p.id)} />, portals.popups[p.id], p.id),
        )}
    </motion.div>
  );
}
