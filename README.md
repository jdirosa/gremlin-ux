# Gremlin UI

A design system that grins at you with too many teeth.

Dark rubber hose aesthetic. Airtight engineering. The cheerful cartoon that's been possessed.

## Install

```bash
npm install @gremlin-ui/react
```

## Quick Start

```tsx
import { Button, TextInput, FormField, Modal, Autocomplete } from "@gremlin-ui/react";

function App() {
  return (
    <FormField label="Email" required>
      <TextInput type="email" placeholder="you@somewhere.com" />
    </FormField>
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

## License

MIT
