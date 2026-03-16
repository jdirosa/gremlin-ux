# Zero-CSS Design System Gaps Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every design system gap that forces the landing page to use `css()` calls, so consuming code has zero custom styling.

**Architecture:** Enhance existing components with missing props (spacing, alignment, textShadow), add 5 new components (SectionHeader, IconBox, Highlight, CodeBlock, Textarea, Quote), and extend Grid/Card APIs. All follow existing patterns: recipe files + forwardRef + Slot + cx.

**Tech Stack:** React 19, Panda CSS (cva recipes), TypeScript strict, Vitest + RTL.

**Principle:** The landing page is the proof the design system works. Every `css()` call on the landing page is a bug in the design system.

---

## File Map

### Modified files
- `src/components/layout/heading.tsx` -- add spacing, textShadow props
- `src/components/layout/heading.recipe.ts` -- add textShadow variant
- `src/components/layout/text.tsx` -- add spacing, maxWidth, center props
- `src/components/layout/grid.tsx` -- add responsive `cols` prop
- `src/components/card/card.tsx` -- add align, fullHeight, title props
- `src/components/card/card.recipe.ts` -- add align, fullHeight variants
- `src/components/icon/icon.tsx` -- add boxed variant props
- `src/components/icon/icon.recipe.ts` -- add boxed variant
- `src/components/badge/badge.tsx` -- add spacing props
- `src/index.ts` -- export new components
- `src/preset.ts` -- no changes needed (tokens already there)

### New files
- `src/components/section-header/section-header.tsx`
- `src/components/section-header/index.ts`
- `src/components/highlight/highlight.tsx`
- `src/components/highlight/highlight.recipe.ts`
- `src/components/highlight/index.ts`
- `src/components/code-block/code-block.tsx`
- `src/components/code-block/code-block.recipe.ts`
- `src/components/code-block/index.ts`
- `src/components/textarea/textarea.tsx`
- `src/components/textarea/textarea.recipe.ts`
- `src/components/textarea/index.ts`
- `src/components/quote/quote.tsx`
- `src/components/quote/quote.recipe.ts`
- `src/components/quote/index.ts`

---

## Chunk 1: Spacing props on primitives

The #1 source of css() calls. Add `mb`, `mt`, `mx`, `ml`, `mr` props to Heading, Text, and Badge. These map directly to Panda CSS spacing tokens.

### Task 1: Add spacing props to Heading

**Files:**
- Modify: `src/components/layout/heading.tsx`

- [ ] **Step 1: Add spacing props to HeadingProps interface**

Add these optional props after `asChild`:

```ts
mb?: SpacingToken;
mt?: SpacingToken;
mx?: SpacingToken;
```

Import `SpacingToken` from the layout types (already used by Box).

- [ ] **Step 2: Add textShadow prop**

Add to HeadingProps:

```ts
textShadow?: "textGlow";
```

- [ ] **Step 3: Update the inline css() to include spacing and textShadow**

In the component body, spread the spacing props into the inline css object:

```ts
const inlineClass = css({
  color: colorMap[color],
  ...(align != null && { textAlign: align }),
  ...(mb != null && { mb }),
  ...(mt != null && { mt }),
  ...(mx != null && { mx }),
  ...(textShadow != null && { textShadow }),
});
```

- [ ] **Step 4: Destructure the new props from the component args**

Update the destructuring to include `mb, mt, mx, textShadow` and exclude them from `...rest`.

- [ ] **Step 5: Verify compilation**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/layout/heading.tsx && git commit -m "feat(Heading): add spacing and textShadow props"
```

### Task 2: Add spacing and layout props to Text

**Files:**
- Modify: `src/components/layout/text.tsx`

- [ ] **Step 1: Add spacing and layout props to TextProps**

```ts
mb?: SpacingToken;
mt?: SpacingToken;
mx?: SpacingToken;
maxWidth?: "prose" | "proseNarrow" | string;
center?: boolean;  // shorthand for textAlign center + mx auto
```

- [ ] **Step 2: Update the inline css() object**

```ts
...(mb != null && { mb }),
...(mt != null && { mt }),
...(mx != null && { mx }),
...(maxWidth != null && { maxWidth }),
...(center && { textAlign: "center", mx: "auto" }),
```

Note: explicit `mx` overrides `center`'s `mx: "auto"` if both are provided.

- [ ] **Step 3: Destructure the new props**

- [ ] **Step 4: Verify compilation**

Run: `cd ~/repos/gremlin-ux && npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
cd ~/repos/gremlin-ux && git add src/components/layout/text.tsx && git commit -m "feat(Text): add spacing, maxWidth, and center props"
```

### Task 3: Add spacing props to Badge

**Files:**
- Modify: `src/components/badge/badge.tsx`

- [ ] **Step 1: Add mb prop to BadgeProps**

```ts
mb?: SpacingToken;
```

- [ ] **Step 2: Apply via cx with inline css()**

```ts
const spacingClass = mb != null ? css({ mb }) : undefined;
// In return:
className={cx(recipeClass, spacingClass, className)}
```

- [ ] **Step 3: Verify and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/badge/badge.tsx && git commit -m "feat(Badge): add mb spacing prop"
```

