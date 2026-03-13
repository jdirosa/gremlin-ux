import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpacingToken } from "./layout.types";

export type GridProps = {
  asChild?: boolean;
  columns?: number | string;
  gap?: SpacingToken;
  rowGap?: SpacingToken;
  columnGap?: SpacingToken;
  align?: "start" | "center" | "end" | "stretch";
} & ComponentPropsWithoutRef<"div">;

const alignMap = { start: "start", center: "center", end: "end", stretch: "stretch" } as const;

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  function Grid({ asChild, columns, gap = "4", rowGap, columnGap, align, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    const template = columns == null
      ? undefined
      : typeof columns === "number"
        ? `repeat(${columns}, 1fr)`
        : columns;

    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            display: "grid",
            ...(template != null && { gridTemplateColumns: template }),
            gap,
            ...(rowGap != null && { rowGap }),
            ...(columnGap != null && { columnGap }),
            ...(align != null && { alignItems: alignMap[align] }),
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
