# Design Spec: Landing Page Audit Gap Closure

**Date:** 2026-03-16
**Scope:** All 10 items from `sessions/landing-page-audit.md`
**Repos:** `gremlin-ux` (design system), `gremlin-ui` (landing page)
**Goal:** Extract repeated custom CSS from the landing page into reusable design system primitives. No visual changes -- the landing page should render identically before and after.

---

## 1. Token Additions (`panda.config.ts`)

### Overlay semantic tokens

Replace raw `rgba()` values scattered across the landing page. These use the `{ base, _light, _white }` structure consistent with all other semantic tokens. Current values are extracted from the dark-mode landing page; light/white variants use adjusted opacities appropriate for lighter backgrounds.

```ts
semanticTokens: {
  colors: {
    overlay: {
      light: {
        value: {
          base: "rgba(0, 0, 0, 0.35)",
          _light: "rgba(0, 0, 0, 0.2)",
          _white: "rgba(0, 0, 0, 0.15)",
        },
      },  // vignette gradient
      medium: {
        value: {
          base: "rgba(10, 10, 11, 0.75)",
          _light: "rgba(10, 10, 11, 0.65)",
          _white: "rgba(10, 10, 11, 0.6)",
        },
      },  // text highlight bg
      heavy: {
        value: {
          base: "rgba(0, 0, 0, 0.8)",
          _light: "rgba(0, 0, 0, 0.6)",
          _white: "rgba(0, 0, 0, 0.5)",
        },
      },  // text shadow
      mist: {
        value: {
          base: "rgba(255, 255, 255, 0.7)",
          _light: "rgba(255, 255, 255, 0.5)",
          _white: "rgba(255, 255, 255, 0.3)",
        },
      },  // smoke wisps
      mistFaint: {
        value: {
          base: "rgba(255, 255, 255, 0.5)",
          _light: "rgba(255, 255, 255, 0.3)",
          _white: "rgba(255, 255, 255, 0.15)",
        },
      },  // faint smoke wisps
    },
  },
}
```

### Stroke token

Replace hardcoded `#0A0A0B` in `WebkitTextStroke`.

```ts
semanticTokens: {
  colors: {
    stroke: { value: { base: "#0A0A0B", _light: "#0A0A0B", _white: "#0A0A0B" } },
  },
}
```

### Display heading font sizes

Replace 9 hardcoded `fontSize` values on headings.

```ts
tokens: {
  fontSizes: {
    display:   { value: "clamp(2.5rem, 5vw, 5rem)" },  // hero
    section:   { value: "2.5rem" },                      // section headings
    sectionSm: { value: "2rem" },                        // footer/smaller
  },
}
```

### Decorative shadow tokens

Replace hardcoded `boxShadow` and `textShadow` strings.

```ts
semanticTokens: {
  shadows: {
    inkOffsetHover: { value: "4px 6px 0 {colors.bg.canvas}" },
    textGlow:       { value: "0 2px 20px rgba(0, 0, 0, 0.8)" },
  },
}
```

### Prose width tokens

Replace hardcoded `maxWidth: "640px"` / `"560px"`.

```ts
tokens: {
  sizes: {
    prose:       { value: "640px" },
    proseNarrow: { value: "560px" },
  },
}
```

### Rotation tokens

Support Card tilt variants. Panda CSS supports custom token categories -- these become CSS custom properties (e.g., `--rotations-sm: 1.2deg`). Referenced in recipes via `token(rotations.sm)`.

```ts
tokens: {
  rotations: {
    sm: { value: "1.2deg" },
    md: { value: "1.5deg" },
    lg: { value: "1.8deg" },
    xl: { value: "2deg" },
  },
}
```

### `cardWobble` keyframe

The Card component's hover animation. Currently defined in the landing page's `panda.config.ts` but not in the design system. Must be added to `gremlin-ux/panda.config.ts` keyframes.

```ts
keyframes: {
  cardWobble: {
    "0%": { transform: "translateY(0) rotate(var(--tilt)) scale(1)" },
    "40%": { transform: "translateY(-10px) rotate(calc(var(--tilt) * -0.6)) scale(1.03)" },
    "100%": { transform: "translateY(-6px) rotate(0.5deg) scale(1.02)" },
  },
}
```

The keyframe reads `--tilt` from the CSS custom property set by the Card's tilt compound variants.

### Spacing token addition

Badge `sm` size needs a half-step spacing value.

```ts
tokens: {
  spacing: {
    0.5: { value: "2px" },
  },
}
```

---

## 2. Section Component

**Location:** `src/components/section/`
**Files:** `section.tsx`, `section.recipe.ts`, `index.ts`

Extracts the repeated pattern of responsive padding + background + Container wrapper used in 8+ sections on the landing page.

### Recipe

```ts
import { cva } from "@styled-system/css";

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

### Component

```tsx
interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  bg?: "canvas" | "surface" | "emphasis";
  containerMaxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  asChild?: boolean;
}
```

- Renders `<section>` (or child via `asChild`)
- Wraps children in `<Container maxWidth={containerMaxWidth}>` (defaults to `"lg"`)
- Applies recipe class + any passed `className`

### Landing page usage

```tsx
// Before:
<section className={css({ ...sectionPaddingStyles, bg: "bg.surface" })}>
  <Container size="lg">{content}</Container>