---

## Chunk 2: SectionHeader component

Replaces the 8 identical patterns of centered heading + intro text + spacing.

### Task 4: Create SectionHeader component

**Files:**
- Create: `src/components/section-header/section-header.tsx`
- Create: `src/components/section-header/index.ts`

- [ ] **Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { css, cx } from "@styled-system/css";
import { Heading } from "../layout/heading";
import { Text } from "../layout/text";

export interface SectionHeaderProps extends Omit<ComponentPropsWithoutRef<"div">, "color" | "title"> {
  title: string;
  subtitle?: ReactNode;
  stroke?: boolean;
  glow?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  mb?: "6" | "8" | "10" | "12";
}

const wrapperStyles = css({
  textAlign: "center",
});

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  function SectionHeader(
    { title, subtitle, stroke = true, glow, level = 2, mb = "10", className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx(wrapperStyles, className)} {...rest}>
        <Heading
          level={level}
          size="title"
          stroke={stroke}
          align="center"
          mb="2"
          textShadow={glow ? "textGlow" : undefined}
        >
          {title}
        </Heading>
        {subtitle != null && (
          <Text
            size="lg"
            color="muted"
            align="center"
            lineHeight="relaxed"
            maxWidth="prose"
            center
            mb={mb}
          >
            {subtitle}
          </Text>
        )}
      </div>
    );
  },
);
```

- [ ] **Step 2: Create barrel export**

```ts
export { SectionHeader } from "./section-header";
export type { SectionHeaderProps } from "./section-header";
```

- [ ] **Step 3: Verify and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/section-header/ && git commit -m "feat: add SectionHeader component"
```

---

## Chunk 3: Grid responsive cols prop

### Task 5: Add cols prop to Grid

**Files:**
- Modify: `src/components/layout/grid.tsx`

- [ ] **Step 1: Read the current Grid implementation**

Read `src/components/layout/grid.tsx` to understand current `columns` prop handling.

- [ ] **Step 2: Add responsive `cols` prop**

Add a new prop that accepts responsive values:

```ts
cols?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
```

This is syntactic sugar over `columns`. When `cols` is provided, generate the responsive `gridTemplateColumns`:

```ts
function colsToTemplate(cols: GridProps["cols"]): Record<string, string> | string {
  if (cols == null) return {};
  if (typeof cols === "number") return { gridTemplateColumns: `repeat(${cols}, 1fr)` };
  const result: Record<string, Record<string, string>> = {};
  if (cols.base) result.base = { gridTemplateColumns: `repeat(${cols.base}, 1fr)` };
  if (cols.sm) result.sm = { gridTemplateColumns: `repeat(${cols.sm}, 1fr)` };
  if (cols.md) result.md = { gridTemplateColumns: `repeat(${cols.md}, 1fr)` };
  if (cols.lg) result.lg = { gridTemplateColumns: `repeat(${cols.lg}, 1fr)` };
  if (cols.xl) result.xl = { gridTemplateColumns: `repeat(${cols.xl}, 1fr)` };
  return result;
}
```

Actually, Panda CSS supports responsive values natively. The simpler approach:

```ts
// In the css() object:
...(cols != null && {
  gridTemplateColumns: typeof cols === "number"
    ? `repeat(${cols}, 1fr)`
    : Object.fromEntries(
        Object.entries(cols).map(([bp, n]) => [bp, `repeat(${n}, 1fr)`])
      ),
}),
```

