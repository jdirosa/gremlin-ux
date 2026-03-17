import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { sectionRecipe, type SectionVariantProps } from "./section.recipe";
import { Container } from "../layout/container";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";
type SeparatorVariant = "squiggle";

const bgColorMap = {
  transparent: "transparent",
  canvas: "var(--colors-bg-canvas)",
  surface: "var(--colors-bg-surface)",
  emphasis: "var(--colors-bg-emphasis)",
} as const;

const squiggleFillPath =
  "M0,0 L0,70 Q30,62 60,70 T120,70 T180,70 T240,70 T300,70 T360,70 T420,70 T480,70 T540,70 T600,70 T660,70 T720,70 T780,70 T840,70 T900,70 T960,70 T1020,70 T1080,70 T1140,70 T1200,70 L1200,0 Z";

const squiggleStrokePath =
  "M0,70 Q30,62 60,70 T120,70 T180,70 T240,70 T300,70 T360,70 T420,70 T480,70 T540,70 T600,70 T660,70 T720,70 T780,70 T840,70 T900,70 T960,70 T1020,70 T1080,70 T1140,70 T1200,70";

const SEPARATOR_HEIGHT = 80;

function SectionSeparator({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: `${SEPARATOR_HEIGHT}px`,
        position: "absolute",
        bottom: `-${SEPARATOR_HEIGHT}px`,
        left: 0,
        right: 0,
        zIndex: 2,
      }}
    >
      <path d={squiggleFillPath} fill={fill} stroke="none" />
      <path d={squiggleStrokePath} fill="none" stroke="var(--colors-border)" strokeWidth="3" />
    </svg>
  );
}

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "color"> {
  bg?: SectionVariantProps["bg"];
  height?: SectionVariantProps["height"];
  containerMaxWidth?: ContainerSize;
  separator?: SeparatorVariant;
  asChild?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(
    { bg = "canvas", height, containerMaxWidth = "lg", separator, asChild, className, children, style, ...rest },
    ref,
  ) {
    const recipeClass = sectionRecipe({ bg, height });
    const Comp = asChild ? Slot : "section";
    const fillColor = bgColorMap[bg ?? "canvas"];

    return (
      <Comp
        ref={ref}
        className={cx(recipeClass, className)}
        style={{ ...style, ...(separator ? { overflow: "visible", position: "relative", zIndex: 1 } : {}) }}
        {...rest}
      >
        <Container maxWidth={containerMaxWidth}>{children}</Container>
        {separator && <SectionSeparator fill={fillColor} />}
      </Comp>
    );
  },
);
