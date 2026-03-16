# Audit Gap Closure Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all repeated custom CSS from the gremlin-ui landing page into reusable design system primitives in gremlin-ux, then update the landing page to consume them.

**Architecture:** Add tokens, keyframes, and 5 new components (Section, Card, Badge, Icon, Divider) plus Heading enhancements to gremlin-ux. Each component follows the established pattern: recipe file (cva), component file (forwardRef + Slot), barrel export. Then update the landing page in gremlin-ui to replace inline styles with the new primitives.

**Tech Stack:** React 19, Panda CSS (cva recipes, semantic tokens), TypeScript strict, Vitest + RTL for tests.

**Spec:** `docs/superpowers/specs/2026-03-16-audit-gap-closure-design.md`

---

## File Map

### gremlin-ux (design system)

**Modified:**
- `panda.config.ts` -- add tokens (overlay, stroke, fontSizes, shadows, sizes, rotations, spacing 0.5), cardWobble keyframe
- `src/components/layout/heading.tsx` -- replace size prop with semantic sizes, add stroke prop, add recipe
- `src/index.ts` -- add exports for new components and recipes

**Created:**
- `src/components/layout/heading.recipe.ts` -- heading recipe with size + stroke variants
- `src/components/section/section.tsx` -- Section component
- `src/components/section/section.recipe.ts` -- Section recipe
- `src/components/section/index.ts` -- barrel export
- `src/components/card/card.tsx` -- Card component
- `src/components/card/card.recipe.ts` -- Card recipe with tilt compound variants
- `src/components/card/index.ts` -- barrel export
- `src/components/badge/badge.tsx` -- Badge component
- `src/components/badge/badge.recipe.ts` -- Badge recipe
- `src/components/badge/index.ts` -- barrel export
- `src/components/icon/icon.tsx` -- Icon component
- `src/components/icon/icon.recipe.ts` -- Icon recipe
- `src/components/icon/index.ts` -- barrel export
- `src/components/divider/divider.tsx` -- Divider component with squiggle SVG
- `src/components/divider/divider.recipe.ts` -- Divider recipe
- `src/components/divider/index.ts` -- barrel export

### gremlin-ui (landing page)

**Modified:**
- `src/landing-page.tsx` -- replace all inline styles with new components/tokens
- `panda.config.ts` -- remove cardWobble keyframe (now in design system)

---

## Chunk 1: Tokens and Keyframes

### Task 1: Add primitive tokens to panda.config.ts

**Files:**
- Modify: `panda.config.ts`

These tokens are added to the `tokens` object alongside existing primitives.

- [ ] **Step 1: Add spacing 0.5 token**

In `panda.config.ts`, inside `tokens.spacing` (after the `0` entry), add:

```ts
0.5: { value: "2px" },
```

- [ ] **Step 2: Add font size tokens**

In `tokens.fontSizes` (after the `"2xl"` entry), add:

```ts
display:   { value: "clamp(2.5rem, 5vw, 5rem)" },
section:   { value: "2.5rem" },
sectionSm: { value: "2rem" },
```

- [ ] **Step 3: Add size tokens**

