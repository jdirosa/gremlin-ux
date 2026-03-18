import { cva, css } from "@styled-system/css";

export type AlertVariantProps = NonNullable<Parameters<typeof alertRecipe>[0]>;

export const alertRecipe = cva({
  base: {
    display: "flex",
    alignItems: "flex-start",
    gap: "3",
    px: "4",
    py: "3",
    borderRadius: "md",
    borderWidth: "medium",
    borderStyle: "solid",
    fontFamily: "body",
    fontSize: "md",
    lineHeight: "normal",
  },
  variants: {
    status: {
      info: {
        bg: "bg.surface",
        borderColor: "status.info",
        color: "fg",
      },
      success: {
        bg: "bg.surface",
        borderColor: "status.success",
        color: "fg",
      },
      warning: {
        bg: "bg.surface",
        borderColor: "status.warning",
        color: "fg",
      },
      error: {
        bg: "bg.surface",
        borderColor: "status.error",
        color: "fg",
      },
    },
  },
  defaultVariants: { status: "info" },
});

export const alertIconStyles = css({
  flexShrink: 0,
  mt: "0.5",
});

export const alertContentStyles = css({
  flex: 1,
  minWidth: 0,
});

export const alertTitleStyles = css({
  fontWeight: "semibold",
  lineHeight: "tight",
  mb: "1",
});

export const alertDescriptionStyles = css({
  color: "fg.muted",
  fontSize: "sm",
});
