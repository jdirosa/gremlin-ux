import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { cardRecipe, type CardVariantProps } from "./card.recipe";

export interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "color"> {
  interactive?: CardVariantProps["interactive"];
  tilt?: CardVariantProps["tilt"];
  tiltDirection?: CardVariantProps["tiltDirection"];
  padding?: CardVariantProps["padding"];
  asChild?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { interactive, tilt, tiltDirection, padding, asChild, className, ...rest },
    ref,
  ) {
    const recipeClass = cardRecipe({ interactive, tilt, tiltDirection, padding });
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} className={cx(recipeClass, className)} {...rest} />;
  },
);
