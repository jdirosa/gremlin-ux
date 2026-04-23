# Gremlin UI

A rubber hosed theme, creep design system

## Install

```bash
npm install @gremlin-ui/react
```

## Quick Start

```tsx
import { Button, TextInput, FormField, Stack, Container, Text, Heading } from "@gremlin-ui/react";

function App() {
  return (
    <Container maxWidth="lg">
      <Stack gap="6">
        <Heading level={1} size="2xl">Get in Touch</Heading>
        <Text color="muted">We'd love to hear from you.</Text>
        <FormField label="Email" required>
          <TextInput type="email" placeholder="you@somewhere.com" />
        </FormField>
        <Button variant="solid">Submit</Button>
      </Stack>
    </Container>
  );
}
```

## Components

| Tier | Component | Description |
|------|-----------|-------------|
| Atom | **Button** | Squash-and-stretch on every interaction. Variants: solid, outline, ghost, link. |
| Atom | **TextInput** | Addon/element slots, FormField context integration, cherry-red focus rings. |
| Molecule | **FormField** | Context-based a11y wiring, animated error reveal with bounce. |
| Molecule | **Modal** | Focus trap, portal, scroll lock, compound API, rubber-bounce entrance. |
| Molecule | **Toast** | Stacking notifications with position control and auto-dismiss. |
| Organism | **Autocomplete** | Multi-select, keyboard nav, Floating UI positioning, grouped items. |

## Layout & Typography

| Component | Description |
|-----------|-------------|
| **Box** | Generic container with padding and borderRadius props. |
| **Stack** | Vertical flex layout with gap. |
| **HStack** | Horizontal flex layout with gap and wrap. |
| **Grid** | CSS grid with columns prop. |
| **Container** | Max-width centered container (sm/md/lg/xl/full). |
| **Text** | Typography component. Renders `<p>` by default, `as="span"` for inline. |
| **Heading** | Heading component (h1–h6) with heading font. |

## Themes

Three built-in themes swap at the semantic token layer:

- **Dark** (default) — Charcoal with a bruise. Cream text, cherry red accents.
- **Parchment** — Warm, aged paper. Deep reds and earth tones.
- **White** — Clean zinc. Professional without losing personality.

## Tech Stack

- **Panda CSS** — Zero-runtime, type-safe tokens and variants
- **React 19** — Latest concurrent features
- **TypeScript** — Strict mode, always
- **Radix Slot** — `asChild` polymorphism
- **Floating UI** — Autocomplete positioning

## AI-Native

Ships with machine-readable API reference (`gremlin-ui-api.yaml`) and Cursor/Claude rules so AI assistants generate design-system-compliant code on the first try.

## Scaling Roadmap: What I'd Improve

This was a weekend project, so I cut some corners to ship fast. Here's what I'd improve to make this production-ready for multi-team adoption.

### Semantic spacing tokens

The token system has a strong semantic layer for color (`bg.surface`, `fg.muted`, `accent`) but spacing is still raw primitives (`4`, `6`, `8`). A spacing scale of 13 values gives engineers too many choices and no guidance on *which* to use.

The fix: add a semantic spacing layer organized by **spatial intent**:

| Intent | What it answers | Example tokens |
|--------|----------------|----------------|
| **Inset** | "How much padding inside this container?" | `spacing.inset.sm/md/lg` |
| **Gap** | "How much space between these siblings?" | `spacing.gap.sm/md/lg` |
| **Stack** | "How much breathing room between sections?" | `spacing.stack.sm/md/lg` |

Raw primitives (`spacing.4`) remain as the foundation, but components should reference semantic spacing. The question becomes "am I padding, gapping, or separating?" and each has 3 clear answers instead of 13 ambiguous ones.

### Token naming: expressiveness over ordinality

Background tokens use expressive names (`canvas`, `surface`, `subtle`, `muted`, `emphasis`) rather than numbered tiers (`raised1`, `raised2`...). This is a deliberate tradeoff.

Numbered names are instantly orderable but meaningless. Engineers grab the highest number when they want visibility. Same problem as `z-index: 99999`. Expressive names carry intent and create a moment of self-regulation. Seeing `emphasis` makes you ask "is this actually important?" The downside: new engineers can't infer the ordering from the name alone.

The hierarchy, from least to most prominent: **canvas** (the page) → **surface** (cards, modals) → **subtle** (nested regions) → **muted** (interactive areas) → **emphasis** (selected/active). Think of it as a lake: canvas is the lakebed, surface is the waterline, subtle is the boat, muted is the cargo, emphasis is the flag it flies.

### Component tokens: not yet, and that's intentional

Right now, components reference semantic tokens directly (`bg: "accent"` in the Button recipe). There's no component token layer (`button.bg.solid`) sitting in between. For a single-consumer project, that's the right call. Adding indirection you don't need yet is just noise.

Where this matters is multi-team adoption. If a checkout team needs blue buttons while everything else stays red, you can't just remap `accent` without breaking inputs, links, and focus rings. A component token layer lets individual teams remap `button.bg.solid` in their context without touching the global theme. I'd add this layer when a second consuming team shows up. Not before.

### Contrast validation at the semantic layer

The solid button puts cream text (`#FFF8E7`) on cherry red (`#FF4D6A`), which lands at 3.04:1 contrast. That fails WCAG AA for normal text (4.5:1). It passes the large text threshold (3:1), and button labels are short and bold, so it's defensible. But it's a gap I'd close properly at scale.

The key insight: contrast needs to be validated at the *semantic* layer, not the primitive layer. Primitives are just a palette of available colors. Semantic tokens are where you pair foreground with background, and that pairing is where contrast either passes or fails. A production system should have automated contrast checks that run against every semantic fg/bg combination, across all themes, as part of CI.

### Type scale: move from linear to modular

The current font size scale grows linearly (+2px per step), which creates uneven *perceived* jumps. 2px is a big difference at 12px (16%) but barely noticeable at 20px (10%). Headings end up feeling too close together while small text sizes feel too spread out.

A modular scale (each step multiplied by a consistent ratio like 1.25x) keeps perceived differences even across the range. Most mature systems start with a modular scale and nudge from there. I'd rebuild the type scale around a 1.25x ratio from a 16px base, then adjust any steps that don't land on clean values.

## License

MIT
