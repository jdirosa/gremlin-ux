import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export interface ParallaxLayoutProps extends ComponentPropsWithoutRef<"div"> {
  background: ReactNode;
}

export const ParallaxLayout = forwardRef<HTMLDivElement, ParallaxLayoutProps>(
  function ParallaxLayout({ background, children, style, ...rest }, ref) {
    return (
      <div ref={ref} style={{ position: "relative", ...style }} {...rest}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }} aria-hidden="true">
          {background}
        </div>
        <div style={{ position: "relative", zIndex: 1, overflow: "clip" }}>
          {children}
        </div>
      </div>
    );
  },
);
