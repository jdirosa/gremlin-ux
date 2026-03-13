import { cva } from "@styled-system/css";

/**
 * Entrance animation recipe — CSS-only scroll-reveal primitives.
 *
 * The design system owns the motion vocabulary (what enters, how it moves,
 * what easing and duration). Consuming apps own the trigger logic
 * (IntersectionObserver, scroll position, timeout, etc.).
 *
 * Usage: apply the recipe class, then set `data-visible="true"` on the
 * element when you want the entrance to fire. The recipe handles the rest.
 *
 * All motion is gated behind `_motionSafe` to respect `prefers-reduced-motion`.
 * When reduced motion is active, elements transition with a simple opacity fade.
 */
export const entranceRecipe = cva({
  base: {
    // Elements start invisible
    opacity: 0,
    // Reduced-motion fallback: simple opacity transition
    transition: "opacity token(durations.dramatic) token(easings.out)",
    // Full motion: opacity + transform
    _motionSafe: {
      transition:
        "opacity token(durations.dramatic) token(easings.out), transform token(durations.dramatic) token(easings.rubber)",
    },
    // When data-visible="true", animate to final state
    "&[data-visible=true]": {
      opacity: 1,
      transform: "none",
    },
  },
  variants: {
    /** Direction the element enters from */
    direction: {
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
      none: {
        // Fade only, no movement
      },
    },
  },
  defaultVariants: {
    direction: "up",
  },
});

export type EntranceVariantProps = NonNullable<
  Parameters<typeof entranceRecipe>[0]
>;
