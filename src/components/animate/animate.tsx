import { useRef, useEffect, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import { animateRecipe, type AnimateVariantProps } from "./animate.recipe";

export type AnimateProps = AnimateVariantProps & {
  /** Direction the element enters from. Default: "up" */
  animation?: "up" | "down" | "left" | "right" | "scale" | "fade";
  /** Animation character. Default: "smooth" */
  feel?: "smooth" | "rubber";
  /** CSS delay value (e.g. "200ms", "0.5s") */
  delay?: string;
  /** Override animation/transition duration */
  duration?: string;
  /** Render as child element via Radix Slot (polymorphism). Never use `as` prop. */
  asChild?: boolean;
  /** Additional class names */
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "animation">;

/**
 * Scroll-triggered entrance animation component.
 *
 * Uses IntersectionObserver internally to detect when the element enters the
 * viewport. Once visible, sets `data-visible="true"` and disconnects the
 * observer (animate once, stay visible).
 *
 * All motion is gated behind `prefers-reduced-motion: no-preference`.
 *
 * @example
 * ```tsx
 * <Animate animation="up">Content slides up</Animate>
 * <Animate animation="scale" feel="rubber">Bouncy entrance</Animate>
 * <Animate animation="fade" asChild><Card>...</Card></Animate>
 * ```
 */
export function Animate({
  animation = "up",
  feel = "smooth",
  delay,
  duration,
  asChild = false,
  className,
  style,
  children,
  ...rest
}: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-visible", "true");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recipeClass = animateRecipe({ animation, feel });

  // Build inline style overrides for delay/duration
  const inlineStyle: React.CSSProperties = { ...style };
  if (delay) {
    if (feel === "rubber") {
      inlineStyle.animationDelay = delay;
    } else {
      inlineStyle.transitionDelay = delay;
    }
  }
  if (duration) {
    if (feel === "rubber") {
      inlineStyle.animationDuration = duration;
    } else {
      inlineStyle.transitionDuration = duration;
    }
  }

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cx(recipeClass, className)}
      style={inlineStyle}
      {...rest}
    >
      {children}
    </Comp>
  );
}
