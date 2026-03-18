import { css, cva } from "@styled-system/css";

export type AccordionVariantProps = NonNullable<Parameters<typeof accordionRecipe>[0]>;

export const accordionRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  variants: {
    variant: {
      default: {},
      bordered: {
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "border",
        borderRadius: "lg",
        overflow: "hidden",
      },
    },
  },
  defaultVariants: { variant: "default" },
});

export const accordionItemStyles = css({
  borderBottomWidth: "medium",
  borderBottomStyle: "solid",
  borderBottomColor: "border",
  "&:last-child": {
    borderBottomWidth: "0",
  },
});

export const accordionTriggerStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  px: "4",
  py: "3",
  bg: "transparent",
  border: "none",
  cursor: "pointer",
  fontFamily: "body",
  fontSize: "md",
  fontWeight: "semibold",
  color: "fg",
  textAlign: "left",
  outline: "none",
  transition: "background-color token(durations.fast) token(easings.default)",
  _hover: {
    bg: "bg.subtle",
  },
  _focusVisible: {
    boxShadow: "0 0 0 3px token(colors.accent.subtle)",
    borderRadius: "sm",
    position: "relative",
    zIndex: 1,
  },
  "&[aria-disabled=true]": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const accordionChevronStyles = css({
  flexShrink: 0,
  color: "fg.muted",
  transition: "transform token(durations.normal) token(easings.rubber)",
  "&[data-open]": {
    transform: "rotate(180deg)",
  },
});

export const accordionContentWrapperStyles = css({
  display: "grid",
  gridTemplateRows: "0fr",
  _motionSafe: {
    transition: "grid-template-rows token(durations.normal) token(easings.rubber)",
  },
  "&[data-open]": {
    gridTemplateRows: "1fr",
  },
});

export const accordionContentInnerStyles = css({
  overflow: "hidden",
});

export const accordionContentStyles = css({
  px: "4",
  pb: "3",
  color: "fg.muted",
  fontSize: "md",
  lineHeight: "normal",
});
