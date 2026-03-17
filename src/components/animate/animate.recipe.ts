import { cva } from "@styled-system/css";

/**
 * Animate recipe — scroll-triggered entrance animations.
 *
 * Two variant axes:
 * - `animation` — direction the element enters from (up, down, left, right, scale, fade)
 * - `feel` — animation character (smooth uses CSS transitions, rubber uses bounce keyframes)
 *
 * Elements start invisible (`opacity: 0`). When `data-visible="true"` is set,
 * the animation fires. All motion is gated behind `_motionSafe`.
 */
export const animateRecipe = cva({
  base: {
    opacity: 0,
    // Reduced-motion fallback: simple opacity transition
    transition: "opacity token(durations.dramatic) token(easings.out)",
    "&[data-visible=true]": {
      opacity: 1,
    },
  },
  variants: {
    /** Direction the element enters from */
    animation: {
      up: {
        _motionSafe: { transform: "translateY(30px)" },
      },
      down: {
        _motionSafe: { transform: "translateY(-30px)" },
      },
      left: {
        _motionSafe: { transform: "translateX(30px)" },
      },
      right: {
        _motionSafe: { transform: "translateX(-30px)" },
      },
      scale: {
        _motionSafe: { transform: "scale(0.92)" },
      },
      fade: {
        // Fade only — no transform
      },
    },
    /** Animation character */
    feel: {
      smooth: {
        _motionSafe: {
          transition:
            "opacity token(durations.dramatic) token(easings.out), transform token(durations.dramatic) token(easings.rubber)",
        },
        "&[data-visible=true]": {
          _motionSafe: {
            transform: "none",
          },
        },
      },
      rubber: {
        // Rubber feel uses keyframe animations — applied via compound variants below.
        // Keep base opacity behavior; keyframes handle the rest.
      },
    },
  },
  compoundVariants: [
    // ── Rubber + direction compound variants ──────────────────────
    {
      feel: "rubber",
      animation: "up",
      css: {
        "&[data-visible=true]": {
          _motionSafe: {
            animation: "rubberBounceUp token(durations.dramatic) token(easings.out) forwards",
          },
        },
      },
    },
    {
      feel: "rubber",
      animation: "down",
      css: {
        "&[data-visible=true]": {
          _motionSafe: {
            animation: "rubberBounceDown token(durations.dramatic) token(easings.out) forwards",
          },
        },
      },
    },
    {
      feel: "rubber",
      animation: "left",
      css: {
        "&[data-visible=true]": {
          _motionSafe: {
            animation: "rubberBounceLeft token(durations.dramatic) token(easings.out) forwards",
          },
        },
      },
    },
    {
      feel: "rubber",
      animation: "right",
      css: {
        "&[data-visible=true]": {
          _motionSafe: {
            animation: "rubberBounceRight token(durations.dramatic) token(easings.out) forwards",
          },
        },
      },
    },
    {
      feel: "rubber",
      animation: "scale",
      css: {
        "&[data-visible=true]": {
          _motionSafe: {
            animation: "rubberBounceScale token(durations.dramatic) token(easings.out) forwards",
          },
        },
      },
    },
    {
      feel: "rubber",
      animation: "fade",
      css: {
        // Rubber doesn't apply to pure fade — use same smooth transition
        _motionSafe: {
          transition: "opacity token(durations.dramatic) token(easings.out)",
        },
        "&[data-visible=true]": {
          _motionSafe: {
            transform: "none",
          },
        },
      },
    },
  ],
  defaultVariants: {
    animation: "up",
    feel: "smooth",
  },
});

export type AnimateVariantProps = NonNullable<
  Parameters<typeof animateRecipe>[0]
>;
