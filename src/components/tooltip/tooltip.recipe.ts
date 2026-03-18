import { css } from "@styled-system/css";

export const tooltipContentStyles = css({
  bg: "bg.emphasis",
  color: "fg",
  fontFamily: "body",
  fontSize: "sm",
  lineHeight: "tight",
  fontWeight: "medium",
  px: "3",
  py: "1",
  borderRadius: "sm",
  borderWidth: "medium",
  borderStyle: "solid",
  borderColor: "border",
  boxShadow: "md",
  pointerEvents: "none",
  whiteSpace: "nowrap",
  zIndex: 100,
  _motionSafe: {
    animation: "fadeIn token(durations.fast) token(easings.out)",
  },
});

export const tooltipArrowStyles = css({
  position: "absolute",
  width: "8px",
  height: "8px",
  bg: "bg.emphasis",
  borderWidth: "medium",
  borderStyle: "solid",
  borderColor: "border",
  transform: "rotate(45deg)",
  // Borders get clipped based on placement via inline style
});