</section>

// After:
<Section bg="surface">{content}</Section>
```

---

## 3. Card Component

**Location:** `src/components/card/`
**Files:** `card.tsx`, `card.recipe.ts`, `index.ts`

Extracts `inkCardStyles`, hover wobble animation, tilt rotation, and active press-down used on 15+ cards.

### Recipe

```ts
import { cva } from "@styled-system/css";

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
    // sm
    { tilt: "sm", tiltDirection: "right", css: { transform: "rotate(token(rotations.sm))", "--tilt": "token(rotations.sm)" } },
    { tilt: "sm", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.sm)))", "--tilt": "calc(-1 * token(rotations.sm))" } },
    // md
    { tilt: "md", tiltDirection: "right", css: { transform: "rotate(token(rotations.md))", "--tilt": "token(rotations.md)" } },
    { tilt: "md", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.md)))", "--tilt": "calc(-1 * token(rotations.md))" } },
    // lg
    { tilt: "lg", tiltDirection: "right", css: { transform: "rotate(token(rotations.lg))", "--tilt": "token(rotations.lg)" } },
    { tilt: "lg", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.lg)))", "--tilt": "calc(-1 * token(rotations.lg))" } },
    // xl
    { tilt: "xl", tiltDirection: "right", css: { transform: "rotate(token(rotations.xl))", "--tilt": "token(rotations.xl)" } },
    { tilt: "xl", tiltDirection: "left", css: { transform: "rotate(calc(-1 * token(rotations.xl)))", "--tilt": "calc(-1 * token(rotations.xl))" } },
  ],
  defaultVariants: { interactive: false, tilt: "none", tiltDirection: "right", padding: "lg" },
});
```

### Component

```tsx
interface CardProps extends ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
  tilt?: "sm" | "md" | "lg" | "xl" | "none";
  tiltDirection?: "left" | "right";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
}
```

- Renders `<div>` (or child via `asChild`)
- Applies recipe class + any passed `className`

### Landing page usage

```tsx
// Before:
<div className={css(inkCardStyles)} style={cardTilts[0]}>

// After:
<Card interactive tilt="lg" tiltDirection="left">
```

---

## 4. Badge Component

**Location:** `src/components/badge/`
**Files:** `badge.tsx`, `badge.recipe.ts`, `index.ts`

Extracts the hero badge and ~15 feature badges.

### Recipe

```ts
import { cva } from "@styled-system/css";

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

### Component

```tsx
interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: "subtle" | "outline" | "solid";
  size?: "sm" | "md";
  icon?: ReactNode;
  asChild?: boolean;
}
```

- Renders `<span>` (or child via `asChild`)
- `icon` renders before children with `aria-hidden="true"`
- Applies recipe class + any passed `className`

### Landing page usage

```tsx
// Before:
<div className={css({ display: "inline-flex", alignItems: "center", gap: "2", bg: "bg.surface", borderWidth: "medium", ... })}>
  <Text color="accent"><SparkleIcon /></Text>
  Design System
</div>

// After:
<Badge icon={<SparkleIcon />}>Design System</Badge>
```

---

## 5. Heading Size Variants

**Location:** Modify existing `src/components/layout/heading.tsx`
**New file:** `src/components/layout/heading.recipe.ts`

**Breaking change:** The existing Heading has a `size` prop with values `"xs" | "sm" | "md" | "lg" | "xl" | "2xl"` that map to raw `fontSize` tokens. This is replaced with semantic size names. The existing `level` prop (1-6) is preserved as the explicit HTML element control.

### Recipe

```ts
import { cva } from "@styled-system/css";

export const headingRecipe = cva({
  base: {
    fontFamily: "heading",
    lineHeight: "tight",
  },
  variants: {
    size: {
      display:   { fontSize: "display" },    // clamp(2.5rem, 5vw, 5rem)
      title:     { fontSize: "section" },    // 2.5rem
      subtitle:  { fontSize: "sectionSm" },  // 2rem
      label:     { fontSize: "lg" },          // existing lg token
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

### Updated component

```tsx
interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  size?: "display" | "title" | "subtitle" | "label";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  stroke?: boolean;
  asChild?: boolean;
}
```

**Element resolution order:**
1. `asChild` -- renders the child element (highest priority)
2. `level` -- explicit HTML element override (e.g., `level={2}` renders `<h2>`)
3. `size` -- implicit default: display -> h1, title -> h2, subtitle -> h3, label -> h4
4. No props -- defaults to `<h2>` (preserves current default)

Example: `<Heading size="display" level={2}>` renders a visually large `<h2>` (level wins over size's implicit h1).

### Migration

The old size values (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`) are removed. The only current consumer is the landing page, which hardcodes font sizes anyway and doesn't use the old `size` prop. If other consumers exist, they need to migrate to the new semantic names or use `className` for custom sizing.

