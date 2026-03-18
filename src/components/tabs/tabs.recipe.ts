import { css, cva } from "@styled-system/css";

export type TabsVariantProps = NonNullable<Parameters<typeof tabListRecipe>[0]>;

export const tabListRecipe = cva({
  base: {
    display: "flex",
    position: "relative",
    borderBottomWidth: "medium",
    borderBottomStyle: "solid",
    borderBottomColor: "border",
    gap: "0",
  },
  variants: {
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  defaultVariants: { size: "md" },
});

export const tabRecipe = cva({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "body",
    fontWeight: "medium",
    color: "fg.muted",
    cursor: "pointer",
    userSelect: "none",
    bg: "transparent",
    border: "none",
    outline: "none",
    whiteSpace: "nowrap",
    transition: "color token(durations.fast) token(easings.default)",
    _hover: {
      color: "fg",
    },
    "&[data-selected]": {
      color: "accent",
      fontWeight: "semibold",
    },
    _focusVisible: {
      boxShadow: "0 0 0 3px token(colors.accent.subtle)",
      borderRadius: "sm",
    },
    "&[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  variants: {
    size: {
      sm: { px: "3", py: "2", fontSize: "sm" },
      md: { px: "4", py: "3", fontSize: "md" },
      lg: { px: "6", py: "3", fontSize: "lg" },
    },
  },
  defaultVariants: { size: "md" },
});

export const tabIndicatorStyles = css({
  position: "absolute",
  bottom: "-2px",
  height: "3px",
  bg: "accent",
  borderRadius: "full",
  _motionSafe: {
    transition: "left token(durations.normal) token(easings.rubber), width token(durations.normal) token(easings.rubber)",
  },
});

export const tabPanelStyles = css({
  py: "4",
  outline: "none",
  _focusVisible: {
    boxShadow: "0 0 0 3px token(colors.accent.subtle)",
    borderRadius: "sm",
  },
});
