import { css } from "@styled-system/css";

/**
 * Autocomplete styles — Panda CSS `css()` definitions for each sub-element.
 *
 * Like Modal, Autocomplete is a compound layout component using plain css()
 * definitions rather than cva(). Each sub-element gets its own style object.
 *
 * Animation:
 * - Content: scales from 0.95 + fades in over duration.fast with easing.out
 * - Exit: scales to 0.97 + fades out over duration.fast with easing.in
 * - Item highlight: background transition 100ms ease
 *
 * All motion is wrapped in `_motionSafe`. Only semantic tokens referenced.
 */

/** Content popover — portal-rendered dropdown container */
export const autocompleteContentStyles = css({
  bg: "bg.surface",
  borderRadius: "md",
  borderStyle: "solid",
  borderWidth: "thick",
  borderColor: "border",
  boxShadow: "inkOffset",
  overflow: "hidden",
  outline: "none",
  zIndex: 50,
  minWidth: "200px",

  // Open animation
  "&[data-state=open]": {
    _motionSafe: {
      animation: "scaleIn token(durations.fast) token(easings.out)",
    },
  },

  // Closed animation
  "&[data-state=closed]": {
    _motionSafe: {
      animation: "scaleOut token(durations.fast) token(easings.in)",
    },
  },
});

/** Search input wrapper inside the popover */
export const autocompleteInputStyles = css({
  display: "flex",
  alignItems: "center",
  gap: "2",
  px: "3",
  py: "2",
  borderBottomStyle: "solid",
  borderBottomWidth: "thin",
  borderBottomColor: "border",

  "& input": {
    flex: "1",
    bg: "transparent",
    border: "none",
    outline: "none",
    color: "fg",
    fontFamily: "body",
    fontSize: "sm",
    lineHeight: "normal",
    width: "100%",
    minWidth: "0",
    padding: "0",
    _placeholder: {
      color: "fg.subtle",
    },
  },
});

/** List container — scrollable listbox */
export const autocompleteListStyles = css({
  overflowY: "auto",
  maxHeight: "240px",
  py: "1",
});

/** Individual item — option in the list */
export const autocompleteItemStyles = css({
  display: "flex",
  alignItems: "center",
  gap: "2",
  px: "3",
  py: "2",
  cursor: "pointer",
  color: "fg",
  fontFamily: "body",
  fontSize: "sm",
  lineHeight: "normal",
  outline: "none",
  transition: "background-color token(durations.fast) token(easings.default)",

  // Highlighted (keyboard or hover)
  "&[data-highlighted=true]": {
    bg: "bg.emphasis",
  },

  // Selected
  "&[data-selected=true]": {
    fontWeight: "semibold",
  },

  // Disabled
  "&[aria-disabled=true]": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

/** Checkmark indicator for selected items */
export const autocompleteCheckStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "4",
  height: "4",
  color: "accent",
  flexShrink: 0,
  _motionSafe: {
    transition: "transform token(durations.fast) token(easings.out)",
  },
});

/** Group label */
export const autocompleteGroupLabelStyles = css({
  px: "3",
  py: "1.5",
  fontFamily: "mono",
  fontSize: "xs",
  color: "fg.subtle",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: "medium",
});

/** Separator line */
export const autocompleteSeparatorStyles = css({
  height: "1px",
  bg: "border",
  mx: "2",
  my: "1",
});

/** Empty state message */
export const autocompleteEmptyStyles = css({
  px: "3",
  py: "4",
  textAlign: "center",
  color: "fg.muted",
  fontFamily: "body",
  fontSize: "sm",
});

/** Tag list — wraps selected item chips in multi-select trigger */
export const autocompleteTagListStyles = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "1",
  alignItems: "center",
});

/** Individual tag/chip for a selected item */
export const autocompleteTagStyles = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "1",
  bg: "bg.emphasis",
  color: "fg",
  fontFamily: "body",
  fontSize: "xs",
  fontWeight: "medium",
  borderRadius: "sm",
  borderWidth: "thin",
  borderStyle: "solid",
  borderColor: "border",
  px: "2",
  py: "0.5",
  lineHeight: "tight",
  _motionSafe: {
    transition: "background-color token(durations.fast) token(easings.default)",
  },
});

/** Remove button inside a tag */
export const autocompleteTagRemoveStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "fg.muted",
  borderRadius: "xs",
  flexShrink: 0,
  _hover: {
    color: "fg",
    bg: "bg.subtle",
  },
});

/** Clear all button */
export const autocompleteClearAllStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "fg.subtle",
  flexShrink: 0,
  ml: "1",
  _hover: {
    color: "fg",
  },
});

/** Create action row */
export const autocompleteCreateStyles = css({
  display: "flex",
  alignItems: "center",
  gap: "2",
  px: "3",
  py: "2",
  cursor: "pointer",
  color: "accent",
  fontFamily: "body",
  fontSize: "sm",
  fontWeight: "medium",
  borderTopStyle: "solid",
  borderTopWidth: "thin",
  borderTopColor: "border",
  transition: "background-color token(durations.fast) token(easings.default)",

  _hover: {
    bg: "bg.emphasis",
  },
});
