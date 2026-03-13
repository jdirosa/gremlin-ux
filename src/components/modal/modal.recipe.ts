import { css } from "@styled-system/css";

/**
 * Modal styles — Panda CSS `css()` definitions for the Modal sub-elements.
 *
 * Modal is a compound layout component, not a variant-driven component like Button,
 * so it uses plain css() definitions rather than cva(). Each sub-element
 * (overlay, content, header, body, footer, close) gets its own style object.
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
 * Content panel — the main dialog container.
 *
 * Canvas charcoal fill (bg.surface semantic), 16px radius, 3px border
 * in border.hover. inkOffset box-shadow for the woodblock print effect.
 * Scales in from 0.90 with rubberHeavy bounce.
 */
export const modalContentStyles = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  bg: "bg.surface",
  borderRadius: "lg",
  borderStyle: "solid",
  borderWidth: "thick",
  borderColor: "border.hover",
  boxShadow: "inkOffset",
  width: "calc(100% - 32px)",
  maxWidth: "480px",
  maxHeight: "calc(100vh - 64px)",
  overflow: "hidden",
  outline: "none",

  // Open state animation — bouncy scale-in
  "&[data-state=open]": {
    _motionSafe: {
      animation: "scaleIn",
    },
  },

  // Closed state animation — quick shrink-away
  "&[data-state=closed]": {
    _motionSafe: {
      animation: "scaleOut token(durations.fast) token(easings.in)",
    },
  },

  // Focus ring on the dialog itself (keyboard focus)
  _focusVisible: {
    boxShadow:
      "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent), token(shadows.inkOffset)",
  },
});

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
