import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = "ghost",
  size = "md",
  className = "",
  ...rest
}: Props) {
  const v =
    variant === "primary"
      ? "btn-primary"
      : variant === "danger"
      ? "btn-danger"
      : variant === "secondary"
      ? "btn"
      : "btn";
  const s = size === "sm" ? "btn-small" : "";
  return (
    <button className={[v, s, className].filter(Boolean).join(" ")} {...rest} />
  );
}
