"use client";

import { ArrowRight, ArrowUpRight, CaretRight, CheckCircle, Info, type IconWeight } from "@phosphor-icons/react";

/*
 * Phosphor icons reach the server-rendered test page through this one client
 * leaf, so the page body itself can stay a server component.
 */
const icons = {
  arrow: ArrowRight,
  external: ArrowUpRight,
  caret: CaretRight,
  check: CheckCircle,
  info: Info,
} as const;

export type TestIconName = keyof typeof icons;

export function TestIcon({ name, size = 18, weight = "regular", className }: { name: TestIconName; size?: number; weight?: IconWeight; className?: string }) {
  const Icon = icons[name];
  return <Icon size={size} weight={weight} className={className} aria-hidden="true" />;
}