Wait -- Panda CSS responsive syntax uses `{ base: "...", md: "..." }` which is exactly what we'd pass. So if `cols` is `{ base: 1, md: 2 }`, we transform each value to `repeat(N, 1fr)`.

- [ ] **Step 3: Verify and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/layout/grid.tsx && git commit -m "feat(Grid): add responsive cols prop"
```

---

## Chunk 4: Card enhancements

### Task 6: Add align, fullHeight, and title props to Card

**Files:**
- Modify: `src/components/card/card.recipe.ts`
- Modify: `src/components/card/card.tsx`

- [ ] **Step 1: Add variants to card recipe**

Add to the `variants` object in `card.recipe.ts`:

```ts
align: {
  center: { textAlign: "center" },
  left: { textAlign: "left" },
},
fullHeight: {
  true: { height: "100%" },
},
```

- [ ] **Step 2: Add title prop to Card component**

Update `CardProps` in `card.tsx`:

```ts
export interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "color" | "title"> {
  interactive?: CardVariantProps["interactive"];
  tilt?: CardVariantProps["tilt"];
  tiltDirection?: CardVariantProps["tiltDirection"];
  padding?: CardVariantProps["padding"];
  align?: CardVariantProps["align"];
  fullHeight?: CardVariantProps["fullHeight"];
  title?: string;
  asChild?: boolean;
}
```

In the component body, render the title as a Heading inside the card before children:

```tsx
return (
  <Comp ref={ref} className={cx(recipeClass, className)} {...rest}>
    {title != null && <Heading level={4} size="label" mb="1">{title}</Heading>}
    {children}
  </Comp>
);
```

- [ ] **Step 3: Pass new variants to recipe call**

```ts
const recipeClass = cardRecipe({ interactive, tilt, tiltDirection, padding, align, fullHeight });
```

- [ ] **Step 4: Verify and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/card/ && git commit -m "feat(Card): add align, fullHeight, and title props"
```

---

## Chunk 5: IconBox (boxed Icon variant)

### Task 7: Add boxed variant to Icon

**Files:**
- Modify: `src/components/icon/icon.recipe.ts`
- Modify: `src/components/icon/icon.tsx`

The boxed variant renders the icon inside a bordered square container with background. This replaces the hand-built icon box pattern (3 occurrences on the landing page).

- [ ] **Step 1: Add boxed variants to icon recipe**

```ts
boxed: {
  true: {
    borderWidth: "medium",
    borderStyle: "solid",
    borderColor: "border",
    bg: "bg.subtle",
    borderRadius: "md",
  },
},
boxSize: {
  sm: { width: "8", height: "8" },
  md: { width: "10", height: "10" },
  lg: { width: "12", height: "12" },
},
shape: {
  square: { borderRadius: "md" },
  circle: { borderRadius: "full" },
},
```

Update `defaultVariants` to include `boxed: false`.

- [ ] **Step 2: Update IconProps**

```ts
export interface IconProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  size?: IconVariantProps["size"];
  color?: IconVariantProps["color"];
  boxed?: boolean;
  boxSize?: IconVariantProps["boxSize"];
  shape?: IconVariantProps["shape"];
}
```

- [ ] **Step 3: Pass boxed variants to recipe**

```ts
const recipeClass = iconRecipe({ size, color, boxed, boxSize, shape });
```

- [ ] **Step 4: Verify and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/icon/ && git commit -m "feat(Icon): add boxed variant with boxSize and shape"
```

---

## Chunk 6: Highlight component

Inline text background highlight. The `overlay.medium` + padding + border-radius + boxDecorationBreak pattern used 3 times.

### Task 8: Create Highlight component

**Files:**
- Create: `src/components/highlight/highlight.tsx`
- Create: `src/components/highlight/highlight.recipe.ts`
- Create: `src/components/highlight/index.ts`

- [ ] **Step 1: Write the recipe**

```ts
import { cva } from "@styled-system/css";

export type HighlightVariantProps = NonNullable<Parameters<typeof highlightRecipe>[0]>;

