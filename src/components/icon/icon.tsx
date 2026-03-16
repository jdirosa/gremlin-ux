import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { iconRecipe, type IconVariantProps } from "./icon.recipe";

export interface IconProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  size?: IconVariantProps["size"];
  color?: IconVariantProps["color"];
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  function Icon({ size, color, className, ...rest }, ref) {
    const recipeClass = iconRecipe({ size, color });

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
