import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { sectionRecipe, type SectionVariantProps } from "./section.recipe";
import { Container } from "../layout/container";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "color"> {
  bg?: SectionVariantProps["bg"];
  containerMaxWidth?: ContainerSize;
  asChild?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(
    { bg, containerMaxWidth = "lg", asChild, className, children, ...rest },
    ref,
  ) {
    const recipeClass = sectionRecipe({ bg });
    const Comp = asChild ? Slot : "section";

    return (
      <Comp ref={ref} className={cx(recipeClass, className)} {...rest}>
        <Container maxWidth={containerMaxWidth}>{children}</Container>
      </Comp>
    );
  },
);