export const highlightRecipe = cva({
  base: {
    px: "2",
    py: "1",
    borderRadius: "sm",
    boxDecorationBreak: "clone",
  },
  variants: {
    bg: {
      medium: { bg: "overlay.medium" },
      heavy: { bg: "overlay.heavy" },
      subtle: { bg: "bg.subtle" },
    },
  },
  defaultVariants: { bg: "medium" },
});
```

- [ ] **Step 2: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { highlightRecipe, type HighlightVariantProps } from "./highlight.recipe";

export interface HighlightProps extends ComponentPropsWithoutRef<"span"> {
  bg?: HighlightVariantProps["bg"];
}

export const Highlight = forwardRef<HTMLSpanElement, HighlightProps>(
  function Highlight({ bg, className, ...rest }, ref) {
    const recipeClass = highlightRecipe({ bg });
    return <span ref={ref} className={cx(recipeClass, className)} {...rest} />;
  },
);
```

- [ ] **Step 3: Create barrel and commit**

```ts
export { Highlight } from "./highlight";
export type { HighlightProps } from "./highlight";
export { highlightRecipe, type HighlightVariantProps } from "./highlight.recipe";
```

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/highlight/ && git commit -m "feat: add Highlight component for inline text backgrounds"
```

---

## Chunk 7: CodeBlock component

### Task 9: Create CodeBlock component

**Files:**
- Create: `src/components/code-block/code-block.tsx`
- Create: `src/components/code-block/code-block.recipe.ts`
- Create: `src/components/code-block/index.ts`

- [ ] **Step 1: Write the recipe**

```ts
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
});
```

- [ ] **Step 2: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { codeBlockRecipe } from "./code-block.recipe";

export interface CodeBlockProps extends ComponentPropsWithoutRef<"div"> {
  align?: "left" | "center";
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock({ align, className, ...rest }, ref) {
    const recipeClass = codeBlockRecipe();
    return (
      <div
        ref={ref}
        className={cx(recipeClass, className)}
        style={align === "center" ? { textAlign: "center" } : undefined}
        {...rest}
      />
    );
  },
);
```

- [ ] **Step 3: Create barrel and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/code-block/ && git commit -m "feat: add CodeBlock component"
```

---

## Chunk 8: Textarea component

### Task 10: Create Textarea component

**Files:**
- Create: `src/components/textarea/textarea.tsx`
- Create: `src/components/textarea/textarea.recipe.ts`
- Create: `src/components/textarea/index.ts`

The Textarea follows the same pattern as TextInput -- it consumes FormField context for a11y wiring.

- [ ] **Step 1: Write the recipe**

```ts
import { cva } from "@styled-system/css";

export type TextareaVariantProps = NonNullable<Parameters<typeof textareaRecipe>[0]>;

