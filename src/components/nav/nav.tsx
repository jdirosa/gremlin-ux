import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { css, cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { navItemRecipe } from "./nav.recipe";

// ── Nav (root) ───────────────────────────────────────────────────────

export type NavProps = ComponentPropsWithoutRef<"nav">;

const NavRoot = forwardRef<HTMLElement, NavProps>(function Nav({ className, children, ...rest }, ref) {
  return (
    <nav
      ref={ref}
      className={cx(css({ display: "flex", flexDirection: "column", gap: "6" }), className)}
      {...rest}
    >
      {children}
    </nav>
  );
});

// ── Nav.Section ──────────────────────────────────────────────────────

export type NavSectionProps = {
  title: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "title">;

const NavSection = forwardRef<HTMLDivElement, NavSectionProps>(function NavSection(
  { title, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(css({ display: "flex", flexDirection: "column", gap: "1" }), className)}
      {...rest}
    >
      <span
        className={css({
          fontSize: "xs",
          fontFamily: "body",
          fontWeight: "bold",
          color: "fg.muted",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          px: "3",
          mb: "1",
        })}
      >
        {title}
      </span>
      {children}
    </div>
  );
});

// ── Nav.Item ─────────────────────────────────────────────────────────

export type NavItemProps = {
  active?: boolean;
  badge?: ReactNode;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button">;

const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(function NavItem(
  { active, badge, asChild, className, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp ref={ref} className={cx(navItemRecipe({ active }), className)} {...rest}>
      {asChild ? (
        children
      ) : (
        <>
          <span className={css({ flex: "1", textAlign: "left" })}>{children}</span>
          {badge != null && badge}
        </>
      )}
    </Comp>
  );
});

// ── Assembly ─────────────────────────────────────────────────────────

export const Nav = Object.assign(NavRoot, {
  Section: NavSection,
  Item: NavItem,
});
