import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "gold" | "surface" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-label-md text-label-md uppercase tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  gold: "bg-secondary text-on-secondary-fixed hover:bg-secondary-fixed shadow-lg",
  surface:
    "bg-surface-container-highest text-on-surface hover:bg-surface-variant",
  outline: "border border-outline-variant text-on-surface hover:border-on-surface",
  ghost: "text-on-surface hover:text-secondary",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 rounded",
  md: "px-xl py-4 rounded",
  lg: "px-xl py-4 text-title-lg rounded",
};

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentProps<"button">, "className"> & { href?: undefined };

type ButtonAsLink = ButtonOwnProps &
  Omit<ComponentProps<typeof Link>, "className"> & { href: string };

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "gold", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ComponentProps<typeof Link>;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentProps<"button">)}>
      {props.children}
    </button>
  );
}

export type { Variant as ButtonVariant, Size as ButtonSize };
