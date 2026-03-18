import { cva } from "@styled-system/css";

export type SwitchVariantProps = NonNullable<Parameters<typeof switchRecipe>[0]>;

export const switchRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    "&[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
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

export const switchTrackRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    flexShrink: 0,
    borderWidth: "medium",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "full",
    bg: "bg.muted",
    position: "relative",
    transition:
      "background-color token(durations.fast) token(easings.default), border-color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.default)",
    _groupHover: {
      borderColor: "border.hover",
    },
    "&[data-checked]": {
      bg: "accent",
      borderColor: "accent",
    },
    "&[data-focus-visible]": {
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
    },
    "&[data-invalid]": {
      borderColor: "status.error",
    },
  },
  variants: {
    size: {
      sm: { width: "32px", height: "18px", p: "0.5" },
      md: { width: "40px", height: "22px", p: "0.5" },
      lg: { width: "48px", height: "26px", p: "0.5" },
    },
  },
  defaultVariants: { size: "md" },
});

export const switchThumbRecipe = cva({
  base: {
    borderRadius: "full",
    bg: "fg.onEmphasis",
    boxShadow: "sm",
    transition: "transform token(durations.fast) token(easings.default)",
    "&[data-checked]": {
      _motionSafe: {
        animation: "switchThumb 250ms token(easings.rubber) forwards",
      },
      _motionReduce: {
        transform: "translateX(100%)",
      },
    },
    "&:not([data-checked])": {
      _motionSafe: {
        animation: "switchThumbReverse 250ms token(easings.rubber) forwards",
      },
    },
  },
  variants: {
    size: {
      sm: { width: "12px", height: "12px" },
      md: { width: "16px", height: "16px" },
      lg: { width: "20px", height: "20px" },
    },
  },
  defaultVariants: { size: "md" },
});

export const switchLabelRecipe = cva({
  base: {
    color: "fg",
    lineHeight: "normal",
  },
  variants: {
    size: {
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
    },
  },
  defaultVariants: { size: "md" },
});
