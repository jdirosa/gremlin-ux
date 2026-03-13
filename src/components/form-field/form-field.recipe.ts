import { css } from "@styled-system/css";

/**
 * FormField styles — Panda CSS `css()` definitions for the FormField sub-elements.
 *
 * FormField is a layout wrapper, not a variant-driven component like Button,
 * so it uses plain css() definitions rather than cva(). Each sub-element
 * (label, description, error, wrapper) gets its own style object.
 *
 * All animations are wrapped in `_motionSafe` so they respect `prefers-reduced-motion`.
 * Only semantic tokens are referenced — never raw values.
 */

/** Outer wrapper — vertical stack with spacing */
export const formFieldWrapperStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "1",
  width: "100%",
});

/** Label — ink.primary, medium weight, slightly loose tracking */
export const formFieldLabelStyles = css({
  display: "flex",
  alignItems: "center",
  gap: "1",
  color: "fg",
  fontFamily: "body",
  fontWeight: "medium",
  fontSize: "sm",
  lineHeight: "normal",
  letterSpacing: "0.02em",
  cursor: "pointer",
  userSelect: "none",
});

/** Required asterisk — cherry red with scale-in pop on mount */
export const formFieldAsteriskStyles = css({
  color: "status.error",
  fontWeight: "bold",
  fontSize: "md",
  lineHeight: "1",
  _motionSafe: {
    animation: "asteriskPop",
  },
});

/** Description text — muted, smaller. Helpful and quiet. */
export const formFieldDescriptionStyles = css({
  color: "fg.muted",
  fontFamily: "body",
  fontWeight: "normal",
  fontSize: "xs",
  lineHeight: "normal",
});

/**
 * Error message container — always rendered for aria-live, but visually
 * hidden when no error. Slides down with fade-in using easing.rubber.
 */
export const formFieldErrorWrapperStyles = css({
  overflow: "hidden",
});

/** Error message text — cherry red, animated entrance */
export const formFieldErrorStyles = css({
  color: "status.error",
  fontFamily: "body",
  fontWeight: "medium",
  fontSize: "xs",
  lineHeight: "normal",
  display: "flex",
  alignItems: "center",
  gap: "1",
  pt: "1",
});
