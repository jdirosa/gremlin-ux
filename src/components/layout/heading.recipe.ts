import { cva } from "@styled-system/css";

export type HeadingVariantProps = NonNullable<Parameters<typeof headingRecipe>[0]>;

export const headingRecipe = cva({
  base: {
    fontFamily: "heading",
    lineHeight: "tight",
  },
  variants: {
    size: {
      display:  { fontSize: "display" },
      title:    { fontSize: "section" },
      subtitle: { fontSize: "sectionSm" },
      label:    { fontSize: "lg" },
    },
    stroke: {
      true: {
        WebkitTextStroke: "8px token(colors.stroke)",
        paintOrder: "stroke fill",
      },
    },
  },
});
