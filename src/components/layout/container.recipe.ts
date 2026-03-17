import { cva } from "@styled-system/css";

export const containerRecipe = cva({
  base: { mx: "auto", width: "100%", px: "6" },
  variants: {
    maxWidth: {
      sm: { maxWidth: "640px" },
      md: { maxWidth: "768px" },
      lg: { maxWidth: "1024px" },
      xl: { maxWidth: "1280px" },
      full: { maxWidth: "100%" },
    },
    paddingX: {
      none: { px: "0" },
      xs: { px: "1" },
      sm: { px: "2" },
      md: { px: "4" },
      lg: { px: "6" },
      xl: { px: "8" },
    },
  },
  defaultVariants: { maxWidth: "lg", paddingX: "lg" },
});
