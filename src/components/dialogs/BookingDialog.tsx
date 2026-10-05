"use client";

import type { TestSlug } from "@/content/site";
import { booking } from "@/content/site";
import { CloseButton, Modal } from "./Modal";

// STUB: replaced by the booking builder. Keep the exported signature.
export function BookingDialog({ open, onClose }: { open: boolean; initialTest?: TestSlug; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="booking-title" panelClassName="md:max-w-[760px]">
      <div className="p-8">
        <div className="flex justify-end">
          <CloseButton onClick={onClose} label={booking.closeLabel} />
        </div>
        <h2 id="booking-title" className="display-3">{booking.title}</h2>
      </div>
    </Modal>
  );
}
