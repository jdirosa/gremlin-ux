import { cva } from "@styled-system/css";

export type ProgressVariantProps = NonNullable<Parameters<typeof progressTrackRecipe>[0]>;

export const progressTrackRecipe = cva({
  base: {
    width: "100%",
    bg: "bg.muted",
    borderRadius: "full",
    overflow: "hidden",
    position: "relative",
  },
  variants: {
    size: {
      sm: { height: "4px" },
      md: { height: "8px" },
      lg: { height: "12px" },
    },
  },
  defaultVariants: { size: "md" },
});

export const progressBarRecipe = cva({
  base: {
    height: "100%",
    borderRadius: "full",
    _motionSafe: {
      transition: "width token(durations.normal) token(easings.rubber)",
    },
  },
  variants: {
    status: {
      default: { bg: "accent" },
      success: { bg: "status.success" },
      warning: { bg: "status.warning" },
      error: { bg: "status.error" },
    },
    indeterminate: {
      true: {
        width: "40% !important",
        _motionSafe: {
          animation: "progressIndeterminate 1.5s token(easings.inOut) infinite",
        },
      },
    },
  },
  defaultVariants: { status: "default" },
});
