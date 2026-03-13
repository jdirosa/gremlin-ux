import { css, cva } from "@styled-system/css";

/**
 * Toast recipe — Panda CSS `cva()` with variant-driven border colors.
 *
 * The border uses the standard `border` token. Variant color comes from
 * the left accent stripe only — a single confident ink mark.
 */
export const toastRecipe = cva({
  base: {
    bg: "bg.surface",
    borderRadius: "md",
    borderWidth: "thick",
    borderStyle: "solid",
    borderColor: "border",
    boxShadow: "inkOffset",
    width: "360px",
    maxWidth: "calc(100vw - 32px)",
    fontFamily: "body",
    fontSize: "sm",
    color: "fg",
    pointerEvents: "auto",
    position: "relative",
    overflow: "hidden",
  },

  variants: {
    variant: {
      info: {},
      success: {},
      warning: {},
      error: {},
    },
  },

  defaultVariants: {
    variant: "info",
  },
});

export type ToastVariantProps = NonNullable<Parameters<typeof toastRecipe>[0]>;

// ── Container Styles ────────────────────────────────────────────────

const containerBase = {
  position: "fixed" as const,
  zIndex: 60,
  display: "flex",
  flexDirection: "column" as const,
  gap: "3",
  pointerEvents: "none" as const,
};

export const containerStyles = {
  "top-right": css({
    ...containerBase,
    top: "4",
    right: "4",
    alignItems: "flex-end",
  }),
  "top-left": css({
    ...containerBase,
    top: "4",
    left: "4",
    alignItems: "flex-start",
  }),
  "bottom-right": css({
    ...containerBase,
    bottom: "4",
    right: "4",
    alignItems: "flex-end",
    flexDirection: "column-reverse",
  }),
  "bottom-left": css({
    ...containerBase,
    bottom: "4",
    left: "4",
    alignItems: "flex-start",
    flexDirection: "column-reverse",
  }),
  "top-center": css({
    ...containerBase,
    top: "4",
    left: "50%",
    transform: "translateX(-50%)",
    alignItems: "center",
  }),
  "bottom-center": css({
    ...containerBase,
    bottom: "4",
    left: "50%",
    transform: "translateX(-50%)",
    alignItems: "center",
    flexDirection: "column-reverse",
  }),
} as const;

// ── Sub-element Styles ──────────────────────────────────────────────

/** Inner layout wrapper: icon + text + close button */
export const toastInnerStyles = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "3",
  p: "3",
});

/** Left accent stripe — 4px wide, colored by variant, with matching border radius */
const stripeBase = {
  position: "absolute" as const,
  left: "0",
  top: "0",
  bottom: "0",
  width: "1",
  borderTopLeftRadius: "calc(token(radii.md) - token(borderWidths.thick))",
  borderBottomLeftRadius: "calc(token(radii.md) - token(borderWidths.thick))",
};

export const accentStripeStyles = {
  info: css({ ...stripeBase, bg: "status.info" }),
  success: css({ ...stripeBase, bg: "status.success" }),
  warning: css({ ...stripeBase, bg: "status.warning" }),
  error: css({ ...stripeBase, bg: "status.error" }),
} as const;

/** Icon container */
export const toastIconStyles = css({
  flexShrink: 0,
  width: "5",
  height: "5",
  marginTop: "0.5",
});

/** Icon color per variant */
export const toastIconColorStyles = {
  info: css({ color: "status.info" }),
  success: css({ color: "status.success" }),
  warning: css({ color: "status.warning" }),
  error: css({ color: "status.error" }),
} as const;

/** Text content wrapper */
export const toastTextStyles = css({
  flex: "1",
  minWidth: "0",
});

/** Title text */
export const toastTitleStyles = css({
  fontWeight: "semibold",
  lineHeight: "tight",
  color: "fg",
});

/** Description text */
export const toastDescriptionStyles = css({
  marginTop: "1",
  lineHeight: "normal",
  color: "fg.muted",
});

/** Close button */
export const toastCloseStyles = css({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "fg.muted",
  width: "5",
  height: "5",
  borderRadius: "sm",
  transition: "color token(durations.fast) token(easings.default)",
  _hover: {
    color: "fg",
  },
  _focusVisible: {
    outline: "none",
    boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
  },
});

/** Progress bar container — inset from edges so it doesn't clash with border radius */
export const toastProgressContainerStyles = css({
  position: "absolute",
  bottom: "1px",
  left: "1",
  right: "1px",
  height: "0.5",
  overflow: "hidden",
  borderRadius: "full",
});

/** Progress bar fill per variant */
export const toastProgressStyles = {
  info: css({ height: "full", bg: "status.info", borderRadius: "full" }),
  success: css({ height: "full", bg: "status.success", borderRadius: "full" }),
  warning: css({ height: "full", bg: "status.warning", borderRadius: "full" }),
  error: css({ height: "full", bg: "status.error", borderRadius: "full" }),
} as const;
