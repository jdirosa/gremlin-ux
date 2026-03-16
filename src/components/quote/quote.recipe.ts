import { cva } from "@styled-system/css";

export const quoteMarkStyles = cva({
  base: {
    color: "accent",
    fontSize: "3rem",
    lineHeight: "1",
    mb: "3",
    fontFamily: "heading",
  },
});

export const quoteAttributionStyles = cva({
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3",
  },
});
