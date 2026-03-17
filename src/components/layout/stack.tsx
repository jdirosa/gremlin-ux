import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import type { SpaceScale } from "./layout.types";
import { stackRecipe } from "./stack.recipe";

export type StackProps = {
  asChild?: boolean;
  gap?: SpaceScale;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
} & ComponentPropsWithoutRef<"div">;

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  function Stack({ asChild, gap, align, justify, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(stackRecipe({ gap, align, justify }), className)}
        {...rest}
      />
    );
  },
);
