import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpacingToken } from "./layout.types";

export type HStackProps = {
  asChild?: boolean;
  gap?: SpacingToken;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
} & ComponentPropsWithoutRef<"div">;

const justifyMap = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;
const alignMap = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" } as const;

export const HStack = forwardRef<HTMLDivElement, HStackProps>(
  function HStack({ asChild, gap = "3", align, justify, wrap, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            display: "flex",
            flexDirection: "row",
            gap,
            ...(align != null && { alignItems: alignMap[align] }),
            ...(justify != null && { justifyContent: justifyMap[justify] }),
            ...(wrap && { flexWrap: "wrap" }),
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
