import { cva } from "@styled-system/css";

export type CardVariantProps = NonNullable<Parameters<typeof cardRecipe>[0]>;

export const cardRecipe = cva({
  base: {
    bg: "bg.surface",
    borderWidth: "thick",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "lg",
    p: "6",
    boxShadow: "inkOffset",
  },
  variants: {
    interactive: {
      true: {
        _motionSafe: {
          transition:
            "box-shadow 150ms token(easings.default), transform 150ms token(easings.default)",
        },
        "&:hover": {
          _motionSafe: {
            animation: "cardWobble 500ms token(easings.out) forwards",
          },
          boxShadow: "inkOffsetHover",
        },
        "&:active": {
          _motionSafe: {
            transform: "translateY(0px) rotate(0deg) scale(0.98)",
            transition: "transform 100ms token(easings.out)",
          },
          boxShadow: "sm",
        },
      },
    },
    tilt: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      none: {},
    },
    tiltDirection: {
      left: {},
      right: {},
    },
    padding: {
      none: { p: "0" },
      sm: { p: "4" },
      md: { p: "5" },
      lg: { p: "6" },
      xl: { p: "8" },
    },
  },
  compoundVariants: [
    { tilt: "sm", tiltDirection: "right", css: { transform: "rotate(token(rotations.sm))", "--tilt": "token(rotations.sm)" } },
    { tilt: "sm", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.sm)))", "--tilt": "calc(-1 * token(rotations.sm))" } },
    { tilt: "md", tiltDirection: "right", css: { transform: "rotate(token(rotations.md))", "--tilt": "token(rotations.md)" } },
    { tilt: "md", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.md)))", "--tilt": "calc(-1 * token(rotations.md))" } },
    { tilt: "lg", tiltDirection: "right", css: { transform: "rotate(token(rotations.lg))", "--tilt": "token(rotations.lg)" } },
    { tilt: "lg", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.lg)))", "--tilt": "calc(-1 * token(rotations.lg))" } },
    { tilt: "xl", tiltDirection: "right", css: { transform: "rotate(token(rotations.xl))", "--tilt": "token(rotations.xl)" } },
    { tilt: "xl", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.xl)))", "--tilt": "calc(-1 * token(rotations.xl))" } },
  ],
  defaultVariants: { interactive: false, tilt: "none", tiltDirection: "right", padding: "lg" },
});
