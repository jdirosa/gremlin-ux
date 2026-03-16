import { cva } from "@styled-system/css";

export type DividerVariantProps = NonNullable<Parameters<typeof dividerRecipe>[0]>;

export const dividerRecipe = cva({
  base: {
    border: "none",
    color: "border",
    flexShrink: 0,
  },
  variants: {
    variant: {
      solid: {
        borderTopWidth: "medium",
        borderTopStyle: "solid",
        borderColor: "border",
      },
      dashed: {
        borderTopWidth: "medium",
        borderTopStyle: "dashed",
        borderColor: "border",
      },
      squiggle: {},
    },
    orientation: {
      horizontal: { width: "100%" },
      vertical: {
        height: "100%",
        borderTopWidth: "0",
        borderLeftWidth: "medium",
        borderLeftStyle: "solid",
        borderColor: "border",
      },
    },
  },
  defaultVariants: { variant: "solid", orientation: "horizontal" },
});
