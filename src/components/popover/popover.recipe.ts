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
  // Rubber hose entrance: squished flat at the trigger, stretches out with overshoot.
  // Uses individual `scale` property (not transform) to avoid conflicting with
  // Floating UI's `transform: translate()` positioning.
  // transformOrigin is set inline based on resolved placement.
  _motionSafe: {
    transition: "opacity 200ms ease-out",
  },
  "&[data-state=entering]": {
    opacity: 0,
  },
  "&[data-state=open]": {
    opacity: 1,
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
