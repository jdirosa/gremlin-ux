import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import type { SpaceScale, RadiiToken } from "./layout.types";
import { boxRecipe } from "./box.recipe";

export type BoxProps = {
  asChild?: boolean;
  padding?: SpaceScale;
  paddingX?: SpaceScale;
  paddingY?: SpaceScale;
  borderRadius?: RadiiToken;
} & ComponentPropsWithoutRef<"div">;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  function Box({ asChild, padding, paddingX, paddingY, borderRadius, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(boxRecipe({ padding, paddingX, paddingY, borderRadius }), className)}
        {...rest}
      />
    );
  },
);
