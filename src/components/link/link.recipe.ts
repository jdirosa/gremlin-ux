import { cva } from "@styled-system/css";

export const linkRecipe = cva({
  base: {
    cursor: "pointer",
    fontFamily: "body",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    textDecorationColor: "transparent",
    transition: "color token(durations.fast) token(easings.default), text-decoration-color token(durations.fast) token(easings.default)",
    _hover: {
      textDecorationColor: "currentColor",
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
      borderRadius: "sm",
    },
  },
  variants: {
    variant: {
      accent: {
        color: "accent",
        _hover: { color: "accent.hover" },
      },
      default: {
        color: "fg",
        _hover: { color: "fg.muted" },
      },
      muted: {
        color: "fg.muted",
        _hover: { color: "fg" },
      },
      subtle: {
        color: "fg.subtle",
        _hover: { color: "fg.muted" },
      },
    },
    underline: {
      always: {
        textDecorationColor: "currentColor",
      },
      hover: {
        textDecorationColor: "transparent",
        _hover: { textDecorationColor: "currentColor" },
      },
      none: {
        textDecoration: "none",
      },
    },
    size: {
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
    },
  },
  defaultVariants: {
    variant: "accent",
    underline: "hover",
  },
});

export type LinkVariantProps = NonNullable<Parameters<typeof linkRecipe>[0]>;
