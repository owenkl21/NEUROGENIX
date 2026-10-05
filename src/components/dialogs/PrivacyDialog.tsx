"use client";

import { privacy } from "@/content/site";
import { Button } from "@/components/ui";
import { CloseButton, Modal } from "./Modal";

export function PrivacyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="privacy-title" panelClassName="md:max-w-[640px]">
      <div className="px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
        <div className="flex items-start justify-between gap-6">
          <h2 id="privacy-title" className="display-3 pt-1">
            {privacy.title}
          </h2>
          <CloseButton onClick={onClose} label={privacy.closeLabel} />
        </div>
        <div className="mt-6 space-y-4 text-muted">
          {privacy.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-8">
          <Button onClick={onClose} icon={null}>
            {privacy.close}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
