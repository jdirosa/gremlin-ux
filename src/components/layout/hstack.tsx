import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import type { SpaceScale } from "./layout.types";
import { hstackRecipe } from "./hstack.recipe";

export type HStackProps = {
  asChild?: boolean;
  gap?: SpaceScale;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
} & ComponentPropsWithoutRef<"div">;

export const HStack = forwardRef<HTMLDivElement, HStackProps>(
  function HStack({ asChild, gap, align, justify, wrap, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(hstackRecipe({ gap, align, justify, wrap: wrap || undefined }), className)}
        {...rest}
      />
    );
  },
);
