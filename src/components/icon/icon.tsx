import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { iconRecipe, type IconVariantProps } from "./icon.recipe";

export interface IconProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  size?: IconVariantProps["size"];
  color?: IconVariantProps["color"];
  boxed?: boolean;
  boxSize?: IconVariantProps["boxSize"];
  shape?: IconVariantProps["shape"];
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  function Icon({ size, color, boxed, boxSize, shape, className, ...rest }, ref) {
    const recipeClass = iconRecipe({ size, color, boxed, boxSize, shape });

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);
