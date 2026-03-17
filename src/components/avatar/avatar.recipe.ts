import { cva } from "@styled-system/css";

export const avatarRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    bg: "bg.subtle",
    color: "fg.muted",
    fontFamily: "heading",
    fontWeight: "bold",
    userSelect: "none",
  },
  variants: {
    size: {
      sm: { width: "8", height: "8", fontSize: "xs" },
      md: { width: "10", height: "10", fontSize: "sm" },
      lg: { width: "12", height: "12", fontSize: "md" },
      xl: { width: "16", height: "16", fontSize: "lg" },
    },
    shape: {
      circle: { borderRadius: "full" },
      square: { borderRadius: "md" },
      rounded: { borderRadius: "lg" },
    },
    border: {
      true: {
        borderWidth: "thick",
        borderStyle: "solid",
        borderColor: "border",
      },
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

export type AvatarVariantProps = NonNullable<Parameters<typeof avatarRecipe>[0]>;
