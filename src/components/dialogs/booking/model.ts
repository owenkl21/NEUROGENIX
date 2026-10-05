import { booking, type TestSlug } from "@/content/site";

/**
 * Pure state and rules for the appointment request walkthrough. Nothing here
 * talks to a network or to storage: the request only ever lives in the open
 * dialog and disappears when it closes.
 */

export type Step = 0 | 1 | 2;

export type BookingForm = {
  test: string;
  referral: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  method: string;
  ack: boolean;
};

export type ErrorKey = keyof typeof booking.errors;
export type BookingErrors = Partial<Record<ErrorKey, string>>;

export const stepFields: Record<0 | 1, ErrorKey[]> = {
  0: ["test", "referral"],
  1: ["name", "phone", "email", "ack"],
};

export function isErrorKey(key: string): key is ErrorKey {
  return key in booking.errors;
}

export function initialForm(initialTest?: TestSlug): BookingForm {
  const preset = initialTest ? booking.step1.choices.find((c) => c.slug === initialTest) : undefined;
  return {
    test: preset?.value ?? "",
    referral: "",
    name: "",
    phone: "",
    email: "",
    date: "",
    method: booking.step2.method.options[0],
    ack: false,
  };
}

const PHONE_RE = /^[+0-9\s().-]{7,25}$/;
// The HTML living standard's email grammar, with at least one dot in the domain.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** The same rule for the pattern attribute, escaped so it compiles under the v flag. */
export const PHONE_PATTERN = "[+0-9\\s\\(\\)\\.\\-]{7,25}";

const checks: Record<ErrorKey, (f: BookingForm) => boolean> = {
  test: (f) => f.test !== "",
  referral: (f) => f.referral !== "",
  name: (f) => f.name.trim() !== "",
  phone: (f) => PHONE_RE.test(f.phone.trim()),
  email: (f) => EMAIL_RE.test(f.email.trim()),
  ack: (f) => f.ack,
};

export function isValid(form: BookingForm, key: ErrorKey) {
  return checks[key](form);
}

export function validate(form: BookingForm, keys: ErrorKey[]): BookingErrors {
  const found: BookingErrors = {};
  for (const key of keys) if (!checks[key](form)) found[key] = booking.errors[key];
  return found;
}

/** Today's date in the practice's time zone, as YYYY-MM-DD for a date input's min. */
export function todayInJohannesburg() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(new Date());
}

export function formatPreferredDate(date: string) {
  if (!date) return booking.step3.flexible;
  const parsed = new Date(`${date}T12:00:00+02:00`);
  if (Number.isNaN(parsed.getTime())) return booking.step3.flexible;
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeZone: "Africa/Johannesburg" }).format(parsed);
}
