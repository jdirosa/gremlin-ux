import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { avatarRecipe, type AvatarVariantProps } from "./avatar.recipe";

export type AvatarProps = AvatarVariantProps & {
  src?: string;
  alt: string;
  fallback?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar({ src, alt, fallback, size, shape, border, className, ...rest }, ref) {
    const [imgError, setImgError] = useState(false);

    const initials = fallback ?? alt
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <span
        ref={ref}
        className={cx(avatarRecipe({ size, shape, border }), className)}
        role="img"
        aria-label={alt}
        {...rest}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initials
        )}
      </span>
    );
  },
);
