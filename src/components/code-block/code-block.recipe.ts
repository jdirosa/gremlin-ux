import { cva } from "@styled-system/css";

export type CodeBlockVariantProps = NonNullable<Parameters<typeof codeBlockRecipe>[0]>;

export const codeBlockRecipe = cva({
  base: {
    fontFamily: "mono",
    fontSize: "sm",
    color: "fg.muted",
    bg: "bg.subtle",
    p: "4",
    borderRadius: "md",
    borderWidth: "thin",
    borderStyle: "solid",
    borderColor: "border",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  variants: {
    align: {
      left: { textAlign: "left" },
      center: { textAlign: "center" },
    },
  },
  defaultVariants: { align: "left" },
});
