import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpacingToken } from "./layout.types";

export type GridProps = {
  asChild?: boolean;
  columns?: number | string;
  cols?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: SpacingToken;
  rowGap?: SpacingToken;
  columnGap?: SpacingToken;
  align?: "start" | "center" | "end" | "stretch";
} & ComponentPropsWithoutRef<"div">;

const alignMap = { start: "start", center: "center", end: "end", stretch: "stretch" } as const;

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  function Grid({ asChild, columns, cols, gap = "4", rowGap, columnGap, align, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "div";
    const template = columns == null
      ? undefined
      : typeof columns === "number"
        ? `repeat(${columns}, 1fr)`
        : columns;

    const colsTemplate = cols == null
      ? undefined
      : typeof cols === "number"
        ? `repeat(${cols}, 1fr)`
        : Object.fromEntries(
            Object.entries(cols).map(([bp, n]) => [bp, `repeat(${n}, 1fr)`]),
          );

    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            display: "grid",
            ...(template != null && { gridTemplateColumns: template }),
            ...(colsTemplate != null && { gridTemplateColumns: colsTemplate }),
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
