import { cva } from "@styled-system/css";

export type IconVariantProps = NonNullable<Parameters<typeof iconRecipe>[0]>;

export const iconRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    "& svg": {
      width: "1em",
      height: "1em",
    },
  },
  variants: {
    size: {
      sm: { fontSize: "md" },
      md: { fontSize: "xl" },
      lg: { fontSize: "2xl" },
    },
    color: {
      current: { color: "fg" },
      muted:   { color: "fg.muted" },
      accent:  { color: "accent" },
    },
  },
  defaultVariants: { size: "md", color: "current" },
});
