import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

type CommonProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

function getVariantClasses(variant: ButtonVariant) {
  if (variant === "ghost") {
    return "rounded-full px-6 py-3 text-sm font-bold text-on-primary-fixed-variant transition-colors hover:bg-surface-container-high";
  }

  return "rounded-xl bg-gradient-to-br from-secondary to-secondary-container px-8 py-4 text-sm font-bold text-white shadow-xl shadow-secondary/20 transition-all hover:scale-[1.02] active:scale-95";
}

function content(icon: ReactNode, children: ReactNode) {
  return (
    <>
      {icon ? <span className="text-lg leading-none">{icon}</span> : null}
      <span>{children}</span>
    </>
  );
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, className = "", icon, variant = "primary" } = props;
  const classes = `inline-flex items-center justify-center gap-3 ${getVariantClasses(variant)} ${className}`.trim();

  if ("href" in props) {
    const { href } = props;

    return (
      <Link href={href} className={classes}>
        {content(icon, children)}
      </Link>
    );
  }

  const {
    type = "button",
    children: _children,
    className: _className,
    icon: _icon,
    variant: _variant,
    ...buttonProps
  } = props;

  return (
    <button {...buttonProps} type={type} className={classes}>
      {content(icon, children)}
    </button>
  );
}