export const textareaRecipe = cva({
  base: {
    width: "100%",
    bg: "bg.subtle",
    color: "fg",
    fontFamily: "body",
    fontSize: "sm",
    lineHeight: "relaxed",
    borderWidth: "medium",
    borderStyle: "solid",
    borderColor: "border",
    borderRadius: "md",
    px: "4",
    py: "3",
    resize: "vertical",
    outline: "none",
    _focus: {
      borderColor: "border.focus",
      boxShadow: "0 0 0 3px token(colors.accent.subtle)",
    },
    _placeholder: {
      color: "fg.subtle",
    },
    "&[aria-disabled=true]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});
```

- [ ] **Step 2: Write the component**

Follow the TextInput pattern -- consume FormField context for id, aria-describedby, required, disabled.

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { textareaRecipe } from "./textarea.recipe";
import { useFormFieldContext } from "../../hooks/use-form-field";

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "disabled"> {
  disabled?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ disabled, className, id: idProp, ...rest }, ref) {
    const ctx = useFormFieldContext();
    const id = idProp ?? ctx?.id;
    const isDisabled = disabled ?? ctx?.isDisabled ?? false;
    const isRequired = rest["aria-required"] ?? ctx?.isRequired ?? false;
    const describedBy = [rest["aria-describedby"], ctx?.descriptionId, ctx?.errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    const recipeClass = textareaRecipe();

    return (
      <textarea
        ref={ref}
        id={id}
        aria-disabled={isDisabled || undefined}
        aria-required={isRequired || undefined}
        aria-invalid={ctx?.isInvalid || undefined}
        aria-describedby={describedBy}
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);
```

- [ ] **Step 3: Create barrel and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/textarea/ && git commit -m "feat: add Textarea component with FormField context support"
```

---

## Chunk 9: Quote component

### Task 11: Create Quote component

**Files:**
- Create: `src/components/quote/quote.tsx`
- Create: `src/components/quote/quote.recipe.ts`
- Create: `src/components/quote/index.ts`

The Quote renders a testimonial card with large opening quotes, italic text, and an attribution section.

- [ ] **Step 1: Write the recipe**

```ts
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
```

- [ ] **Step 2: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "@styled-system/css";
import { Text } from "../layout/text";
import { HStack } from "../layout/hstack";
import { Stack } from "../layout/stack";
import { Icon } from "../icon/icon";
import { quoteMarkStyles, quoteAttributionStyles } from "./quote.recipe";

export interface QuoteProps extends Omit<ComponentPropsWithoutRef<"blockquote">, "cite"> {
  children: ReactNode;
  author: string;
  source?: string;
  avatar?: ReactNode;
}

export const Quote = forwardRef<HTMLQuoteElement, QuoteProps>(
  function Quote({ children, author, source, avatar, className, ...rest }, ref) {
    return (
      <blockquote ref={ref} className={className} {...rest}>
        <Stack gap="5" justify="between" className={cx(/* fullHeight handled by parent Card */)}>
          <div>
            <div className={quoteMarkStyles()}>&ldquo;</div>
            <Text size="lg" color="default" lineHeight="relaxed" italic>
              {children}
            </Text>
          </div>
          <div className={quoteAttributionStyles()}>
            {avatar != null && avatar}
            <div>
              <Text as="span" size="sm" color="default" weight="semibold">
                {author}
              </Text>
              {source != null && (
                <Text as="span" size="xs" color="subtle">
                  {source}
                </Text>
              )}
            </div>
          </div>
        </Stack>
      </blockquote>
    );
  },
);
```

- [ ] **Step 3: Create barrel and commit**

```bash
cd ~/repos/gremlin-ux && npx tsc --noEmit && git add src/components/quote/ && git commit -m "feat: add Quote component for testimonials"
```

---

## Chunk 10: Barrel exports and build

### Task 12: Update barrel exports

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Add all new exports**

Components section:
```ts
export { SectionHeader } from "./components/section-header";
export type { SectionHeaderProps } from "./components/section-header";
export { Highlight } from "./components/highlight";
export type { HighlightProps } from "./components/highlight";
export { CodeBlock } from "./components/code-block";
export type { CodeBlockProps } from "./components/code-block";
export { Textarea } from "./components/textarea";
export type { TextareaProps } from "./components/textarea";
export { Quote } from "./components/quote";
export type { QuoteProps } from "./components/quote";
```

Recipes section:
```ts
export { highlightRecipe, type HighlightVariantProps } from "./components/highlight";
export { codeBlockRecipe, type CodeBlockVariantProps } from "./components/code-block";
export { textareaRecipe, type TextareaVariantProps } from "./components/textarea";
```

- [ ] **Step 2: Build and verify**

```bash
cd ~/repos/gremlin-ux && npm run build
```

- [ ] **Step 3: Bump version and commit**

```bash
cd ~/repos/gremlin-ux && npm version minor --no-git-tag-version && git add src/index.ts package.json && git commit -m "feat: export new components (SectionHeader, Highlight, CodeBlock, Textarea, Quote)"
```

- [ ] **Step 4: Copy to landing page node_modules**

```bash
cd ~/repos/gremlin-ux && npm run build && cd ~/repos/gremlin-ui && rm -rf node_modules/@gremlin-ui/react && mkdir -p node_modules/@gremlin-ui/react && cp ~/repos/gremlin-ux/package.json node_modules/@gremlin-ui/react/ && cp -r ~/repos/gremlin-ux/dist node_modules/@gremlin-ui/react/ && npx panda codegen --clean
```

---

## Chunk 11: Landing page zero-CSS refactor

### Task 13: Refactor landing page to zero custom CSS

**Files:**
- Modify: `~/repos/gremlin-ui/src/landing-page.tsx`

This is the final task. Read the entire landing page and replace every `css()` call with design system component props. The target is ZERO `css()` calls on design system components.

- [ ] **Step 1: Replace all SectionHeader patterns**

Find every occurrence of:
```tsx
<Heading level={2} align="center" size="title" stroke className={css({ mb: "2" })}>Title</Heading>
<Text size="lg" color="muted" align="center" lineHeight="relaxed" className={css({ maxWidth: "prose", mx: "auto", mb: "10" })}>
  Subtitle text
</Text>
```

Replace with:
```tsx
<SectionHeader title="Title" subtitle="Subtitle text" />
```

For glow variants: `<SectionHeader title="..." subtitle={...} glow />`

- [ ] **Step 2: Replace all Heading css() with props**

`className={css({ mb: "2" })}` becomes `mb="2"`
`className={css({ mb: "1" })}` becomes `mb="1"`
`className={css({ mb: "2", textShadow: "textGlow" })}` becomes `mb="2" textShadow="textGlow"`

- [ ] **Step 3: Replace all Text css() with props**

`className={css({ maxWidth: "prose", mx: "auto", mb: "10" })}` becomes `maxWidth="prose" center mb="10"`

- [ ] **Step 4: Replace Grid css() with cols prop**

`className={css({ gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" } })}` becomes `cols={{ base: 1, md: 2 }}`

`className={css({ gridTemplateColumns: { base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" } })}` becomes `cols={{ base: 2, md: 3, lg: 4 }}`

- [ ] **Step 5: Replace Card css() with props**

`className={css({ textAlign: "center" })}` becomes `align="center"`
`className={css({ height: "100%" })}` becomes `fullHeight`

- [ ] **Step 6: Replace inline Highlight spans**

```tsx
<span className={css({ bg: "overlay.medium", px: "2", py: "1", borderRadius: "sm", boxDecorationBreak: "clone" })}>
```
becomes:
```tsx
<Highlight>
```

- [ ] **Step 7: Replace icon box divs with Icon boxed**

```tsx
<div className={css({ width: "12", height: "12", borderRadius: "md", display: "flex", ... })}>
  <LayersIcon />
</div>
```
becomes:
```tsx
<Icon boxed boxSize="lg" color="accent">
  <LayersIcon />
</Icon>
```

For the testimonial avatar:
```tsx
<Icon boxed boxSize="md" shape="circle" color="muted">
  <SparkleIcon />
</Icon>
```

- [ ] **Step 8: Replace testimonial with Quote**

```tsx
<Quote author="Morticia Addams" source="The Addams Family" avatar={<Icon boxed boxSize="md" shape="circle" color="muted"><SparkleIcon /></Icon>}>
  Normal is an illusion. What is normal for the spider is chaos for the fly.
</Quote>
```

- [ ] **Step 9: Replace textarea with Textarea**

Remove the raw `<textarea>` with inline css() and replace with:
```tsx
<FormField label="Message">
  <Textarea placeholder="What's on your mind?" rows={4} />
</FormField>
```

- [ ] **Step 10: Replace code block with CodeBlock**

```tsx
<CodeBlock align="center">
  npm install{"\n"}@gremlin-ui/react
</CodeBlock>
```

- [ ] **Step 11: Remove css import if no longer needed**

If all `css()` calls are eliminated from design system component usage, remove the `css` import or verify only structural page-level uses remain (Vignette, SmokeEffect positioning -- these are page-specific decorative elements, not design system gaps).

- [ ] **Step 12: Verify build and visual regression**

```bash
cd ~/repos/gremlin-ui && npm run build
```

Open http://localhost:3000/projects/gremlin-ui/ and verify every section matches the pre-refactor appearance.

- [ ] **Step 13: Commit**

```bash
cd ~/repos/gremlin-ui && git add src/landing-page.tsx && git commit -m "refactor: zero-CSS landing page using design system components exclusively"
```

### Task 14: Audit remaining css() calls

- [ ] **Step 1: Count remaining css() calls**

```bash
grep -c "css({" ~/repos/gremlin-ui/src/landing-page.tsx
```

The ONLY acceptable remaining `css()` calls are:
- Vignette overlay (position: fixed, decorative)
- SmokeEffect container (position: absolute, decorative)
- Page-level layout wrappers (overflowX: hidden on root)
- The transparent section wrappers (px/py + Container with maxWidth 1080px) for sections that need transparent backgrounds over the scroll-frames

Everything else should be zero.

- [ ] **Step 2: Document any remaining gaps**

If any `css()` calls remain on design system components, log them as future work.

- [ ] **Step 3: Final commit**

```bash
cd ~/repos/gremlin-ui && git add -A && git commit -m "chore: audit complete, document remaining structural css"
```
