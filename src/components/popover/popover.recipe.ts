import { css } from "@styled-system/css";

export const popoverContentStyles = css({
  bg: "bg.surface",
  color: "fg",
  fontFamily: "body",
  fontSize: "md",
  lineHeight: "normal",
  p: "4",
  borderRadius: "lg",
  borderWidth: "thick",
  borderStyle: "solid",
  borderColor: "border",
  boxShadow: "inkOffset",
  zIndex: 50,
  outline: "none",
  _motionSafe: {
    animation: "scaleIn",
  },
  _focusVisible: {
    boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent), token(shadows.inkOffset)",
  },
});

export const popoverArrowStyles = css({
  position: "absolute",
  width: "10px",
  height: "10px",
  bg: "bg.surface",
  borderWidth: "thick",
  borderStyle: "solid",
  borderColor: "border",
  transform: "rotate(45deg)",
});
