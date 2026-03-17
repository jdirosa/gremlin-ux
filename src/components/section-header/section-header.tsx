import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { css, cx } from "@styled-system/css";
import { Heading } from "../layout/heading";
import { Text } from "../layout/text";

import type { SpaceScale } from "../layout/layout.types";

export interface SectionHeaderProps extends Omit<ComponentPropsWithoutRef<"div">, "color" | "title"> {
  title: string;
  subtitle?: ReactNode;
  stroke?: boolean;
  glow?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  mb?: SpaceScale;
}

const wrapperStyles = css({
  textAlign: "center",
});

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  function SectionHeader(
    { title, subtitle, stroke = true, glow, level = 2, mb = "xl", className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx(wrapperStyles, className)} {...rest}>
        <Heading
          level={level}
          size="title"
          stroke={stroke}
          align="center"
          mb="sm"
          textShadow={glow ? "textGlow" : undefined}
        >
          {title}
        </Heading>
        {subtitle != null && (
          <Text
            size="lg"
            color="muted"
            align="center"
            lineHeight="relaxed"
            maxWidth="prose"
            center
            mb={mb}
          >
            {subtitle}
          </Text>
        )}
      </div>
    );
  },
);
