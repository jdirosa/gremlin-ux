import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";
import { timelineRecipe, timelineItemRecipe, timelineMarkerRecipe } from "./timeline.recipe";

// -- Timeline (root) ----------------------------------------------------------

export type TimelineProps = ComponentPropsWithoutRef<"div">;

const TimelineRoot = forwardRef<HTMLDivElement, TimelineProps>(function Timeline(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        timelineRecipe(),
        css({
          "&::before": {
            content: '""',
            position: "absolute",
            left: "calc(var(--spacing-5))",
            top: 0,
            bottom: 0,
            width: "2px",
            bg: "border",
          },
        }),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

// -- Timeline.Item ------------------------------------------------------------

export type TimelineItemProps = {
  side?: "left" | "right";
} & ComponentPropsWithoutRef<"div">;

const Item = forwardRef<HTMLDivElement, TimelineItemProps>(function TimelineItem(
  { side, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(timelineItemRecipe({ side }), className)} {...rest}>
      {children}
    </div>
  );
});

// -- Timeline.Marker ----------------------------------------------------------

export type TimelineMarkerProps = {
  color?: "default" | "accent" | "success" | "warning" | "info";
} & ComponentPropsWithoutRef<"div">;

const Marker = forwardRef<HTMLDivElement, TimelineMarkerProps>(function TimelineMarker(
  { color, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(timelineMarkerRecipe({ color }), className)} {...rest}>
      {children}
    </div>
  );
});

// -- Timeline.Content ---------------------------------------------------------

export type TimelineContentProps = ComponentPropsWithoutRef<"div">;

const Content = forwardRef<HTMLDivElement, TimelineContentProps>(function TimelineContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(css({ flex: "1" }), className)} {...rest}>
      {children}
    </div>
  );
});

// -- Assembly -----------------------------------------------------------------

export const Timeline = Object.assign(TimelineRoot, {
  Item,
  Marker,
  Content,
});
