import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { badgeRecipe, type BadgeVariantProps } from "./badge.recipe";

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  variant?: BadgeVariantProps["variant"];
  size?: BadgeVariantProps["size"];
  icon?: ReactNode;
  asChild?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { variant, size, icon, asChild, className, children, ...rest },
    ref,
  ) {
    const recipeClass = badgeRecipe({ variant, size });
    const Comp = asChild ? Slot : "span";

    return (
      <Comp ref={ref} className={cx(recipeClass, className)} {...rest}>
        {icon != null && <span aria-hidden="true">{icon}</span>}
        {children}
      </Comp>
    );
  },
);
