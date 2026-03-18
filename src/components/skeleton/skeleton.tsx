import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { skeletonRecipe, type SkeletonVariantProps } from "./skeleton.recipe";

export interface SkeletonProps extends Omit<ComponentPropsWithoutRef<"div">, "color"> {
  variant?: SkeletonVariantProps["variant"];
  size?: SkeletonVariantProps["size"];
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ variant, size, width, height, className, style, ...rest }, ref) {
    const recipeClass = skeletonRecipe({ variant, size });
    const sizeStyle = {
      ...(width != null ? { width: typeof width === "number" ? `${width}px` : width } : {}),
      ...(height != null ? { height: typeof height === "number" ? `${height}px` : height } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cx(recipeClass, className)}
        style={sizeStyle}
        aria-hidden="true"
        {...rest}
      />
    );
  },
);
