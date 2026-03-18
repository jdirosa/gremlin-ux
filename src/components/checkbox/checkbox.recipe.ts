import { cva } from "@styled-system/css";

export type CheckboxVariantProps = NonNullable<Parameters<typeof checkboxRecipe>[0]>;

export const checkboxRecipe = cva({
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

export const checkboxControlRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: "medium",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "sm",
    bg: "bg.surface",
    color: "fg.onEmphasis",
    transition:
      "border-color token(durations.fast) token(easings.default), background-color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.default)",
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
      sm: { width: "16px", height: "16px" },
      md: { width: "20px", height: "20px" },
      lg: { width: "24px", height: "24px" },
    },
  },
  defaultVariants: { size: "md" },
});

export const checkboxLabelRecipe = cva({
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
