"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, animate, motion, useMotionValue, type AnimationPlaybackControls, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Info } from "@phosphor-icons/react";
import type { TestSlug } from "@/content/site";
import { booking } from "@/content/site";
import { EASE } from "@/components/motion/primitives";
import { CloseButton, Modal } from "./Modal";
import { Inset } from "./booking/fields";
import { Progress } from "./booking/Progress";
import { StepTest } from "./booking/StepTest";
import { StepDetails } from "./booking/StepDetails";
import { StepPreview } from "./booking/StepPreview";
import { initialForm, isErrorKey, isValid, stepFields, validate, type BookingErrors, type BookingForm, type ErrorKey, type Step } from "./booking/model";

const stepVariants: Variants = {
  enter: ({ dir, reduce }: { dir: number; reduce: boolean }) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * 24 }),
  center: ({ reduce }: { dir: number; reduce: boolean }) => ({
    opacity: 1,
    x: 0,
    transition: { duration: reduce ? 0.2 : 0.6, ease: EASE },
  }),
  exit: ({ dir, reduce }: { dir: number; reduce: boolean }) => ({
    opacity: 0,
    x: reduce ? 0 : dir * -24,
    transition: { duration: reduce ? 0.12 : 0.28, ease: EASE },
  }),
};

/**
 * The appointment request walkthrough: test, details, preview. A demonstration
 * only. Nothing is sent or stored; the provider remounts this component on
 * every open, so the sample details vanish when it closes.
 */
export function BookingDialog({ open, initialTest, onClose }: { open: boolean; initialTest?: TestSlug; onClose: () => void }) {
  const reduce = Boolean(useReducedMotion());
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState<BookingForm>(() => initialForm(initialTest));
  const [errors, setErrors] = useState<BookingErrors>({});

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeadingOnEnter = useRef(false);
  const initialFocusSet = useRef(false);
  const pendingFocus = useRef<ErrorKey | null>(null);

  const testRef = useRef<HTMLInputElement>(null);
  const referralRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ackRef = useRef<HTMLInputElement>(null);

  // Laptop screens are often 800px tall or less once the browser has taken
  // its share, so from md on a short viewport the panel tightens its rhythm
  // (the md:[@media(max-height:860px)] classes here and in the steps) until
  // the first step fits whole. The action bar covers anything that still
  // runs long.

  // The step area eases between heights instead of snapping, so the panel
  // breathes rather than jumps as steps and messages come and go.
  const height = useMotionValue<number | string>("auto");
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let measured = false;
    let controls: AnimationPlaybackControls | undefined;
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight;
      controls?.stop();
      if (!measured || reduce) {
        measured = true;
        height.set(next);
        return;
      }
      controls = animate(height, next, { duration: 0.5, ease: EASE });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [height, reduce, open]);

  // Move focus to the first invalid field once its message is in the DOM, so
  // assistive technology reads the field and its error together.
  useEffect(() => {
    const key = pendingFocus.current;
    if (!key) return;
    pendingFocus.current = null;
    const refs: Record<ErrorKey, RefObject<HTMLElement | null>> = {
      test: testRef,
      referral: referralRef,
      name: nameRef,
      phone: phoneRef,
      email: emailRef,
      ack: ackRef,
    };
    refs[key].current?.focus();
  }, [errors]);

  // The first step heading carries the autofocus attribute, so when the native
  // dialog opens it lands on the question rather than on the scrolling panel.
  const setHeading = useCallback((el: HTMLHeadingElement | null) => {
    headingRef.current = el;
    if (el && !initialFocusSet.current) {
      initialFocusSet.current = true;
      el.setAttribute("autofocus", "");
    }
  }, []);

  const setField = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // Once a message is showing, clear it the moment the field becomes valid.
    if (isErrorKey(key) && errors[key] && isValid(next, key)) {
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest[key];
        return rest;
      });
    }
  };

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setErrors({});
    focusHeadingOnEnter.current = true;
    setStep(next);
    // The panel itself scrolls on short screens; bring the progress back into view.
    const scroller = rootRef.current?.parentElement;
    if (scroller && scroller.scrollTop > 0) scroller.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const submitStep = (keys: ErrorKey[], next: Step) => {
    const found = validate(form, keys);
    const first = keys.find((k) => found[k]);
    if (first) {
      pendingFocus.current = first;
      setErrors(found);
      return;
    }
    goTo(next);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="booking-title" describedBy="booking-description" panelClassName="md:max-w-[760px]">
      {/* No bottom padding: every step ends in its action bar, which is the panel's footer. */}
      <div ref={rootRef} className="px-6 md:px-10">
        <div className="sticky top-0 z-10 -mx-6 flex items-center justify-end gap-6 bg-surface px-6 pb-2 pt-5 md:-mx-10 md:px-10 md:pt-7 md:[@media(max-height:860px)]:pt-5">
          <CloseButton onClick={onClose} label={booking.closeLabel} />
        </div>

        <h2 id="booking-title" className="display-3 mt-3 md:[@media(max-height:860px)]:mt-2">
          {booking.title}
        </h2>
        <Inset id="booking-description" icon={Info} className="mt-5 md:[@media(max-height:860px)]:mt-4">
          {booking.notice}
        </Inset>

        <div className="mt-8 md:[@media(max-height:860px)]:mt-5">
          <Progress step={step} />
        </div>

        <div className="mt-7 border-t border-line pt-7 md:[@media(max-height:860px)]:mt-5 md:[@media(max-height:860px)]:pt-5">
          {/* The clip spans the panel edge to edge: it hides the sideways
              slide between steps and the height easing, and leaves room for
              the action bar to run under the panel's side padding. Clip does
              not create a scroll container, so that bar still sticks to the
              panel's scrollport. */}
          <motion.div style={{ height }} className="-mx-6 overflow-clip md:-mx-10">
            <div ref={contentRef} className="px-6 md:px-10">
              <AnimatePresence mode="wait" initial={false} custom={{ dir: direction, reduce }}>
                <motion.div
                  key={step}
                  custom={{ dir: direction, reduce }}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onAnimationComplete={(definition) => {
                    if (definition !== "center" || !focusHeadingOnEnter.current) return;
                    focusHeadingOnEnter.current = false;
                    headingRef.current?.focus({ preventScroll: true });
                  }}
                >
                  {step === 0 ? (
                    <StepTest
                      form={form}
                      errors={errors}
                      onTest={(value) => setField("test", value)}
                      onReferral={(value) => setField("referral", value)}
                      onContinue={() => submitStep(stepFields[0], 1)}
                      headingRef={setHeading}
                      testRef={testRef}
                      referralRef={referralRef}
                    />
                  ) : step === 1 ? (
                    <StepDetails
                      form={form}
                      errors={errors}
                      onField={(key, value) => setField(key, value)}
                      onAck={(checked) => setField("ack", checked)}
                      onBack={() => goTo(0)}
                      onSubmit={() => submitStep(stepFields[1], 2)}
                      headingRef={setHeading}
                      nameRef={nameRef}
                      phoneRef={phoneRef}
                      emailRef={emailRef}
                      ackRef={ackRef}
                    />
                  ) : (
                    <StepPreview form={form} onEdit={() => goTo(1)} onDone={onClose} headingRef={setHeading} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </Modal>
  );
}
