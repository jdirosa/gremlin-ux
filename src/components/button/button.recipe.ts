import { cva } from "@styled-system/css";

/**
 * Button recipe — Panda CSS `cva()` with squash-and-stretch motion.
 *
 * Variants: solid (cherry red), outline (accent border), ghost (transparent).
 * Sizes: sm, md, lg.
 * Compound variants handle icon-only and loading states.
 *
 * All motion is wrapped in `_motionSafe` so it respects `prefers-reduced-motion`.
 * Only semantic tokens are referenced — never raw values.
 */
export const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
    fontWeight: "semibold",
    lineHeight: "tight",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    borderRadius: "md",
    borderStyle: "solid",
    borderWidth: "medium",
    whiteSpace: "nowrap",
    textDecoration: "none",
    outline: "none",
    // Transition for background/border colors — always active
    transition: "background-color token(durations.fast) token(easings.default), border-color token(durations.fast) token(easings.default), color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.default), opacity token(durations.fast) token(easings.default)",
    // Squash-and-stretch motion gated behind motionSafe
    _motionSafe: {
      transition: "background-color token(durations.fast) token(easings.default), border-color token(durations.fast) token(easings.default), color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.default), opacity token(durations.fast) token(easings.default), transform token(durations.normal) token(easings.reluctant)",
    },
    // Focus ring — cherry red glow on keyboard focus only
    _focusVisible: {
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
      _motionSafe: {
        animation: "stretch token(durations.normal) token(easings.rubber)",
      },
    },
    // aria-disabled styling (not HTML disabled — keeps element focusable)
    "&[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },

  variants: {
    /** Visual style of the button */
    variant: {
      solid: {
        bg: "accent",
        color: "fg.onEmphasis",
        borderColor: "border",
        borderWidth: "thick",
        boxShadow: "inkOffset",
        _hover: {
          bg: "accent.hover",
          borderColor: "border.hover",
          _motionSafe: {
            transform: "scaleY(1.02) scaleX(0.98)",
          },
        },
        _active: {
          bg: "accent",
          boxShadow: "none",
          _motionSafe: {
            transform: "scaleY(0.92) scaleX(1.06)",
            transition: "transform token(durations.instant) token(easings.out)",
          },
        },
      },
      outline: {
        bg: "transparent",
        color: "accent",
        borderColor: "accent",
        _hover: {
          bg: "accent.subtle",
          borderColor: "accent.hover",
          color: "accent.hover",
          _motionSafe: {
            transform: "scaleY(1.02) scaleX(0.98)",
          },
        },
        _active: {
          bg: "accent.subtle",
          _motionSafe: {
            transform: "scaleY(0.92) scaleX(1.06)",
            transition: "transform token(durations.instant) token(easings.out)",
          },
        },
      },
      ghost: {
        bg: "transparent",
        color: "fg",
        borderColor: "border",
        _hover: {
          bg: "bg.muted",
          borderColor: "border.hover",
          _motionSafe: {
            transform: "scaleY(1.02) scaleX(0.98)",
          },
        },
        _active: {
          bg: "bg.emphasis",
          _motionSafe: {
            transform: "scaleY(0.92) scaleX(1.06)",
            transition: "transform token(durations.instant) token(easings.out)",
          },
        },
      },
    },

    /** Size of the button */
    size: {
      sm: {
        fontSize: "sm",
        px: "3",
        py: "1",
        minHeight: "8",
      },
      md: {
        fontSize: "md",
        px: "4",
        py: "2",
        minHeight: "10",
      },
      lg: {
        fontSize: "lg",
        px: "6",
        py: "3",
        minHeight: "12",
      },
    },

    /** Whether the button is in a loading state */
    loading: {
      true: {
        cursor: "wait",
        _motionSafe: {
          animation: "pulse 1.5s token(easings.inOut) infinite",
        },
      },
    },

    /** Whether the button is icon-only (square aspect ratio) */
    iconOnly: {
      true: {
        px: "0",
        aspectRatio: "1",
      },
    },
  },

  // Icon-only size adjustments (override padding)
  compoundVariants: [
    {
      iconOnly: true,
      size: "sm",
      css: { width: "8", px: "0" },
    },
    {
      iconOnly: true,
      size: "md",
      css: { width: "10", px: "0" },
    },
    {
      iconOnly: true,
      size: "lg",
      css: { width: "12", px: "0" },
    },
  ],

  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

export type ButtonVariantProps = NonNullable<Parameters<typeof buttonRecipe>[0]>;
