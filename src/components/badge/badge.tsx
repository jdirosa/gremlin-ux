import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { badgeRecipe, type BadgeVariantProps } from "./badge.recipe";

import type { SpaceScale } from "../layout/layout.types";
import { spaceMap } from "../layout/layout.types";

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  variant?: BadgeVariantProps["variant"];
  size?: BadgeVariantProps["size"];
  icon?: ReactNode;
  asChild?: boolean;
  mb?: SpaceScale;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { variant, size, icon, asChild, mb, className, style, children, ...rest },
    ref,
  ) {
    const recipeClass = badgeRecipe({ variant, size });
    const Comp = asChild ? Slot : "span";
    const mbStyle = mb != null ? { marginBottom: `var(--spacing-${spaceMap[mb]})`, ...style } : style;

    return (
      <Comp ref={ref} className={cx(recipeClass, className)} style={mbStyle} {...rest}>
        {icon != null && <span aria-hidden="true">{icon}</span>}
        {children}
      </Comp>
    );
  },
);
