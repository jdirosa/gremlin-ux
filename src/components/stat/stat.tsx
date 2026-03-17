import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import {
  statRecipe,
  statNumberRecipe,
  statLabelRecipe,
  type StatVariantProps,
  type StatNumberVariantProps,
} from "./stat.recipe";

// ── Stat (root) ─────────────────────────────────────────────────────

export type StatProps = {
  align?: StatVariantProps["align"];
} & ComponentPropsWithoutRef<"div">;

const StatRoot = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { align, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(statRecipe({ align }), className)} {...rest}>
      {children}
    </div>
  );
});

// ── Stat.Number ─────────────────────────────────────────────────────

export type StatNumberProps = {
  size?: StatNumberVariantProps["size"];
} & ComponentPropsWithoutRef<"span">;

const StatNumber = forwardRef<HTMLSpanElement, StatNumberProps>(function StatNumber(
  { size, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(statNumberRecipe({ size }), className)} {...rest}>
      {children}
    </span>
  );
});

// ── Stat.Label ──────────────────────────────────────────────────────

export type StatLabelProps = ComponentPropsWithoutRef<"span">;

const StatLabel = forwardRef<HTMLSpanElement, StatLabelProps>(function StatLabel(
  { className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(statLabelRecipe(), className)} {...rest}>
      {children}
    </span>
  );
});

// ── Assembly ────────────────────────────────────────────────────────

export const Stat = Object.assign(StatRoot, {
  Number: StatNumber,
  Label: StatLabel,
});
