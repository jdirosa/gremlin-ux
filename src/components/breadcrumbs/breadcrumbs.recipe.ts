import { css } from "@styled-system/css";

/**
 * Breadcrumbs recipe -- simple nav list with separators.
 *
 * Uses semantic tokens only. No motion needed for a static nav element.
 */

/** Nav wrapper */
export const breadcrumbsNavStyles = css({
  fontFamily: "body",
  fontSize: "sm",
  lineHeight: "normal",
});

/** Ordered list container */
export const breadcrumbsListStyles = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1",
  listStyle: "none",
  margin: "0",
  padding: "0",
});

/** Individual breadcrumb item wrapper */
export const breadcrumbItemStyles = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1",
  color: "fg.muted",

  // Current item (last) is bolder
  "&[aria-current=page]": {
    color: "fg",
    fontWeight: "semibold",
  },

  // Links within breadcrumb items
  "& a": {
    color: "fg.muted",
    textDecoration: "none",
    transition: "color token(durations.fast) token(easings.default)",

    _hover: {
      color: "fg",
      textDecoration: "underline",
    },

    _focusVisible: {
      outline: "none",
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
      borderRadius: "sm",
    },
  },
});

/** Separator between items */
export const breadcrumbSeparatorStyles = css({
  display: "inline-flex",
  alignItems: "center",
  color: "fg.subtle",
  userSelect: "none",
  mx: "1",
});
