import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpacingToken, ContainerSize } from "./layout.types";

export type ContainerProps = {
  asChild?: boolean;
  maxWidth?: ContainerSize;
  paddingX?: SpacingToken;
} & ComponentPropsWithoutRef<"div">;

const sizeMap = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", full: "100%" } as const;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ asChild, maxWidth = "lg", paddingX = "6", className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            maxWidth: sizeMap[maxWidth],
            mx: "auto",
            width: "100%",
            px: paddingX,
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
