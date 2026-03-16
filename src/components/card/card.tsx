import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { cardRecipe, type CardVariantProps } from "./card.recipe";
import { Heading } from "../layout/heading";

export interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "color" | "title"> {
  interactive?: CardVariantProps["interactive"];
  tilt?: CardVariantProps["tilt"];
  tiltDirection?: CardVariantProps["tiltDirection"];
  padding?: CardVariantProps["padding"];
  align?: CardVariantProps["align"];
  fullHeight?: CardVariantProps["fullHeight"];
  title?: string;
  asChild?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { interactive, tilt, tiltDirection, padding, align, fullHeight, title, asChild, className, children, ...rest },
    ref,
  ) {
    const recipeClass = cardRecipe({ interactive, tilt, tiltDirection, padding, align, fullHeight });
    const Comp = asChild ? Slot : "div";

    return (
      <Comp ref={ref} className={cx(recipeClass, className)} {...rest}>
        {title != null && <Heading level={4} size="label" mb="1">{title}</Heading>}
        {children}
      </Comp>
    );
  },
);
