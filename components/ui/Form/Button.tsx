"use client";

import { ReactNode, MouseEventHandler } from "react";
import Link from "next/link";

interface ButtonProps {
  to?: string;
  href?: string; 
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
  [x: string]: any;
}

export default function Button({
  to,
  href,
  type = "button",
  className,
  onClick,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  if (to) {
    return (
      <Link href={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={className} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
