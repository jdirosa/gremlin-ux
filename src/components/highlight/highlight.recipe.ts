import { cva } from "@styled-system/css";

export type HighlightVariantProps = NonNullable<Parameters<typeof highlightRecipe>[0]>;

export const highlightRecipe = cva({
  base: {
    px: "2",
    py: "1",
    borderRadius: "sm",
    boxDecorationBreak: "clone",
  },
  variants: {
    bg: {
      medium: { bg: "overlay.medium" },
      heavy: { bg: "overlay.heavy" },
      subtle: { bg: "bg.subtle" },
    },
  },
  defaultVariants: { bg: "medium" },
});
