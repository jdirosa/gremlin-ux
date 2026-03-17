import { cva } from "@styled-system/css";

export const timelineRecipe = cva({
  base: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "8",
  },
});

export const timelineItemRecipe = cva({
  base: {
    position: "relative",
    display: "flex",
    gap: "6",
    alignItems: "flex-start",
  },
  variants: {
    side: {
      left: {},
      right: {},
    },
  },
  defaultVariants: { side: "left" },
});

export const timelineMarkerRecipe = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "10",
    height: "10",
    borderRadius: "full",
    borderWidth: "thick",
    borderStyle: "solid",
    fontFamily: "body",
    fontSize: "xs",
    fontWeight: "bold",
    zIndex: 1,
    bg: "bg.canvas",
  },
  variants: {
    color: {
      default: { borderColor: "border", color: "fg.muted" },
      accent: { borderColor: "accent", color: "accent" },
      success: { borderColor: "status.success", color: "status.success" },
      warning: { borderColor: "status.warning", color: "status.warning" },
      info: { borderColor: "status.info", color: "status.info" },
    },
  },
  defaultVariants: { color: "default" },
});

export type TimelineVariantProps = NonNullable<Parameters<typeof timelineRecipe>[0]>;
export type TimelineItemVariantProps = NonNullable<Parameters<typeof timelineItemRecipe>[0]>;
export type TimelineMarkerVariantProps = NonNullable<Parameters<typeof timelineMarkerRecipe>[0]>;