In `tokens.sizes` (create this section if it doesn't exist, after `fontSizes`), add:

```ts
sizes: {
  prose:       { value: "640px" },
  proseNarrow: { value: "560px" },
},
```

- [ ] **Step 4: Add rotation tokens**

After the `sizes` section, add:

```ts
rotations: {
  sm: { value: "1.2deg" },
  md: { value: "1.5deg" },
  lg: { value: "1.8deg" },
  xl: { value: "2deg" },
},
```

- [ ] **Step 5: Run codegen to verify tokens compile**

Run: `cd ~/repos/gremlin-ux && npx panda codegen`
Expected: Clean output, no errors.

- [ ] **Step 6: Commit**

```bash
cd ~/repos/gremlin-ux && git add panda.config.ts && git commit -m "feat: add primitive tokens (spacing 0.5, display font sizes, prose sizes, rotations)"
```

### Task 2: Add semantic tokens to panda.config.ts

**Files:**
- Modify: `panda.config.ts`

These go in the `semanticTokens` object.

- [ ] **Step 1: Add overlay color tokens**

In `semanticTokens.colors` (after the `status` section), add:

```ts
overlay: {
  light: {
    value: {
      base: "rgba(0, 0, 0, 0.35)",
      _light: "rgba(0, 0, 0, 0.2)",
      _white: "rgba(0, 0, 0, 0.15)",
    },
  },
  medium: {
    value: {
      base: "rgba(10, 10, 11, 0.75)",
      _light: "rgba(10, 10, 11, 0.65)",
      _white: "rgba(10, 10, 11, 0.6)",
    },
  },
  heavy: {
    value: {
      base: "rgba(0, 0, 0, 0.8)",
      _light: "rgba(0, 0, 0, 0.6)",
      _white: "rgba(0, 0, 0, 0.5)",
    },
  },
  mist: {
    value: {
      base: "rgba(255, 255, 255, 0.7)",
      _light: "rgba(255, 255, 255, 0.5)",
      _white: "rgba(255, 255, 255, 0.3)",
    },
  },
  mistFaint: {
    value: {
      base: "rgba(255, 255, 255, 0.5)",
      _light: "rgba(255, 255, 255, 0.3)",
      _white: "rgba(255, 255, 255, 0.15)",
    },
  },
},
```

- [ ] **Step 2: Add stroke color token**

In `semanticTokens.colors` (after `overlay`), add:

```ts
stroke: {
  value: { base: "#0A0A0B", _light: "#0A0A0B", _white: "#0A0A0B" },
},
```

- [ ] **Step 3: Add shadow tokens**

In `semanticTokens.shadows` (after `inkOffset`), add:

```ts
inkOffsetHover: {
  value: "4px 6px 0 {colors.bg.canvas}",
},
textGlow: {
  value: "0 2px 20px rgba(0, 0, 0, 0.8)",
},
```

- [ ] **Step 4: Run codegen to verify**

Run: `cd ~/repos/gremlin-ux && npx panda codegen`
Expected: Clean output, no errors.

- [ ] **Step 5: Commit**

```bash
cd ~/repos/gremlin-ux && git add panda.config.ts && git commit -m "feat: add semantic tokens (overlay colors, stroke, inkOffsetHover, textGlow)"
```

### Task 3: Add cardWobble keyframe

**Files:**
- Modify: `panda.config.ts`

- [ ] **Step 1: Add keyframe**

In the `keyframes` section of `panda.config.ts` (after the `grainShift` keyframe or at the end of the keyframes block), add:

```ts
cardWobble: {
  "0%": { transform: "translateY(0) rotate(var(--tilt)) scale(1)" },
  "40%": { transform: "translateY(-10px) rotate(calc(var(--tilt) * -0.6)) scale(1.03)" },
  "100%": { transform: "translateY(-6px) rotate(0.5deg) scale(1.02)" },
},
```

- [ ] **Step 2: Run codegen to verify**

Run: `cd ~/repos/gremlin-ux && npx panda codegen`
Expected: Clean output.

- [ ] **Step 3: Commit**

```bash
cd ~/repos/gremlin-ux && git add panda.config.ts && git commit -m "feat: add cardWobble keyframe for Card hover animation"
```

---

## Chunk 2: Section Component

### Task 4: Create Section recipe

**Files:**
- Create: `src/components/section/section.recipe.ts`

- [ ] **Step 1: Write the recipe**

```ts
import { cva } from "@styled-system/css";

export type SectionVariantProps = NonNullable<Parameters<typeof sectionRecipe>[0]>;

export const sectionRecipe = cva({
  base: {
    px: { base: "4", md: "6" },
    py: { base: "8", md: "12" },
    width: "100%",
  },
  variants: {
    bg: {
      canvas:   { bg: "bg.canvas" },
      surface:  { bg: "bg.surface" },
      emphasis: { bg: "bg.emphasis" },
    },
  },
  defaultVariants: { bg: "canvas" },
});
```

- [ ] **Step 2: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/section/section.recipe.ts && git commit -m "feat: add Section recipe"
```

### Task 5: Create Section component

**Files:**
- Create: `src/components/section/section.tsx`

- [ ] **Step 1: Write the component**

Follow the established pattern: forwardRef, Slot for asChild, cx for className merging. Section wraps children in Container.

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { sectionRecipe, type SectionVariantProps } from "./section.recipe";
import { Container } from "../layout/container";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "color"> {
  bg?: SectionVariantProps["bg"];
  containerMaxWidth?: ContainerSize;
  asChild?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(
    { bg, containerMaxWidth = "lg", asChild, className, children, ...rest },
    ref,
  ) {
    const recipeClass = sectionRecipe({ bg });
    const Comp = asChild ? Slot : "section";

    return (
      <Comp ref={ref} className={cx(recipeClass, className)} {...rest}>
        <Container maxWidth={containerMaxWidth}>{children}</Container>
      </Comp>
    );
  },
);
```

- [ ] **Step 2: Create barrel export**

Create `src/components/section/index.ts`:

```ts
export { Section } from "./section";
export type { SectionProps } from "./section";
export { sectionRecipe, type SectionVariantProps } from "./section.recipe";
```

- [ ] **Step 3: Verify it compiles**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/section/ && git commit -m "feat: add Section component"
```

---

## Chunk 3: Card Component

### Task 6: Create Card recipe

**Files:**
- Create: `src/components/card/card.recipe.ts`

- [ ] **Step 1: Write the recipe**

```ts
import { cva } from "@styled-system/css";

export type CardVariantProps = NonNullable<Parameters<typeof cardRecipe>[0]>;

export const cardRecipe = cva({
  base: {
    bg: "bg.surface",
    borderWidth: "thick",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "lg",
    p: "6",
    boxShadow: "inkOffset",
  },
  variants: {
    interactive: {
      true: {
        _motionSafe: {
          transition:
            "box-shadow 150ms token(easings.default), transform 150ms token(easings.default)",
        },
        "&:hover": {
          _motionSafe: {
            animation: "cardWobble 500ms token(easings.out) forwards",
          },
          boxShadow: "inkOffsetHover",
        },
        "&:active": {
          _motionSafe: {
            transform: "translateY(0px) rotate(0deg) scale(0.98)",
            transition: "transform 100ms token(easings.out)",
          },
          boxShadow: "sm",
        },
      },
    },
    tilt: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      none: {},
    },
    tiltDirection: {
      left: {},
      right: {},
    },
    padding: {
      none: { p: "0" },
      sm: { p: "4" },
      md: { p: "5" },
      lg: { p: "6" },
      xl: { p: "8" },
    },
  },
  compoundVariants: [
    { tilt: "sm", tiltDirection: "right", css: { transform: "rotate(token(rotations.sm))", "--tilt": "token(rotations.sm)" } },
    { tilt: "sm", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.sm)))", "--tilt": "calc(-1 * token(rotations.sm))" } },
    { tilt: "md", tiltDirection: "right", css: { transform: "rotate(token(rotations.md))", "--tilt": "token(rotations.md)" } },
    { tilt: "md", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.md)))", "--tilt": "calc(-1 * token(rotations.md))" } },
    { tilt: "lg", tiltDirection: "right", css: { transform: "rotate(token(rotations.lg))", "--tilt": "token(rotations.lg)" } },
    { tilt: "lg", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.lg)))", "--tilt": "calc(-1 * token(rotations.lg))" } },
    { tilt: "xl", tiltDirection: "right", css: { transform: "rotate(token(rotations.xl))", "--tilt": "token(rotations.xl)" } },
    { tilt: "xl", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.xl)))", "--tilt": "calc(-1 * token(rotations.xl))" } },
  ],
  defaultVariants: { interactive: false, tilt: "none", tiltDirection: "right", padding: "lg" },
});
```

- [ ] **Step 2: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/card/card.recipe.ts && git commit -m "feat: add Card recipe with tilt compound variants"
```

