"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { ArrowRight, ArrowUpRight, DownloadSimple } from "@phosphor-icons/react";
import { useHashNavigation } from "@/components/layout/SmoothScroll";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { MaskLines } from "@/components/motion/primitives";
import { site, type TestSlug } from "@/content/site";

/* Icons: Phosphor only, regular weight at 18px, or "light" at larger sizes. */

type LinkishProps = {
  href: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
  external?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  "aria-label"?: string;
  "aria-current"?: "page" | "location" | "step" | boolean;
};

/** Internal links glide to same-page anchors; external links open safely. */
export function SmartLink({ href, children, className, download, external, onClick, onFocus, ...rest }: LinkishProps) {
  const navigate = useHashNavigation();
  if (external || download) {
    return (
      <a
        href={href}
        className={className}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
        onFocus={onFocus}
        aria-label={rest["aria-label"]}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={className}
      aria-label={rest["aria-label"]}
      aria-current={rest["aria-current"]}
      onFocus={onFocus}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.();
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        navigate(href, e);
      }}
    >
      {children}
    </Link>
  );
}

type ButtonVariant = "primary" | "brass" | "outline" | "outline-light";

const variantClass: Record<ButtonVariant, string> = {
  // On the dark theme navy would sink into the page, so the primary action turns brass.
  primary: "bg-navy text-on-navy hover:bg-navy-2 dark:bg-brass dark:text-navy-3 dark:hover:bg-brass dark:hover:brightness-[1.06]",
  brass: "bg-brass text-navy-3 hover:brightness-[1.06]",
  outline: "border border-line-strong text-ink hover:border-ink",
  "outline-light": "border border-on-navy-line text-on-navy hover:border-on-navy",
};

const iconFor = { arrow: ArrowRight, external: ArrowUpRight, download: DownloadSimple } as const;

type ButtonProps = {
  children: string;
  variant?: ButtonVariant;
  icon?: keyof typeof iconFor | null;
  className?: string;
  size?: "md" | "lg";
} & (
  | { href: string; download?: boolean; external?: boolean; onClick?: never; type?: never; disabled?: never }
  | { href?: never; download?: never; external?: never; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }
);

/**
 * Pill button. On hover the label rolls up and a fresh copy rolls in from
 * below while the icon nudges forward; on press it settles down 1px.
 */
export function Button(props: ButtonProps) {
  const { children, variant = "primary", icon = "arrow", className = "", size = "md" } = props;
  const Icon = icon ? iconFor[icon] : null;
  const classes = `group relative inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,filter,transform] duration-300 ease-calm active:translate-y-px disabled:opacity-50 ${
    size === "lg" ? "h-14 pl-7 pr-2.5 text-[1.0625rem]" : "h-12 pl-6 pr-2 text-[0.9375rem]"
  } ${Icon ? "" : size === "lg" ? "pr-7!" : "pr-6!"} ${variantClass[variant]} ${className}`;

  const inner = (
    <>
      <span className="relative block overflow-hidden leading-none">
        <span className="block py-1 transition-transform duration-500 ease-calm group-hover:-translate-y-full motion-reduce:group-hover:translate-y-0">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full py-1 transition-transform duration-500 ease-calm group-hover:translate-y-0 motion-reduce:hidden">
          {children}
        </span>
      </span>
      {Icon && (
        <span
          className={`grid shrink-0 place-items-center rounded-full transition-transform duration-500 ease-calm group-hover:translate-x-0.5 ${size === "lg" ? "size-9" : "size-8"} ${
            variant === "primary" ? "bg-on-navy/10 dark:bg-navy-3/10" : variant === "brass" ? "bg-navy-3/10" : "bg-ink/5"
          }`}
        >
          <Icon size={16} weight="regular" aria-hidden="true" />
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <SmartLink href={props.href} className={classes} download={props.download} external={props.external}>
        {inner}
      </SmartLink>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled} className={classes}>
      {inner}
    </button>
  );
}

/** Opens the appointment request walkthrough, optionally with a test preselected. */
export function BookButton({ test, variant = "primary", size, className, label = site.bookLabel }: { test?: TestSlug; variant?: ButtonVariant; size?: "md" | "lg"; className?: string; label?: string }) {
  const { openBooking } = useDialogs();
  return (
    <Button variant={variant} size={size} className={className} onClick={() => openBooking(test)}>
      {label}
    </Button>
  );
}

/**
 * Text link with a resting hairline underline; on hover a full-strength line
 * draws over it from the left and the arrow steps forward.
 */
export function TextLink({
  href,
  children,
  className = "",
  arrow = true,
  external,
  onClick,
  onFocus,
  tone = "ink",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  external?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  tone?: "ink" | "light";
}) {
  const body = (
    <>
      <span
        className={`bg-no-repeat pb-1 transition-[background-size] duration-500 ease-calm [background-position:0_100%,0_100%] [background-size:100%_1px,0%_1px] group-hover:[background-size:100%_1px,100%_1px] ${
          tone === "light"
            ? "[background-image:linear-gradient(rgb(238_240_234/0.3),rgb(238_240_234/0.3)),linear-gradient(var(--brass),var(--brass))]"
            : "[background-image:linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(var(--ink),var(--ink))]"
        }`}
      >
        {children}
      </span>
      {arrow &&
        (external ? (
          <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 transition-transform duration-500 ease-calm group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        ) : (
          <ArrowRight size={16} aria-hidden="true" className="shrink-0 transition-transform duration-500 ease-calm group-hover:translate-x-1" />
        ))}
    </>
  );
  const classes = `group inline-flex min-h-11 items-center gap-2 font-medium ${tone === "light" ? "text-on-navy" : "text-ink"} ${className}`;
  if (!href) {
    return (
      <button type="button" onClick={onClick} onFocus={onFocus} className={classes}>
        {body}
      </button>
    );
  }
  return (
    <SmartLink href={href} className={classes} external={external} onClick={onClick} onFocus={onFocus}>
      {body}
    </SmartLink>
  );
}

/** Two-part section headline: plain first sentence, soft italic second. */
export function SectionTitle({
  lines,
  as = "h2",
  size = 2,
  className = "",
  id,
  trigger,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  size?: 1 | 2 | 3;
  className?: string;
  id?: string;
  trigger?: "view" | "mount";
}) {
  return <MaskLines id={id} as={as} lines={lines} trigger={trigger} className={`display-${size} ${className}`} />;
}
