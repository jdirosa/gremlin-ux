import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import {
  progressTrackRecipe,
  progressBarRecipe,
  type ProgressVariantProps,
} from "./progress.recipe";

export interface ProgressProps extends Omit<ComponentPropsWithoutRef<"div">, "color"> {
  value?: number;
  max?: number;
  size?: ProgressVariantProps["size"];
  status?: "default" | "success" | "warning" | "error";
  indeterminate?: boolean;
  "aria-label"?: string;
  className?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      value,
      max = 100,
      size,
      status = "default",
      indeterminate = false,
      "aria-label": ariaLabel,
      className,
      ...rest
    },
    ref,
  ) {
    const percentage = indeterminate ? undefined : Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
        className={cx(progressTrackRecipe({ size }), className)}
        {...rest}
      >
        <div
          className={progressBarRecipe({ status, indeterminate: indeterminate || undefined })}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    );
  },
);
