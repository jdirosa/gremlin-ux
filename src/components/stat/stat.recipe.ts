import { cva } from "@styled-system/css";

export const statRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1",
  },
  variants: {
    align: {
      left: { alignItems: "flex-start", textAlign: "left" },
      center: { alignItems: "center", textAlign: "center" },
    },
  },
  defaultVariants: { align: "center" },
});

export const statNumberRecipe = cva({
  base: {
    fontFamily: "heading",
    fontWeight: "bold",
    lineHeight: "tight",
    color: "fg",
  },
  variants: {
    size: {
      sm: { fontSize: "title" },
      md: { fontSize: "section" },
      lg: { fontSize: "display" },
    },
  },
  defaultVariants: { size: "md" },
});

export const statLabelRecipe = cva({
  base: {
    fontFamily: "body",
    fontSize: "sm",
    color: "fg.muted",
  },
});

export type StatVariantProps = NonNullable<Parameters<typeof statRecipe>[0]>;
export type StatNumberVariantProps = NonNullable<Parameters<typeof statNumberRecipe>[0]>;
