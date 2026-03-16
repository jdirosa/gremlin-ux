import { cva } from "@styled-system/css";

export type TextareaVariantProps = NonNullable<Parameters<typeof textareaRecipe>[0]>;

export const textareaRecipe = cva({
  base: {
    width: "100%",
    bg: "bg.subtle",
    color: "fg",
    fontFamily: "body",
    fontSize: "sm",
    lineHeight: "relaxed",
    borderWidth: "medium",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "md",
    px: "4",
    py: "3",
    resize: "vertical",
    outline: "none",
    _focus: {
      borderColor: "border.focus",
      boxShadow: "0 0 0 3px token(colors.accent.subtle)",
    },
    _placeholder: {
      color: "fg.subtle",
    },
    "&[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});
