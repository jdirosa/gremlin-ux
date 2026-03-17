import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import type { SpaceScale, ContainerSize } from "./layout.types";
import { containerRecipe } from "./container.recipe";

export type ContainerProps = {
  asChild?: boolean;
  maxWidth?: ContainerSize;
  paddingX?: SpaceScale;
} & ComponentPropsWithoutRef<"div">;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ asChild, maxWidth, paddingX, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(containerRecipe({ maxWidth, paddingX }), className)}
        {...rest}
      />
    );
  },
);
