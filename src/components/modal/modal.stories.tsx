import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@styled-system/css";
import { Modal } from "./index";
import { Button } from "../button";
import { TextInput } from "../text-input";
import { FormField } from "../form-field";

// ── Meta ──────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────

/** Basic modal with header, body, and footer. Opens from a trigger button. */
export const Basic: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="solid">Open Modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Something emerges</Modal.Header>
        <Modal.Body>
          <p>
            The modal oozes in from the dark with a heavy rubber bounce.
            Click the backdrop or press Escape to dismiss it. Focus is
            trapped inside — Tab and Shift+Tab cycle through the
            interactive elements.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Modal.Close>
          <Button variant="solid">Confirm</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

/** Modal with form content — TextInputs inside FormFields. The real composition test. */
export const WithForm: Story = {
  render: function WithFormStory() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Modal>
        <Modal.Trigger asChild>
          <Button variant="solid" size="lg">
            Get in touch
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>Let's talk</Modal.Header>
          <Modal.Body>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "4",
              })}
            >
              <FormField label="Name" required>
                <TextInput placeholder="Your name" />
              </FormField>
              <FormField label="Email" required>
                <TextInput type="email" placeholder="you@company.com" />
              </FormField>
              <FormField
                label="Message"
                description="Tell us what you're working on"
              >
                <TextInput placeholder="I'm building a design system..." />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Modal.Close>
            <Button variant="solid" loading={loading} onClick={handleSubmit}>
              Send
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    );
  },
};

/** Scrolling body content — demonstrates overflow handling inside the modal. */
export const ScrollingContent: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="outline">Open Long Modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Terms & conditions</Modal.Header>
        <Modal.Body>
          {Array.from({ length: 20 }, (_, i) => (
            <p
              key={i}
              className={css({
                color: "fg.muted",
                fontSize: "sm",
                lineHeight: "relaxed",
                mb: "3",
              })}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="ghost">Decline</Button>
          </Modal.Close>
          <Button variant="solid">Accept</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

/** Controlled mode — parent owns the open state. */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);

    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4",
        })}
      >
        <p
          className={css({
            color: "fg.muted",
            fontSize: "sm",
            fontFamily: "body",
          })}
        >
          Modal is {open ? "open" : "closed"} (controlled)
        </p>
        <Button variant="solid" onClick={() => setOpen(true)}>
          Open Controlled Modal
        </Button>
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Content>
            <Modal.Header>Controlled modal</Modal.Header>
            <Modal.Body>
              <p>
                This modal's open state is controlled by the parent component.
                No Modal.Trigger needed — the parent calls{" "}
                <code
                  className={css({ fontFamily: "mono", color: "accent" })}
                >
                  setOpen(true)
                </code>{" "}
                directly.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close asChild>
                <Button variant="ghost">Close</Button>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </div>
    );
  },
};

/** Header-only modal — minimal configuration with just a header and close button. */
export const Minimal: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="ghost">Quick dialog</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Body>
          <p>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="ghost">No, go back</Button>
          </Modal.Close>
          <Button variant="solid">Yes, delete</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};
