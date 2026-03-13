import { css, cva } from "@styled-system/css";

/**
 * Modal styles — Panda CSS definitions for the Modal sub-elements.
 *
 * The content panel uses cva() with a `size` variant to support different
 * modal sizes including a full-screen mobile takeover mode.
 * Other sub-elements use plain css() definitions.
 *
 * Animation spec from DESIGN_DIRECTION.md section 8.4:
 * - Backdrop: ink black at 70% opacity, fades in over duration.normal
 * - Content: scales from 0.90 with easing.rubberHeavy over duration.slow
 * - Exit: scales to 0.95 and fades out over duration.fast
 * - Content panel: bg.surface fill, 16px radius (lg), 3px border in border.hover
 * - inkOffset box-shadow for the woodblock print effect
 * - Header/Footer separated by border dividers (1.5px / border.thin)
 *
 * All motion is wrapped in `_motionSafe` so it respects `prefers-reduced-motion`.
 * Only semantic tokens are referenced — never raw values.
 */

/** Overlay backdrop — ink black at 70% opacity */
export const modalOverlayStyles = css({
  position: "fixed",
  inset: "0",
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bg: "bg.overlay",

  // Open state animation
  "&[data-state=open]": {
    _motionSafe: {
      animation: "fadeIn",
    },
  },

  // Closed state animation
  "&[data-state=closed]": {
    _motionSafe: {
      animation: "fadeOut",
    },
  },
});

/**
 * Content panel recipe — supports size variants.
 *
 * | Size   | maxWidth | Notes                          |
 * |--------|----------|--------------------------------|
 * | `sm`   | 400px    | Confirmations, alerts          |
 * | `md`   | 480px    | Default, backward compatible   |
 * | `lg`   | 640px    | Complex forms                  |
 * | `full` | 100vw    | Mobile takeover, slide-up anim |
 */
export const modalContentRecipe = cva({
  base: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    bg: "bg.surface",
    overflow: "hidden",
    outline: "none",

    // Focus ring on the dialog itself (keyboard focus)
    _focusVisible: {
      boxShadow:
        "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent), token(shadows.inkOffset)",
    },
  },
  variants: {
    size: {
      sm: {
        borderRadius: "lg",
        borderStyle: "solid",
        borderWidth: "thick",
        borderColor: "border.hover",
        boxShadow: "inkOffset",
        width: "calc(100% - 32px)",
        maxWidth: "400px",
        maxHeight: "calc(100vh - 64px)",

        "&[data-state=open]": {
          _motionSafe: {
            animation: "scaleIn",
          },
        },
        "&[data-state=closed]": {
          _motionSafe: {
            animation: "scaleOut token(durations.fast) token(easings.in)",
          },
        },
      },
      md: {
        borderRadius: "lg",
        borderStyle: "solid",
        borderWidth: "thick",
        borderColor: "border.hover",
        boxShadow: "inkOffset",
        width: "calc(100% - 32px)",
        maxWidth: "480px",
        maxHeight: "calc(100vh - 64px)",

        "&[data-state=open]": {
          _motionSafe: {
            animation: "scaleIn",
          },
        },
        "&[data-state=closed]": {
          _motionSafe: {
            animation: "scaleOut token(durations.fast) token(easings.in)",
          },
        },
      },
      lg: {
        borderRadius: "lg",
        borderStyle: "solid",
        borderWidth: "thick",
        borderColor: "border.hover",
        boxShadow: "inkOffset",
        width: "calc(100% - 32px)",
        maxWidth: "640px",
        maxHeight: "calc(100vh - 64px)",

        "&[data-state=open]": {
          _motionSafe: {
            animation: "scaleIn",
          },
        },
        "&[data-state=closed]": {
          _motionSafe: {
            animation: "scaleOut token(durations.fast) token(easings.in)",
          },
        },
      },
      full: {
        width: "100vw",
        height: "100dvh",
        borderRadius: "0",
        border: "none",
        boxShadow: "none",

        "&[data-state=open]": {
          _motionSafe: {
            animation: "slideUp",
          },
        },
        "&[data-state=closed]": {
          _motionSafe: {
            animation: "slideDownExit",
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ModalSize = "sm" | "md" | "lg" | "full";

/** Header — title area with bottom border divider */
export const modalHeaderStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: "6",
  py: "4",
  borderBottomStyle: "solid",
  borderBottomWidth: "thin",
  borderBottomColor: "border",
  color: "fg",
  fontFamily: "heading",
  fontSize: "xl",
  lineHeight: "tight",
  flexShrink: 0,
});

/** Body — scrollable content area */
export const modalBodyStyles = css({
  flex: "1",
  overflowY: "auto",
  px: "6",
  py: "4",
  color: "fg",
  fontFamily: "body",
  fontSize: "md",
  lineHeight: "normal",
});

/** Footer — action area with top border divider */
export const modalFooterStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "3",
  px: "6",
  py: "4",
  borderTopStyle: "solid",
  borderTopWidth: "thin",
  borderTopColor: "border",
  flexShrink: 0,
});

/** Close button — positioned in the top-right corner of the content */
export const modalCloseStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "fg.muted",
  transition:
    "color token(durations.fast) token(easings.default)",
  _hover: {
    color: "fg",
  },
  _focusVisible: {
    outline: "none",
    boxShadow:
      "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
    borderRadius: "sm",
  },
});
