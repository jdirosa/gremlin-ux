import { css, cva } from "@styled-system/css";

/**
 * Pagination recipe -- page buttons with prev/next navigation.
 *
 * Uses semantic tokens only. Motion gated behind _motionSafe.
 */

/** Nav wrapper */
export const paginationNavStyles = css({
  display: "flex",
  alignItems: "center",
  gap: "1",
  fontFamily: "body",
  fontSize: "sm",
});

/** Page button recipe with active state */
export const paginationButtonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "8",
    height: "8",
    px: "2",
    borderRadius: "md",
    borderStyle: "solid",
    borderWidth: "medium",
    borderColor: "border",
    bg: "transparent",
    color: "fg",
    fontWeight: "medium",
    fontSize: "sm",
    cursor: "pointer",
    userSelect: "none",
    outline: "none",
    transition: "background-color token(durations.fast) token(easings.default), border-color token(durations.fast) token(easings.default), color token(durations.fast) token(easings.default)",

    _motionSafe: {
      transition: "background-color token(durations.fast) token(easings.default), border-color token(durations.fast) token(easings.default), color token(durations.fast) token(easings.default), transform token(durations.fast) token(easings.rubber)",
    },

    _hover: {
      bg: "bg.muted",
      borderColor: "border.hover",
      _motionSafe: {
        transform: "scale(1.05)",
      },
    },

    _active: {
      _motionSafe: {
        transform: "scale(0.95)",
      },
    },

    _focusVisible: {
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
    },

    "&[aria-disabled=true]": {
      opacity: 0.4,
      cursor: "not-allowed",
      _hover: {
        bg: "transparent",
        borderColor: "border",
        _motionSafe: {
          transform: "none",
        },
      },
    },
  },
  variants: {
    active: {
      true: {
        bg: "accent",
        color: "fg.onEmphasis",
        borderColor: "border.hover",
        boxShadow: "inkOffset",
        fontWeight: "bold",

        _hover: {
          bg: "accent.hover",
        },
      },
    },
  },
});

/** Ellipsis styles */
export const paginationEllipsisStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "8",
  height: "8",
  color: "fg.subtle",
  userSelect: "none",
  fontSize: "sm",
});

export type PaginationButtonVariantProps = NonNullable<Parameters<typeof paginationButtonRecipe>[0]>;
