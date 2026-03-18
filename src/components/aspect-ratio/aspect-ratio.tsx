import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cx, css } from "@styled-system/css";

// ── AspectRatio ───────────────────────────────────────────────────────

const baseStyles = css({
  position: "relative",
  width: "100%",

  "& > *": {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export type AspectRatioProps = {
  /** Aspect ratio as a number (e.g. 16/9, 4/3, 1). Defaults to 16/9. */
  ratio?: number;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "style">;

/**
 * AspectRatio -- constrains children to a specific aspect ratio.
 *
 * Wraps content in a div with CSS aspect-ratio. Children are absolutely
 * positioned to fill the container with object-fit: cover.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="hero.jpg" alt="Hero" />
 * </AspectRatio>
 *
 * <AspectRatio ratio={1}>
 *   <video src="clip.mp4" />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio({ ratio = 16 / 9, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx(baseStyles, className)}
        style={{ aspectRatio: String(ratio) }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
