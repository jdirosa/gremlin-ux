import { cva } from "@styled-system/css";

export type SectionVariantProps = NonNullable<Parameters<typeof sectionRecipe>[0]>;

export const sectionRecipe = cva({
  base: {
    px: { base: "4", md: "6" },
    py: { base: "8", md: "12" },
    width: "100%",
  },
  variants: {
    bg: {
      canvas:   { bg: "bg.canvas" },
      surface:  { bg: "bg.surface" },
      emphasis: { bg: "bg.emphasis" },
    },
  },
  defaultVariants: { bg: "canvas" },
});
