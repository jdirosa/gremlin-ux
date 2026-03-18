import { cva } from "@styled-system/css";

export type RadioGroupVariantProps = NonNullable<Parameters<typeof radioGroupRecipe>[0]>;

export const radioGroupRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3",
  },
  variants: {
    orientation: {
      vertical: { flexDirection: "column" },
      horizontal: { flexDirection: "row", gap: "4" },
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export const radioItemRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "flex-start",
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

export const radioControlRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: "medium",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "full",
    bg: "bg.surface",
    transition:
      "border-color token(durations.fast) token(easings.default), background-color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.default)",
    _groupHover: {
      borderColor: "border.hover",
    },
    "&[data-checked]": {
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
      sm: { width: "16px", height: "16px" },
      md: { width: "20px", height: "20px" },
      lg: { width: "24px", height: "24px" },
    },
  },
  defaultVariants: { size: "md" },
});

export const radioLabelRecipe = cva({
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
