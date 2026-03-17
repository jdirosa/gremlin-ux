import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import { linkRecipe, type LinkVariantProps } from "./link.recipe";

export type LinkProps = LinkVariantProps & {
  asChild?: boolean;
  className?: string;
} & ComponentPropsWithoutRef<"a">;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ variant, underline, size, asChild = false, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        className={cx(linkRecipe({ variant, underline, size }), className)}
        {...rest}
      />
    );
  },
);
