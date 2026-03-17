import { cva } from "@styled-system/css";

export const boxRecipe = cva({
  base: {},
  variants: {
    padding: {
      none: { p: "0" },
      xs: { p: "1" },
      sm: { p: "2" },
      md: { p: "4" },
      lg: { p: "6" },
      xl: { p: "8" },
    },
    paddingX: {
      none: { px: "0" },
      xs: { px: "1" },
      sm: { px: "2" },
      md: { px: "4" },
      lg: { px: "6" },
      xl: { px: "8" },
    },
    paddingY: {
      none: { py: "0" },
      xs: { py: "1" },
      sm: { py: "2" },
      md: { py: "4" },
      lg: { py: "6" },
      xl: { py: "8" },
    },
    borderRadius: {
      sm: { borderRadius: "sm" },
      md: { borderRadius: "md" },
      lg: { borderRadius: "lg" },
      xl: { borderRadius: "xl" },
      full: { borderRadius: "full" },
    },
  },
});
