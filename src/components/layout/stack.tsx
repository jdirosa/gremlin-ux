import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpacingToken } from "./layout.types";

export type StackProps = {
  asChild?: boolean;
  gap?: SpacingToken;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
} & ComponentPropsWithoutRef<"div">;

const justifyMap = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;
const alignMap = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const;

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  function Stack({ asChild, gap = "4", align, justify, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            display: "flex",
            flexDirection: "column",
            gap,
            ...(align != null && { alignItems: alignMap[align] }),
            ...(justify != null && { justifyContent: justifyMap[justify] }),
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
