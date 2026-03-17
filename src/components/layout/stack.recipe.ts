import { cva } from "@styled-system/css";

export const stackRecipe = cva({
  base: { display: "flex", flexDirection: "column" },
  variants: {
    gap: {
      none: { gap: "0" },
      xs: { gap: "1" },
      sm: { gap: "2" },
      md: { gap: "4" },
      lg: { gap: "6" },
      xl: { gap: "8" },
    },
    align: {
      start: { alignItems: "flex-start" },
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" },
      stretch: { alignItems: "stretch" },
    },
    justify: {
      start: { justifyContent: "flex-start" },
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
      between: { justifyContent: "space-between" },
    },
  },
  defaultVariants: { gap: "md" },
});
