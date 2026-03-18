import { css, cva } from "@styled-system/css";

/**
 * Drawer recipe -- side-panel variant of Modal.
 *
 * Reuses modal sub-element styles for header, body, footer, close.
 * Panel slides in from left or right with full viewport height.
 *
 * All motion is wrapped in `_motionSafe` so it respects `prefers-reduced-motion`.
 * Only semantic tokens are referenced.
 */

export type DrawerPlacement = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg";

/** Overlay backdrop -- same as modal */
export const drawerOverlayStyles = css({
  position: "fixed",
  inset: "0",
  zIndex: 50,
  display: "flex",
  bg: "bg.overlay",

  "&[data-state=open]": {
    _motionSafe: {
      animation: "fadeIn",
    },
  },

  "&[data-state=closed]": {
    _motionSafe: {
      animation: "fadeOut",
    },
  },
});

/** Content panel recipe -- supports size and placement variants */
export const drawerContentRecipe = cva({
  base: {
    position: "fixed",
    top: "0",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    bg: "bg.surface",
    overflow: "hidden",
    outline: "none",
    borderStyle: "solid",
    borderWidth: "thick",
    borderColor: "border.hover",
    boxShadow: "lg",
    zIndex: 51,

    _focusVisible: {
      boxShadow:
        "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent), token(shadows.lg)",
    },
  },
  variants: {
    size: {
      sm: { width: "320px", maxWidth: "calc(100vw - 32px)" },
      md: { width: "400px", maxWidth: "calc(100vw - 32px)" },
      lg: { width: "560px", maxWidth: "calc(100vw - 32px)" },
    },
    placement: {
      right: {
        right: "0",
        borderLeft: "thick solid token(colors.border.hover)",
        borderRight: "none",
        borderTopLeftRadius: "lg",
        borderBottomLeftRadius: "lg",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",

        "&[data-state=open]": {
          _motionSafe: {
            animation: "drawerSlideInRight",
          },
        },
        "&[data-state=closed]": {
          _motionSafe: {
            animation: "drawerSlideOutRight",
          },
        },
      },
      left: {
        left: "0",
        borderRight: "thick solid token(colors.border.hover)",
        borderLeft: "none",
        borderTopRightRadius: "lg",
        borderBottomRightRadius: "lg",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",

        "&[data-state=open]": {
          _motionSafe: {
            animation: "drawerSlideInLeft",
          },
        },
        "&[data-state=closed]": {
          _motionSafe: {
            animation: "drawerSlideOutLeft",
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    placement: "right",
  },
});

/** Header -- title area with bottom border divider */
export const drawerHeaderStyles = css({
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

/** Body -- scrollable content area */
export const drawerBodyStyles = css({
  flex: "1",
  overflowY: "auto",
  px: "6",
  py: "4",
  color: "fg",
  fontFamily: "body",
  fontSize: "md",
  lineHeight: "normal",
});

/** Footer -- action area with top border divider */
export const drawerFooterStyles = css({
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

/** Close button styles */
export const drawerCloseStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "fg.muted",
  transition: "color token(durations.fast) token(easings.default)",
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
