import { cva } from "@styled-system/css";

/**
 * TextInput recipe — Panda CSS `cva()` for text input styling.
 *
 * Variants: size (sm, md, lg).
 * States: error (border color + shake animation).
 *
 * Focus uses cherry red border with subtle box-shadow expansion.
 * All motion is wrapped in `_motionSafe` so it respects `prefers-reduced-motion`.
 * Only semantic tokens are referenced — never raw values.
 */
export const textInputRecipe = cva({
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontFamily: "body",
    fontWeight: "normal",
    lineHeight: "normal",
    color: "fg",
    bg: "bg.surface",
    borderStyle: "solid",
    borderWidth: "medium",
    borderColor: "border",
    borderRadius: "md",
    outline: "none",
    transition:
      "border-color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.out), color token(durations.fast) token(easings.default)",
    _placeholder: {
      color: "fg.subtle",
    },
    _hover: {
      borderColor: "border.hover",
    },
    _focusWithin: {
      borderColor: "border.focus",
      boxShadow: "0 0 0 3px token(colors.accent.subtle)",
    },
    // aria-disabled styling (not HTML disabled — keeps element focusable)
    // No pointer-events: none — input must remain clickable for focus
    "&:has([aria-disabled=true]), &[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    // Read-only styling
    "&:has([aria-readonly=true]), &[aria-readonly=true]": {
      bg: "bg.muted",
      cursor: "default",
    },
  },

  variants: {
    /** Size of the input */
    size: {
      sm: {
        fontSize: "sm",
        px: "3",
        py: "1",
        minHeight: "8",
        gap: "1",
      },
      md: {
        fontSize: "md",
        px: "4",
        py: "2",
        minHeight: "10",
        gap: "2",
      },
      lg: {
        fontSize: "lg",
        px: "6",
        py: "3",
        minHeight: "12",
        gap: "2",
      },
    },

    /** Whether the input is in an error state */
    error: {
      true: {
        borderColor: "status.error",
        _hover: {
          borderColor: "status.error",
        },
        _focusWithin: {
          borderColor: "status.error",
          boxShadow: "0 0 0 3px token(colors.accent.subtle)",
        },
        _motionSafe: {
          animation: "shake",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});

/** The inner <input> element styles — resets browser defaults */
export const textInputElementStyles = {
  flex: "1",
  bg: "transparent",
  border: "none",
  outline: "none",
  color: "inherit",
  font: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  width: "100%",
  minWidth: "0",
  padding: "0",
  _placeholder: {
    color: "fg.subtle",
  },
} as const;

export type TextInputVariantProps = NonNullable<
  Parameters<typeof textInputRecipe>[0]
>;
