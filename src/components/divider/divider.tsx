import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";
import { dividerRecipe, type DividerVariantProps } from "./divider.recipe";

export interface DividerProps extends Omit<ComponentPropsWithoutRef<"hr">, "color"> {
  variant?: DividerVariantProps["variant"];
  orientation?: DividerVariantProps["orientation"];
}

const squigglePath =
  "M0,6 Q30,0 60,6 T120,6 T180,6 T240,6 T300,6 T360,6 T420,6 T480,6 T540,6 T600,6 T660,6 T720,6 T780,6 T840,6 T900,6 T960,6 T1020,6 T1080,6 T1140,6 T1200,6";

const squiggleStyles = css({
  width: "100%",
  height: "12px",
  display: "block",
  color: "border",
});

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  function Divider({ variant, orientation = "horizontal", className, ...rest }, ref) {
    if (variant === "squiggle") {
      return (
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          role="separator"
          aria-orientation={orientation}
          className={cx(squiggleStyles, className)}
        >
          <path
            d={squigglePath}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      );
    }

    const recipeClass = dividerRecipe({ variant, orientation });

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);
