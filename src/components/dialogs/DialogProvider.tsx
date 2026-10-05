"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { testSlugs, type TestSlug } from "@/content/site";
import { BookingDialog } from "./BookingDialog";
import { GalleryDialog } from "./GalleryDialog";
import { PrivacyDialog } from "./PrivacyDialog";

type DialogApi = {
  openBooking: (test?: TestSlug) => void;
  openGallery: (index?: number) => void;
  openPrivacy: () => void;
};

const DialogContext = createContext<DialogApi | null>(null);

export function useDialogs() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialogs must be used inside <DialogProvider>");
  return ctx;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<{ open: boolean; test?: TestSlug; session: number }>({ open: false, session: 0 });
  const [gallery, setGallery] = useState({ open: false, index: 0 });
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const openBooking = useCallback((test?: TestSlug) => setBooking((b) => ({ open: true, test, session: b.session + 1 })), []);
  const openGallery = useCallback((index = 0) => setGallery({ open: true, index }), []);
  const openPrivacy = useCallback(() => setPrivacyOpen(true), []);

  // Deep link from the test pages of the original site: /?test=eeg opens the
  // request walkthrough with that test already chosen.
  useEffect(() => {
    const test = new URLSearchParams(window.location.search).get("test");
    if (test && (testSlugs as string[]).includes(test)) {
      const t = window.setTimeout(() => openBooking(test as TestSlug), 400);
      return () => window.clearTimeout(t);
    }
  }, [openBooking]);

  const api = useMemo(() => ({ openBooking, openGallery, openPrivacy }), [openBooking, openGallery, openPrivacy]);

  return (
    <DialogContext.Provider value={api}>
      {children}
      <BookingDialog
        key={booking.session}
        open={booking.open}
        initialTest={booking.test}
        onClose={() => setBooking((b) => ({ ...b, open: false }))}
      />
      <GalleryDialog
        open={gallery.open}
        index={gallery.index}
        onIndexChange={(index) => setGallery((g) => ({ ...g, index }))}
        onClose={() => setGallery((g) => ({ ...g, open: false }))}
      />
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </DialogContext.Provider>
  );
}
