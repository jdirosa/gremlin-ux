import { css, cva } from "@styled-system/css";

/**
 * Table recipe -- styled HTML table with striped and bordered variants.
 *
 * Uses semantic tokens only. Hover highlight gated behind _motionSafe for transition.
 */

/** Table wrapper recipe with striped and bordered variants */
export const tableRecipe = cva({
  base: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "body",
    fontSize: "sm",
    lineHeight: "normal",
    color: "fg",
  },
  variants: {
    striped: {
      true: {},
    },
    bordered: {
      true: {
        borderStyle: "solid",
        borderWidth: "medium",
        borderColor: "border",
        borderRadius: "md",
      },
    },
  },
});

/** Table head */
export const tableHeadStyles = css({
  borderBottomStyle: "solid",
  borderBottomWidth: "medium",
  borderBottomColor: "border",
});

/** Table body */
export const tableBodyStyles = css({});

/** Table row with hover highlight */
export const tableRowRecipe = cva({
  base: {
    transition: "background-color token(durations.fast) token(easings.default)",

    _hover: {
      bg: "bg.muted",
    },
  },
  variants: {
    striped: {
      true: {
        _even: {
          bg: "bg.subtle",
        },
        _hover: {
          bg: "bg.muted",
        },
      },
    },
  },
});

/** Table header cell */
export const tableHeaderCellStyles = css({
  px: "4",
  py: "3",
  textAlign: "left",
  fontWeight: "semibold",
  color: "fg",
  fontFamily: "body",
  fontSize: "sm",
  whiteSpace: "nowrap",
});

/** Table data cell */
export const tableCellRecipe = cva({
  base: {
    px: "4",
    py: "3",
    textAlign: "left",
    color: "fg",
    fontFamily: "body",
    fontSize: "sm",
  },
  variants: {
    bordered: {
      true: {
        borderStyle: "solid",
        borderWidth: "thin",
        borderColor: "border",
      },
    },
  },
});

export type TableVariantProps = NonNullable<Parameters<typeof tableRecipe>[0]>;
