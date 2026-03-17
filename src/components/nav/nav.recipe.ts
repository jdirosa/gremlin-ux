import { cva } from "@styled-system/css";

export const navItemRecipe = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: "2",
    px: "3",
    py: "2",
    borderRadius: "md",
    fontSize: "sm",
    fontFamily: "body",
    fontWeight: "medium",
    cursor: "pointer",
    border: "none",
    bg: "transparent",
    textDecoration: "none",
    transition: "background-color token(durations.fast) token(easings.default), color token(durations.fast) token(easings.default)",
    color: "fg",
    _hover: { bg: "bg.subtle" },
    _focusVisible: {
      outline: "none",
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
    },
  },
  variants: {
    active: {
      true: {
        bg: "accent",
        color: "fg.onEmphasis",
        fontWeight: "semibold",
        _hover: { bg: "accent.hover" },
      },
    },
  },
});

export type NavItemVariantProps = NonNullable<Parameters<typeof navItemRecipe>[0]>;
