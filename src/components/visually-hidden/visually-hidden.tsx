import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";

const visuallyHiddenStyles = css({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
});

export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<"span"> {}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...rest }, ref) {
    return (
      <span ref={ref} className={cx(visuallyHiddenStyles, className)} {...rest} />
    );
  },
);