### Task 7: Create Card component

**Files:**
- Create: `src/components/card/card.tsx`
- Create: `src/components/card/index.ts`

- [ ] **Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { cardRecipe, type CardVariantProps } from "./card.recipe";

export interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "color"> {
  interactive?: CardVariantProps["interactive"];
  tilt?: CardVariantProps["tilt"];
  tiltDirection?: CardVariantProps["tiltDirection"];
  padding?: CardVariantProps["padding"];
  asChild?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { interactive, tilt, tiltDirection, padding, asChild, className, ...rest },
    ref,
  ) {
    const recipeClass = cardRecipe({ interactive, tilt, tiltDirection, padding });
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} className={cx(recipeClass, className)} {...rest} />;
  },
);
```

- [ ] **Step 2: Create barrel export**

Create `src/components/card/index.ts`:

```ts
export { Card } from "./card";
export type { CardProps } from "./card";
export { cardRecipe, type CardVariantProps } from "./card.recipe";
```

- [ ] **Step 3: Verify it compiles**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/card/ && git commit -m "feat: add Card component"
```

---

## Chunk 4: Badge Component

### Task 8: Create Badge recipe

**Files:**
- Create: `src/components/badge/badge.recipe.ts`

- [ ] **Step 1: Write the recipe**

```ts
import { cva } from "@styled-system/css";

export type BadgeVariantProps = NonNullable<Parameters<typeof badgeRecipe>[0]>;

export const badgeRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
    fontFamily: "body",
    fontWeight: "medium",
    borderRadius: "full",
    whiteSpace: "nowrap",
  },
  variants: {
    variant: {
      subtle: {
        bg: "bg.surface",
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "border",
        color: "fg.muted",
      },
      outline: {
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "border",
        color: "fg.muted",
        bg: "transparent",
      },
      solid: {
        bg: "accent",
        color: "fg.onEmphasis",
      },
    },
    size: {
      sm: { px: "3", py: "0.5", fontSize: "xs" },
      md: { px: "4", py: "1", fontSize: "sm" },
    },
  },
  defaultVariants: { variant: "subtle", size: "md" },
});
```

