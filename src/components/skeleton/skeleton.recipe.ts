import { cva } from "@styled-system/css";

export type SkeletonVariantProps = NonNullable<Parameters<typeof skeletonRecipe>[0]>;

export const skeletonRecipe = cva({
  base: {
    bg: "bg.muted",
    borderRadius: "md",
    _motionSafe: {
      animation: "pulse 1.5s token(easings.inOut) infinite",
    },
  },
  variants: {
    variant: {
      text: {
        height: "1em",
        width: "100%",
        borderRadius: "sm",
      },
      circle: {
        borderRadius: "full",
        aspectRatio: "1",
      },
      rect: {
        width: "100%",
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  compoundVariants: [
    { variant: "text", size: "sm", css: { height: "0.75em" } },
    { variant: "text", size: "md", css: { height: "1em" } },
    { variant: "text", size: "lg", css: { height: "1.25em" } },
    { variant: "circle", size: "sm", css: { width: "8" } },
    { variant: "circle", size: "md", css: { width: "10" } },
    { variant: "circle", size: "lg", css: { width: "12" } },
    { variant: "rect", size: "sm", css: { height: "8" } },
    { variant: "rect", size: "md", css: { height: "10" } },
    { variant: "rect", size: "lg", css: { height: "12" } },
  ],
  defaultVariants: { variant: "text", size: "md" },
});
