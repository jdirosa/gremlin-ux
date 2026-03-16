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
    boxed: {
      true: {
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "border",
        bg: "bg.subtle",
      },
    },
    boxSize: {
      sm: { width: "8", height: "8", minWidth: "8" },
      md: { width: "10", height: "10", minWidth: "10" },
      lg: { width: "12", height: "12", minWidth: "12" },
    },
    shape: {
      square: { borderRadius: "md" },
      circle: { borderRadius: "full" },
    },
  },
  defaultVariants: { size: "md", color: "current", shape: "square" },
});
