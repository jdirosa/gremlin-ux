import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import type { SpaceScale } from "./layout.types";
import { gridRecipe } from "./grid.recipe";

export type GridProps = {
  asChild?: boolean;
  cols?: 1 | 2 | 3 | 4;
  gap?: SpaceScale;
  align?: "start" | "center" | "end" | "stretch";
} & ComponentPropsWithoutRef<"div">;

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  function Grid({ asChild, cols, gap, align, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(gridRecipe({ cols, gap, align }), className)}
        {...rest}
      />
    );
  },
);
