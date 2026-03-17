import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { topNavRecipe, topNavLinkRecipe } from "./top-nav.recipe";
import { Container } from "../layout/container";
import { HStack } from "../layout/hstack";

// -- TopNav (root) ------------------------------------------------------------

export type TopNavProps = {
  scrolled?: boolean;
} & ComponentPropsWithoutRef<"header">;

const TopNavRoot = forwardRef<HTMLElement, TopNavProps>(function TopNav(
  { scrolled, className, children, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={cx(topNavRecipe({ scrolled }), className)} {...rest}>
      <Container maxWidth="xl">
        <HStack align="center" justify="between" className={css({ py: "3" })}>
          {children}
        </HStack>
      </Container>
    </header>
  );
});

// -- TopNav.Brand -------------------------------------------------------------

export type TopNavBrandProps = ComponentPropsWithoutRef<"div">;

const Brand = forwardRef<HTMLDivElement, TopNavBrandProps>(function TopNavBrand(
  { className, children, ...rest },
  ref,
) {
  return (
    <HStack ref={ref} align="center" gap="sm" className={className} {...rest}>
      {children}
    </HStack>
  );
});

// -- TopNav.Links -------------------------------------------------------------

export type TopNavLinksProps = ComponentPropsWithoutRef<"div">;

const Links = forwardRef<HTMLDivElement, TopNavLinksProps>(function TopNavLinks(
  { className, children, ...rest },
  ref,
) {
  return (
    <HStack
      ref={ref}
      align="center"
      gap="md"
      className={cx(
        css({
          display: "none",
          "@media (min-width: 768px)": { display: "flex" },
        }),
        className,
      )}
      data-part="links"
      {...rest}
    >
      {children}
    </HStack>
  );
});

// -- TopNav.Link --------------------------------------------------------------

export type TopNavLinkProps = {
  active?: boolean;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"a">;

const Link = forwardRef<HTMLAnchorElement, TopNavLinkProps>(function TopNavLink(
  { active, asChild, className, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp ref={ref} className={cx(topNavLinkRecipe({ active }), className)} {...rest}>
      {children}
    </Comp>
  );
});

// -- TopNav.Actions -----------------------------------------------------------

export type TopNavActionsProps = ComponentPropsWithoutRef<"div">;

const Actions = forwardRef<HTMLDivElement, TopNavActionsProps>(function TopNavActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <HStack ref={ref} align="center" gap="sm" className={className} {...rest}>
      {children}
    </HStack>
  );
});

// -- TopNav.MobileToggle ------------------------------------------------------

export type TopNavMobileToggleProps = ComponentPropsWithoutRef<"button">;

const MobileToggle = forwardRef<HTMLButtonElement, TopNavMobileToggleProps>(
  function TopNavMobileToggle({ className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={cx(
          css({
            display: "flex",
            "@media (min-width: 768px)": { display: "none" },
            alignItems: "center",
            justifyContent: "center",
            bg: "transparent",
            border: "none",
            cursor: "pointer",
            color: "fg",
            p: "1",
          }),
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

// -- Assembly -----------------------------------------------------------------

export const TopNav = Object.assign(TopNavRoot, {
  Brand,
  Links,
  Link,
  Actions,
  MobileToggle,
});
