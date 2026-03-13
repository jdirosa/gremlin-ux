import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./index";

// ── Simple icon SVGs for demos ───────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ── Meta ──────────────────────────────────────────────────────────────

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the input",
    },
    error: {
      control: "boolean",
      description: "Whether the input is in an error state",
    },
    disabled: {
      control: "boolean",
      description: "Disable the input (uses aria-disabled)",
    },
    readOnly: {
      control: "boolean",
      description: "Make the input read-only",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "320px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────

/** Default text input. */
export const Default: Story = {
  args: {
    placeholder: "Enter your name",
  },
};

/** All three sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <TextInput size="sm" placeholder="Small" />
      <TextInput size="md" placeholder="Medium" />
      <TextInput size="lg" placeholder="Large" />
    </div>
  ),
};

/** Error state — red border with shake animation. */
export const Error: Story = {
  args: {
    error: true,
    placeholder: "Something went wrong",
    defaultValue: "invalid@",
  },
};

/** Disabled state — reduced opacity, focusable but not editable. */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Can't edit this",
  },
};

/** Read-only — muted background, value visible but not editable. */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "Read-only value",
  },
};

/** With a search icon on the left. */
export const WithLeftElement: Story = {
  args: {
    leftElement: <SearchIcon />,
    placeholder: "Search...",
  },
};

/** With an icon on the right. */
export const WithRightElement: Story = {
  args: {
    rightElement: <LockIcon />,
    placeholder: "Password",
    type: "password",
  },
};

/** With elements on both sides. */
export const WithBothElements: Story = {
  args: {
    leftElement: <MailIcon />,
    rightElement: <SearchIcon />,
    placeholder: "Search emails...",
  },
};

/** With a left addon (e.g., protocol prefix). */
export const WithLeftAddon: Story = {
  args: {
    leftAddon: "https://",
    placeholder: "example.com",
  },
};

/** With a right addon (e.g., domain suffix). */
export const WithRightAddon: Story = {
  args: {
    rightAddon: ".com",
    placeholder: "mysite",
  },
};

/** With addons on both sides. */
export const WithBothAddons: Story = {
  args: {
    leftAddon: "https://",
    rightAddon: ".com",
    placeholder: "example",
  },
};

/** Full matrix — sizes × states. */
export const FullMatrix: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ color: "#B8B2A8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{size}</span>
          <TextInput size={size} placeholder="Default" />
          <TextInput size={size} placeholder="With icon" leftElement={<SearchIcon />} />
          <TextInput size={size} error defaultValue="Error state" />
          <TextInput size={size} disabled defaultValue="Disabled" />
          <TextInput size={size} readOnly defaultValue="Read-only" />
        </div>
      ))}
    </div>
  ),
};
