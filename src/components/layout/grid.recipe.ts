import { cva } from "@styled-system/css";

export const gridRecipe = cva({
  base: { display: "grid" },
  variants: {
    cols: {
      1: { gridTemplateColumns: "1fr" },
      2: { gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" } },
      3: { gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } },
      4: { gridTemplateColumns: { base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" } },
    },
    gap: {
      none: { gap: "0" },
      xs: { gap: "1" },
      sm: { gap: "2" },
      md: { gap: "4" },
      lg: { gap: "6" },
      xl: { gap: "8" },
    },
    align: {
      start: { alignItems: "start" },
      center: { alignItems: "center" },
      end: { alignItems: "end" },
      stretch: { alignItems: "stretch" },
    },
  },
  defaultVariants: { gap: "md" },
});
