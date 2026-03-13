import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./index";
import { TextInput } from "../text-input";

// ── Simple icon SVGs for demos ───────────────────────────────────────

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
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "360px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the input",
    },
    description: {
      control: "text",
      description: "Optional helper text below the label",
    },
    error: {
      control: "text",
      description: "Error message — triggers invalid state when set",
    },
    required: {
      control: "boolean",
      description: "Shows required asterisk",
    },
    disabled: {
      control: "boolean",
      description: "Disables the field (via aria-disabled)",
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────

/** Basic FormField with a label and text input. */
export const Default: Story = {
  args: {
    label: "Full name",
    children: <TextInput placeholder="James DiRosa" />,
  },
};

/** FormField with a required indicator — the cherry red asterisk pops in. */
export const Required: Story = {
  args: {
    label: "Email address",
    required: true,
    children: <TextInput type="email" placeholder="you@company.com" leftElement={<MailIcon />} />,
  },
};

/** FormField with description text below the label. */
export const WithDescription: Story = {
  args: {
    label: "Password",
    description: "Must be at least 8 characters with one number.",
    required: true,
    children: <TextInput type="password" leftElement={<LockIcon />} />,
  },
};

/** FormField in an error state — the error message slides in with a rubber bounce. */
export const WithError: Story = {
  args: {
    label: "Email address",
    required: true,
    error: "Please enter a valid email address.",
    children: <TextInput type="email" placeholder="you@company.com" leftElement={<MailIcon />} />,
  },
};

/** FormField with description AND error — both are wired to aria-describedby. */
export const WithDescriptionAndError: Story = {
  args: {
    label: "Password",
    description: "Must be at least 8 characters with one number.",
    error: "Password is too short.",
    required: true,
    children: <TextInput type="password" leftElement={<LockIcon />} />,
  },
};

/** Disabled FormField — child input inherits disabled state via context. */
export const Disabled: Story = {
  args: {
    label: "Company",
    disabled: true,
    children: <TextInput placeholder="Acme Corp" value="Ashby" />,
  },
};

/** Interactive demo — toggle error state to see the animated error reveal. */
export const InteractiveValidation: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [touched, setTouched] = useState(false);

    const error =
      touched && value.length === 0
        ? "This field is required."
        : touched && value.length < 3
          ? "Name must be at least 3 characters."
          : undefined;

    return (
      <FormField label="Your name" required error={error}>
        <TextInput
          placeholder="Enter your name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
        />
      </FormField>
    );
  },
};

/** Multiple FormFields stacked — a mini form layout. */
export const FormLayout: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <FormField label="Full name" required>
        <TextInput placeholder="James DiRosa" />
      </FormField>
      <FormField label="Email" required error="Please enter a valid email.">
        <TextInput type="email" placeholder="you@company.com" leftElement={<MailIcon />} />
      </FormField>
      <FormField label="Password" description="Must be at least 8 characters." required>
        <TextInput type="password" leftElement={<LockIcon />} />
      </FormField>
      <FormField label="Company" description="Optional — we'll use this to personalize your experience.">
        <TextInput placeholder="Acme Corp" />
      </FormField>
    </div>
  ),
};
