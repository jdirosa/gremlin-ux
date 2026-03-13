import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpacingToken, RadiiToken } from "./layout.types";

export type BoxProps = {
  asChild?: boolean;
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  borderRadius?: RadiiToken;
} & ComponentPropsWithoutRef<"div">;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  function Box({ asChild, padding, paddingX, paddingY, borderRadius, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            ...(padding != null && { p: padding }),
            ...(paddingX != null && { px: paddingX }),
            ...(paddingY != null && { py: paddingY }),
            ...(borderRadius != null && { borderRadius }),
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
