import { cva } from "@styled-system/css";

export type BadgeVariantProps = NonNullable<Parameters<typeof badgeRecipe>[0]>;

export const badgeRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
    fontFamily: "body",
    fontWeight: "medium",
    borderRadius: "full",
    whiteSpace: "nowrap",
  },
  variants: {
    variant: {
      subtle: {
        bg: "bg.surface",
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "border",
        color: "fg.muted",
      },
      outline: {
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "border",
        color: "fg.muted",
        bg: "transparent",
      },
      solid: {
        bg: "accent",
        color: "fg.onEmphasis",
      },
    },
    size: {
      sm: { px: "3", py: "0.5", fontSize: "xs" },
      md: { px: "4", py: "1", fontSize: "sm" },
    },
  },
  defaultVariants: { variant: "subtle", size: "md" },
});