- [ ] **Step 2: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/badge/badge.recipe.ts && git commit -m "feat: add Badge recipe"
```

### Task 9: Create Badge component

**Files:**
- Create: `src/components/badge/badge.tsx`
- Create: `src/components/badge/index.ts`

- [ ] **Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { badgeRecipe, type BadgeVariantProps } from "./badge.recipe";

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  variant?: BadgeVariantProps["variant"];
  size?: BadgeVariantProps["size"];
  icon?: ReactNode;
  asChild?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { variant, size, icon, asChild, className, children, ...rest },
    ref,
  ) {
    const recipeClass = badgeRecipe({ variant, size });
    const Comp = asChild ? Slot : "span";

    return (
      <Comp ref={ref} className={cx(recipeClass, className)} {...rest}>
        {icon != null && <span aria-hidden="true">{icon}</span>}
        {children}
      </Comp>
    );
  },
);
```

- [ ] **Step 2: Create barrel export**

Create `src/components/badge/index.ts`:

```ts
export { Badge } from "./badge";
export type { BadgeProps } from "./badge";
export { badgeRecipe, type BadgeVariantProps } from "./badge.recipe";
```

- [ ] **Step 3: Verify it compiles**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/badge/ && git commit -m "feat: add Badge component"
```

---

## Chunk 5: Heading Enhancements

### Task 10: Create Heading recipe

**Files:**
- Create: `src/components/layout/heading.recipe.ts`

- [ ] **Step 1: Write the recipe**

```ts
import { cva } from "@styled-system/css";

export type HeadingVariantProps = NonNullable<Parameters<typeof headingRecipe>[0]>;

