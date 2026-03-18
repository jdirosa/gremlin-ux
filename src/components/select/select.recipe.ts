import { cva } from "@styled-system/css";

export type SelectVariantProps = NonNullable<Parameters<typeof selectRecipe>[0]>;

export const selectRecipe = cva({
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontFamily: "body",
    fontWeight: "normal",
    lineHeight: "normal",
    color: "fg",
    bg: "bg.surface",
    borderStyle: "solid",
    borderWidth: "medium",
    borderColor: "border",
    borderRadius: "md",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    transition:
      "border-color token(durations.fast) token(easings.default), box-shadow token(durations.fast) token(easings.out)",
    _hover: {
      borderColor: "border.hover",
    },
    _focusVisible: {
      borderColor: "border.focus",
      boxShadow: "0 0 0 3px token(colors.accent.subtle)",
    },
    "&[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "sm",
        px: "3",
        py: "1",
        minHeight: "8",
      },
      md: {
        fontSize: "md",
        px: "4",
        py: "2",
        minHeight: "10",
      },
      lg: {
        fontSize: "lg",
        px: "6",
        py: "3",
        minHeight: "12",
      },
    },
    error: {
      true: {
        borderColor: "status.error",
        _hover: {
          borderColor: "status.error",
        },
        _focusVisible: {
          borderColor: "status.error",
          boxShadow: "0 0 0 3px token(colors.accent.subtle)",
        },
        _motionSafe: {
          animation: "shake",
        },
      },
    },
  },
  defaultVariants: { size: "md" },
});

export const selectWrapperRecipe = cva({
  base: {
    position: "relative",
    width: "100%",
  },
  variants: {},
});