### Landing page usage

```tsx
// Before:
<h1 className={css({ fontFamily: "heading", fontSize: "5rem", ...strokeBlack })}>

// After:
<Heading size="display" stroke>
```

---

## 6. Icon Component

**Location:** `src/components/icon/`
**Files:** `icon.tsx`, `icon.recipe.ts`, `index.ts`

Normalizes sizing and color for inline SVG icons.

### Recipe

```ts
import { cva } from "@styled-system/css";

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

### Component

```tsx
interface IconProps extends ComponentPropsWithoutRef<"span"> {
  size?: "sm" | "md" | "lg";
  color?: "current" | "muted" | "accent";
}
```

- Renders `<span>` with `aria-hidden="true"`
- Children: the SVG element
- Applies recipe class + any passed `className`
- No `asChild` -- purely decorative wrapper

### Landing page usage

```tsx
// Before:
<span className={css({ fontSize: "xl", color: "accent" })}><SparkleIcon /></span>

// After:
<Icon size="md" color="accent"><SparkleIcon /></Icon>
```

---

## 7. Divider Component

**Location:** `src/components/divider/`
**Files:** `divider.tsx`, `divider.recipe.ts`, `index.ts`

Replaces the hand-built `SquiggleDivider` and adds standard line variants.

### Recipe

```ts
import { cva } from "@styled-system/css";

export const dividerRecipe = cva({
  base: {
    border: "none",
    color: "border",
    flexShrink: 0,
  },
  variants: {
    variant: {
      solid:   { borderTopWidth: "medium", borderTopStyle: "solid", borderColor: "border" },
      dashed:  { borderTopWidth: "medium", borderTopStyle: "dashed", borderColor: "border" },
      squiggle: {},  // SVG-based, styled in component
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

### Component

```tsx
interface DividerProps extends ComponentPropsWithoutRef<"hr"> {
  variant?: "solid" | "dashed" | "squiggle";
  orientation?: "horizontal" | "vertical";
}
```

- `solid`/`dashed` render `<hr>` with recipe styles
- `squiggle` renders an inline SVG with the quadratic Bezier wave path, colored via `currentColor` inheriting from `color: "border"` token
- All variants get `role="separator"` and `aria-orientation`
- Supports `className`

### Squiggle SVG (baked into component)

The SVG path from the landing page's `SquiggleDivider`:
- `viewBox="0 0 1200 12"`, `preserveAspectRatio="none"`
- Quadratic Bezier wave pattern
- `stroke="currentColor"`, `strokeWidth="2.5"`, `fill="none"`
- Wrapper: `width: 100%`, `height: 12px`, `display: block`

### Landing page usage

```tsx
// Before:
<SquiggleDivider />

// After:
<Divider variant="squiggle" />
```

---

## 8. Barrel Export Updates

Add to `src/index.ts`:

```ts
// New components
export { Section } from "./components/section";
export { Card } from "./components/card";
export { Badge } from "./components/badge";
export { Icon } from "./components/icon";
export { Divider } from "./components/divider";

// New recipes (for advanced usage)
export { sectionRecipe } from "./components/section/section.recipe";
export { cardRecipe } from "./components/card/card.recipe";
export { badgeRecipe } from "./components/badge/badge.recipe";
export { iconRecipe } from "./components/icon/icon.recipe";
export { dividerRecipe } from "./components/divider/divider.recipe";
export { headingRecipe } from "./components/layout/heading.recipe";
```

---

## 9. Landing Page Updates (`gremlin-ui`)

After bumping `@gremlin-ui/react` to the new version:

1. **Delete** `sectionPaddingStyles`, `inkCardStyles`, `strokeBlack`, `cardTiltAngles`, `cardTilts` shared objects
2. **Delete** the `SquiggleDivider` component definition
3. **Replace** all section wrappers with `<Section bg="...">` (removes ~8 Container wrappings)
4. **Replace** all card divs with `<Card interactive tilt="..." tiltDirection="...">` (~15 instances)
5. **Replace** all inline badge styling with `<Badge>` (~3 instances)
6. **Replace** all hardcoded heading font sizes with `<Heading size="..." stroke>` (~9 instances)
7. **Replace** all raw `rgba()` values with overlay tokens (~5 instances)
8. **Replace** hardcoded shadow strings with `inkOffsetHover` / `textGlow` tokens
9. **Replace** hardcoded `maxWidth` with `prose` / `proseNarrow` tokens
10. **Replace** `#0A0A0B` stroke with `token(colors.stroke)`
11. **Wrap** SVG icons in `<Icon>` where size/color is manually set
12. **Replace** `<SquiggleDivider />` with `<Divider variant="squiggle" />`

**Verification:** The diff should show significant line reduction with zero visual change.

---

## Out of Scope

- Smoke/mist effects (page-specific decoration)
- Vignette radial gradient (page-specific, though uses overlay token)
- Textarea component (only 1 instance, low priority)
- `asChild` + icon slot bug on Button (separate fix)
- Button contrast ratio fix (separate accessibility task)
