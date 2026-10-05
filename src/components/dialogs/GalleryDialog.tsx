"use client";

import { gallery } from "@/content/site";
import { CloseButton, Modal } from "./Modal";

// STUB: replaced by the gallery builder. Keep the exported signature.
export function GalleryDialog({ open, onClose }: { open: boolean; index: number; onIndexChange: (index: number) => void; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="gallery-title" variant="fullscreen" panelClassName="bg-navy-3">
      <div className="p-8 text-on-navy">
        <CloseButton onClick={onClose} label={gallery.close} tone="light" />
        <h2 id="gallery-title">{gallery.title}</h2>
      </div>
    </Modal>
  );
}