export const headingRecipe = cva({
  base: {
    fontFamily: "heading",
    lineHeight: "tight",
  },
  variants: {
    size: {
      display:  { fontSize: "display" },
      title:    { fontSize: "section" },
      subtitle: { fontSize: "sectionSm" },
      label:    { fontSize: "lg" },
    },
    stroke: {
      true: {
        WebkitTextStroke: "8px token(colors.stroke)",
        paintOrder: "stroke fill",
      },
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/layout/heading.recipe.ts && git commit -m "feat: add Heading recipe with display sizes and stroke variant"
```

### Task 11: Update Heading component

**Files:**
- Modify: `src/components/layout/heading.tsx`

The existing Heading has `size` (xs-2xl), `level` (1-6), `color`, `align`, `asChild`. We replace `size` with semantic names and add `stroke`.

- [ ] **Step 1: Read the current heading.tsx**

Read `src/components/layout/heading.tsx` to see the exact current implementation before modifying.

- [ ] **Step 2: Rewrite the component**

Replace the entire file. Key changes:
- Import and use `headingRecipe` instead of inline `css()` for size
- New `size` prop: `"display" | "title" | "subtitle" | "label"` (optional)
- Keep `level` prop for explicit HTML element control
- Add `stroke` boolean prop
- Element resolution: asChild > level > size default > h2 fallback

The size-to-default-level mapping:

```ts
const sizeToLevel: Record<string, number> = {
  display: 1,
  title: 2,
  subtitle: 3,
  label: 4,
};
```

Preserve the existing `color` and `align` props -- those are used on the landing page and in the system. Use the recipe for size/stroke, and inline `css()` for color/align (same pattern as current).

```tsx
import { createElement, forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { headingRecipe, type HeadingVariantProps } from "./heading.recipe";

const colorMap: Record<string, string> = {
  default: "fg",
  muted: "fg.muted",
  subtle: "fg.subtle",
  accent: "accent",
};

const sizeToLevel: Record<string, number> = {
  display: 1,
  title: 2,
  subtitle: 3,
  label: 4,
};

export interface HeadingProps extends Omit<ComponentPropsWithoutRef<"h1">, "color"> {
  size?: HeadingVariantProps["size"];
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  stroke?: boolean;
  color?: "default" | "muted" | "subtle" | "accent";
  align?: "left" | "center" | "right";
  asChild?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { size, level, stroke, color = "default", align, asChild, className, children, ...rest },
    ref,
  ) {
    const resolvedLevel = level ?? (size ? sizeToLevel[size] : 2);
    const Comp = asChild ? Slot : (`h${resolvedLevel}` as "h1");

    const recipeClass = headingRecipe({ size, stroke });
    const inlineClass = css({
      color: colorMap[color],
      ...(align != null && { textAlign: align }),
    });

    return createElement(
      Comp,
      { ref, className: cx(recipeClass, inlineClass, className), ...rest },
      children,
    );
  },
);
```

- [ ] **Step 3: Verify it compiles**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/layout/heading.tsx src/components/layout/heading.recipe.ts && git commit -m "feat: update Heading with semantic size variants and stroke prop"
```

---

## Chunk 6: Icon Component

### Task 12: Create Icon recipe and component

**Files:**
- Create: `src/components/icon/icon.recipe.ts`
- Create: `src/components/icon/icon.tsx`
- Create: `src/components/icon/index.ts`

- [ ] **Step 1: Write the recipe**

Create `src/components/icon/icon.recipe.ts`:

```ts
import { cva } from "@styled-system/css";

export type IconVariantProps = NonNullable<Parameters<typeof iconRecipe>[0]>;

export const iconRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    "& svg": {
      width: "1em",
      height: "1em",
    },
  },
  variants: {
    size: {
      sm: { fontSize: "md" },
      md: { fontSize: "xl" },
      lg: { fontSize: "2xl" },
    },
    color: {
      current: { color: "fg" },
      muted:   { color: "fg.muted" },
      accent:  { color: "accent" },
    },
  },
  defaultVariants: { size: "md", color: "current" },
});
```

- [ ] **Step 2: Write the component**

Create `src/components/icon/icon.tsx`:

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { iconRecipe, type IconVariantProps } from "./icon.recipe";

export interface IconProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  size?: IconVariantProps["size"];
  color?: IconVariantProps["color"];
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  function Icon({ size, color, className, ...rest }, ref) {
    const recipeClass = iconRecipe({ size, color });

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);
```

- [ ] **Step 3: Create barrel export**

Create `src/components/icon/index.ts`:

```ts
export { Icon } from "./icon";
export type { IconProps } from "./icon";
export { iconRecipe, type IconVariantProps } from "./icon.recipe";
```

- [ ] **Step 4: Verify it compiles**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/icon/ && git commit -m "feat: add Icon component"
```

---

## Chunk 7: Divider Component

### Task 13: Create Divider recipe and component

**Files:**
- Create: `src/components/divider/divider.recipe.ts`
- Create: `src/components/divider/divider.tsx`
- Create: `src/components/divider/index.ts`

- [ ] **Step 1: Write the recipe**

Create `src/components/divider/divider.recipe.ts`:

```ts
import { cva } from "@styled-system/css";

export type DividerVariantProps = NonNullable<Parameters<typeof dividerRecipe>[0]>;

export const dividerRecipe = cva({
  base: {
    border: "none",
    color: "border",
    flexShrink: 0,
  },
  variants: {
    variant: {
      solid: {
        borderTopWidth: "medium",
        borderTopStyle: "solid",
        borderColor: "border",
      },
      dashed: {
        borderTopWidth: "medium",
        borderTopStyle: "dashed",
        borderColor: "border",
      },
      squiggle: {},
    },
    orientation: {
      horizontal: { width: "100%" },
      vertical: {
        height: "100%",
        borderTopWidth: "0",
        borderLeftWidth: "medium",
        borderLeftStyle: "solid",
        borderColor: "border",
      },
    },
  },
  defaultVariants: { variant: "solid", orientation: "horizontal" },
});
```

- [ ] **Step 2: Write the component**

Create `src/components/divider/divider.tsx`:

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";
import { dividerRecipe, type DividerVariantProps } from "./divider.recipe";

export interface DividerProps extends Omit<ComponentPropsWithoutRef<"hr">, "color"> {
  variant?: DividerVariantProps["variant"];
  orientation?: DividerVariantProps["orientation"];
}

const squigglePath =
  "M0,6 Q30,0 60,6 T120,6 T180,6 T240,6 T300,6 T360,6 T420,6 T480,6 T540,6 T600,6 T660,6 T720,6 T780,6 T840,6 T900,6 T960,6 T1020,6 T1080,6 T1140,6 T1200,6";

const squiggleStyles = css({
  width: "100%",
  height: "12px",
  display: "block",
  color: "border",
});

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  function Divider({ variant, orientation = "horizontal", className, ...rest }, ref) {
    if (variant === "squiggle") {
      return (
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          role="separator"
          aria-orientation={orientation}
          className={cx(squiggleStyles, className)}
        >
          <path
            d={squigglePath}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      );
    }

    const recipeClass = dividerRecipe({ variant, orientation });

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);
```

- [ ] **Step 3: Create barrel export**

Create `src/components/divider/index.ts`:

```ts
export { Divider } from "./divider";
export type { DividerProps } from "./divider";
export { dividerRecipe, type DividerVariantProps } from "./divider.recipe";
```

- [ ] **Step 4: Verify it compiles**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/divider/ && git commit -m "feat: add Divider component with squiggle variant"
```

---

## Chunk 8: Barrel Exports and Build

### Task 14: Update barrel exports

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Read current index.ts**

Read `src/index.ts` to see exact current exports before modifying.

- [ ] **Step 2: Add new exports**

Add these exports to `src/index.ts`. Place component exports in the Components section and recipe exports in the Recipes section, following the existing grouping:

Components section:
```ts
export { Section } from "./components/section";
export type { SectionProps } from "./components/section";
export { Card } from "./components/card";
export type { CardProps } from "./components/card";
export { Badge } from "./components/badge";
export type { BadgeProps } from "./components/badge";
export { Icon } from "./components/icon";
export type { IconProps } from "./components/icon";
export { Divider } from "./components/divider";
export type { DividerProps } from "./components/divider";
```

Recipes section:
```ts
export { sectionRecipe, type SectionVariantProps } from "./components/section";
export { cardRecipe, type CardVariantProps } from "./components/card";
export { badgeRecipe, type BadgeVariantProps } from "./components/badge";
export { iconRecipe, type IconVariantProps } from "./components/icon";
export { dividerRecipe, type DividerVariantProps } from "./components/divider";
export { headingRecipe, type HeadingVariantProps } from "./components/layout/heading.recipe";
```

Note: The heading recipe is exported via a direct path since the layout directory has no barrel `index.ts` (layout components are individually imported in `src/index.ts`). This is consistent with existing layout exports.

- [ ] **Step 3: Run full build**

Run: `cd ~/repos/gremlin-ux && npm run build`
Expected: Clean build with no errors. Check that `dist/` contains the new exports.

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/index.ts && git commit -m "feat: export new components (Section, Card, Badge, Icon, Divider) and recipes"
```

### Task 15: Publish / link the package

**Files:** None (npm commands only)

- [ ] **Step 1: Bump version**

Run: `cd ~/repos/gremlin-ux && npm version minor --no-git-tag-version`

This bumps from 0.3.4 to 0.4.0 since we're adding new public API.

- [ ] **Step 2: Build and publish**

Run: `cd ~/repos/gremlin-ux && npm run build && npm publish`

If using npm link instead of publishing:
Run: `cd ~/repos/gremlin-ux && npm link && cd ~/repos/gremlin-ui && npm link @gremlin-ui/react`

- [ ] **Step 3: Commit version bump**

```bash
cd ~/repos/gremlin-ux && git add package.json && git commit -m "chore: bump version to 0.4.0"
```

---

## Chunk 9: Landing Page Updates

### Task 16: Update landing page imports and delete shared styles

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

- [ ] **Step 1: Update the @gremlin-ui/react dependency**

Run: `cd ~/repos/gremlin-ui && npm install @gremlin-ui/react@latest`

(Skip if using npm link.)

- [ ] **Step 2: Read the current landing-page.tsx**

Read the full file to identify all replacement targets.

- [ ] **Step 3: Update imports**

Add to the import from `@gremlin-ui/react`:

```ts
Section, Card, Badge, Icon, Divider,
```

- [ ] **Step 4: Delete shared style objects**

Remove these definitions:
- `sectionPaddingStyles` (line ~182-185)
- `inkCardStyles` (line ~187-203)
- `cardTiltAngles` and `cardTilts` (line ~244-248)
- `strokeBlack` (line ~251-254)

- [ ] **Step 5: Delete SquiggleDivider component**

Remove the `SquiggleDivider` function (line ~224-239).

- [ ] **Step 6: Commit deletions**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx && git commit -m "refactor: remove shared style objects and SquiggleDivider (moved to design system)"
```

### Task 17: Replace section wrappers with Section component

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

- [ ] **Step 1: Find and replace section patterns**

Search for all instances of the pattern:
```tsx
<section className={css({ ...sectionPaddingStyles, ... })}>
  <Container ...>
```

Replace each with `<Section bg="...">`. The `bg` value comes from the inline bg property. Remove the `</Container>` and `</section>` closing tags and replace with `</Section>`.

There are ~8 sections. Each one follows the same pattern. Match the `bg` prop:
- `bg: "bg.surface"` becomes `bg="surface"`
- `bg: "bg.canvas"` becomes `bg="canvas"` (or omit, it's the default)
- `bg: "bg.emphasis"` becomes `bg="emphasis"`

- [ ] **Step 2: Verify the file still compiles**

Run: `cd ~/repos/gremlin-ui && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx && git commit -m "refactor: replace section wrappers with Section component"
```

### Task 18: Replace card divs with Card component

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

- [ ] **Step 1: Find and replace card patterns**

Search for all instances of `css(inkCardStyles)` or inline card styling matching the inkCardStyles pattern. Replace with `<Card>` component.

For cards with `style={cardTilts[N]}`, map the tilt angles to the semantic variants:
- `cardTilts[0]` (-1.8deg) -> `tilt="lg" tiltDirection="left"`
- `cardTilts[1]` (1.5deg) -> `tilt="md"`
- `cardTilts[2]` (-1.2deg) -> `tilt="sm" tiltDirection="left"`
- `cardTilts[3]` (2deg) -> `tilt="xl"`

Cards with hover/active styles get `interactive`.

Also replace any remaining inline card patterns (cards that don't use `inkCardStyles` but have the same border/shadow/radius pattern) with `<Card>`.

- [ ] **Step 2: Replace hardcoded hover shadows**

Any remaining `boxShadow: "4px 6px 0 token(colors.bg.canvas)"` becomes `boxShadow: "inkOffsetHover"`.

- [ ] **Step 3: Verify compilation**

Run: `cd ~/repos/gremlin-ui && npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx && git commit -m "refactor: replace card divs with Card component"
```

### Task 19: Replace badges, headings, icons, and dividers

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

- [ ] **Step 1: Replace inline badge styling with Badge**

Find the hero badge (around line 431-454) and feature badges. Replace with `<Badge>` component. The hero badge uses `icon={<SparkleIcon />}`.

- [ ] **Step 2: Replace hardcoded heading font sizes with Heading size variants**

Find all instances of `<h1`, `<h2`, `<Heading` with hardcoded `fontSize: "5rem"`, `"2.5rem"`, or `"2rem"`. Replace with `<Heading size="display|title|subtitle" stroke>`.

Remove the `strokeBlack` class usage and replace with the `stroke` prop.

- [ ] **Step 3: Wrap SVG icons in Icon component**

Find instances where icons have manual size/color styling (e.g., `css({ fontSize: "xl", color: "accent" })`). Replace with `<Icon size="md" color="accent">`.

- [ ] **Step 4: Replace SquiggleDivider usage with Divider**

Replace all `<SquiggleDivider />` with `<Divider variant="squiggle" />`.

- [ ] **Step 5: Verify compilation**

Run: `cd ~/repos/gremlin-ui && npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx && git commit -m "refactor: replace badges, headings, icons, dividers with design system components"
```

### Task 20: Replace raw token values

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

- [ ] **Step 1: Replace raw rgba() overlay values**

Search for:
- `rgba(0,0,0,0.35)` or `rgba(0, 0, 0, 0.35)` -> `token(colors.overlay.light)`
- `rgba(10, 10, 11, 0.75)` -> `token(colors.overlay.medium)`
- `rgba(0,0,0,0.8)` or `rgba(0, 0, 0, 0.8)` -> `token(colors.overlay.heavy)`
- `rgba(255,255,255,0.7)` -> `token(colors.overlay.mist)`
- `rgba(255,255,255,0.5)` -> `token(colors.overlay.mistFaint)`

Note: Some of these may be in CSS strings (like gradient values) where you use `token()` syntax. For inline style objects, use the semantic token name directly.

- [ ] **Step 2: Replace hardcoded maxWidth with prose tokens**

Search for `maxWidth: "640px"` -> `maxWidth: "prose"` and `maxWidth: "560px"` -> `maxWidth: "proseNarrow"`.

- [ ] **Step 3: Replace hardcoded stroke**

Any remaining `WebkitTextStroke: "8px #0A0A0B"` -> `WebkitTextStroke: "8px token(colors.stroke)"`.

- [ ] **Step 4: Replace textShadow**

Any `textShadow: "0 2px 20px rgba(0,0,0,0.8)"` -> `textShadow: "textGlow"`.

- [ ] **Step 5: Remove cardWobble from landing page panda.config.ts**

The `cardWobble` keyframe now lives in the design system. Remove it from `~/repos/gremlin-ui/panda.config.ts`.

- [ ] **Step 6: Verify compilation and run dev server**

Run: `cd ~/repos/gremlin-ui && npx tsc --noEmit`
Run: `cd ~/repos/gremlin-ui && npm run build`
Expected: Clean build.

- [ ] **Step 7: Commit**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx panda.config.ts && git commit -m "refactor: replace raw rgba/shadow/stroke values with design system tokens"
```

### Task 21: Final verification

- [ ] **Step 1: Run the dev server**

Run: `cd ~/repos/gremlin-ui && npm run dev`

Open http://localhost:5173 and verify:
- All sections render with correct backgrounds and padding
- Cards have ink-offset shadow, tilt, and wobble on hover
- Badges render with correct styling
- Headings have correct sizes and stroke
- Squiggle dividers render
- Color mode switching works (if applicable)

- [ ] **Step 2: Review the diff**

Run: `cd ~/repos/gremlin-ui && git diff HEAD~5..HEAD --stat`

Verify significant line reduction in `landing-page.tsx`.

- [ ] **Step 3: Run the design system tests**

Run: `cd ~/repos/gremlin-ux && npm test`
Expected: All existing tests still pass.

### Task 22: Landing page copy changes

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

- [ ] **Step 1: Rename "The Five Commandments" to "Design Philosophy"**

Find the heading text `The Five Commandments` and replace with `Design Philosophy`.

- [ ] **Step 2: Update "Built With" section copy**

Replace:
```
Rigorous engineering underneath the personality.
You trust it because it&apos;s thorough.
```

With:
```
A fun project built on solid design principles.
```

- [ ] **Step 3: Clean up modal demo text**

In the modal demo section, find:
```
with ARIA. The gremlin is thorough.
```

Replace with:
```
with ARIA.
```

- [ ] **Step 4: Commit**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx && git commit -m "content: tone down copy in philosophy and tech stack sections"
```
