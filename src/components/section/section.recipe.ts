import { cva } from "@styled-system/css";

export type SectionVariantProps = NonNullable<Parameters<typeof sectionRecipe>[0]>;

export const sectionRecipe = cva({
  base: {
    px: "6",
    py: "12",
    width: "100%",
    "section + &": {
      pt: "80px",
    },
  },
  variants: {
    bg: {
      transparent: {},
      canvas:   { bg: "bg.canvas" },
      surface:  { bg: "bg.surface" },
      emphasis: { bg: "bg.emphasis" },
    },
    height: {
      auto: {},
      viewport: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
  defaultVariants: { bg: "canvas", height: "auto" },
});
