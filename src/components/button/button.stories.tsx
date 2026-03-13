import type { Meta, StoryObj } from "@storybook/react";
import { Button, IconButton } from "./index";

// ── Simple icon SVGs for demos ───────────────────────────────────────

function MailIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

// ── Meta ──────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button (uses aria-disabled)",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────

/** The default solid button — cherry red with thick ink borders. */
export const Solid: Story = {
  args: {
    variant: "solid",
    children: "Get in touch",
  },
};

/** Outline variant — accent-colored border with transparent fill. */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Learn more",
  },
};

/** Ghost variant — minimal, with ink border. The quietest option. */
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Cancel",
  },
};

/** All three variants side by side. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

/** All three sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/** Loading state — spinner replaces content, button "breathes" with a pulse. */
export const Loading: Story = {
  args: {
    loading: true,
    children: "Submit",
  },
};

/** Loading state with text. */
export const LoadingWithText: Story = {
  args: {
    loading: true,
    loadingText: "Sending...",
    children: "Submit",
  },
};

/** Disabled state — reduced opacity, not clickable, but still focusable. */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Can't touch this",
  },
};

/** Button with left icon. */
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <MailIcon />,
    children: "Send email",
  },
};

/** Button with right icon. */
export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRightIcon />,
    children: "Next step",
  },
};

/** Button with icons on both sides. */
export const WithBothIcons: Story = {
  args: {
    leftIcon: <HeartIcon />,
    rightIcon: <ArrowRightIcon />,
    children: "Favorite",
  },
};

/** IconButton requires aria-label at the type level — you cannot create one without it. */
export const IconButtonStory: Story = {
  name: "IconButton",
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <IconButton aria-label="Close dialog" variant="ghost" size="sm">
        <XIcon />
      </IconButton>
      <IconButton aria-label="Close dialog" variant="ghost" size="md">
        <XIcon />
      </IconButton>
      <IconButton aria-label="Favorite" variant="outline" size="md">
        <HeartIcon />
      </IconButton>
      <IconButton aria-label="Send" variant="solid" size="lg">
        <MailIcon />
      </IconButton>
    </div>
  ),
};

/** Polymorphic — render as an anchor via asChild. */
export const AsLink: Story = {
  render: () => (
    <Button variant="ghost" asChild>
      <a href="https://github.com/jdirosa/gremlin-ui">View the source</a>
    </Button>
  ),
};

/** All variants in all sizes — the full matrix. */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {(["solid", "outline", "ghost"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ width: "60px", color: "#B8B2A8", fontSize: "0.875rem" }}>{variant}</span>
          <Button variant={variant} size="sm">Small</Button>
          <Button variant={variant} size="md">Medium</Button>
          <Button variant={variant} size="lg">Large</Button>
        </div>
      ))}
    </div>
  ),
};
