import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@styled-system/css";
import { Box } from "./box";
import { Stack } from "./stack";
import { HStack } from "./hstack";
import { Grid } from "./grid";
import { Container } from "./container";

// ── Helpers ──────────────────────────────────────────────────────────

const card = css({
  bg: "bg.surface",
  borderWidth: "medium",
  borderStyle: "solid",
  borderColor: "border",
  borderRadius: "md",
  p: "4",
  color: "fg",
  fontFamily: "body",
  fontSize: "sm",
});

// ── Box ──────────────────────────────────────────────────────────────

const boxMeta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
};

export default boxMeta;
type BoxStory = StoryObj<typeof Box>;

export const BasicBox: BoxStory = {
  render: () => (
    <Box padding="6" borderRadius="lg" className={css({ bg: "bg.surface", color: "fg", fontFamily: "body" })}>
      A Box with padding and border radius
    </Box>
  ),
};

// ── Stack ────────────────────────────────────────────────────────────

export const VerticalStack: StoryObj<typeof Stack> = {
  render: () => (
    <Stack gap="4">
      <div className={card}>First item</div>
      <div className={card}>Second item</div>
      <div className={card}>Third item</div>
    </Stack>
  ),
};

export const StackCentered: StoryObj<typeof Stack> = {
  render: () => (
    <Stack gap="4" align="center">
      <div className={card} style={{ width: 200 }}>Narrow</div>
      <div className={card} style={{ width: 300 }}>Medium</div>
      <div className={card} style={{ width: 150 }}>Narrower</div>
    </Stack>
  ),
};

// ── HStack ───────────────────────────────────────────────────────────

export const HorizontalStack: StoryObj<typeof HStack> = {
  render: () => (
    <HStack gap="4" align="center">
      <div className={card}>Left</div>
      <div className={card}>Center</div>
      <div className={card}>Right</div>
    </HStack>
  ),
};

export const HStackSpaceBetween: StoryObj<typeof HStack> = {
  render: () => (
    <HStack justify="between" align="center">
      <div className={card}>Logo</div>
      <HStack gap="3">
        <div className={card}>Link 1</div>
        <div className={card}>Link 2</div>
        <div className={card}>Link 3</div>
      </HStack>
    </HStack>
  ),
};

export const HStackWrapping: StoryObj<typeof HStack> = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <HStack gap="3" wrap>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={card}>Item {i + 1}</div>
        ))}
      </HStack>
    </div>
  ),
};

// ── Grid ─────────────────────────────────────────────────────────────

export const GridLayout: StoryObj<typeof Grid> = {
  render: () => (
    <Grid columns={3} gap="4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={card}>Cell {i + 1}</div>
      ))}
    </Grid>
  ),
};

export const GridTwoColumns: StoryObj<typeof Grid> = {
  render: () => (
    <Grid columns={2} gap="6">
      <div className={card}>Left column with more content to show the grid stretching.</div>
      <div className={card}>Right column</div>
    </Grid>
  ),
};

// ── Container ────────────────────────────────────────────────────────

export const ContainerSizes: StoryObj<typeof Container> = {
  render: () => (
    <Stack gap="4">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Container key={size} maxWidth={size}>
          <div className={card}>Container maxWidth="{size}"</div>
        </Container>
      ))}
    </Stack>
  ),
};

// ── Composition ──────────────────────────────────────────────────────

export const PageLayout: StoryObj = {
  render: () => (
    <Container maxWidth="lg">
      <Stack gap="8">
        <HStack justify="between" align="center">
          <div className={css({ color: "fg", fontSize: "xl" })}>Gremlin UI</div>
          <HStack gap="3">
            <div className={css({ color: "fg.muted", fontFamily: "body", fontSize: "sm" })}>Docs</div>
            <div className={css({ color: "fg.muted", fontFamily: "body", fontSize: "sm" })}>Components</div>
            <div className={css({ color: "fg.muted", fontFamily: "body", fontSize: "sm" })}>GitHub</div>
          </HStack>
        </HStack>
        <Stack gap="2" align="center">
          <h1 className={css({ color: "fg", fontSize: "2xl" })}>Welcome</h1>
          <p className={css({ color: "fg.muted", fontFamily: "body" })}>A composed page layout</p>
        </Stack>
        <Grid columns={3} gap="4">
          <Box padding="5" borderRadius="md" className={css({ bg: "bg.surface", color: "fg", fontFamily: "body" })}>Feature 1</Box>
          <Box padding="5" borderRadius="md" className={css({ bg: "bg.surface", color: "fg", fontFamily: "body" })}>Feature 2</Box>
          <Box padding="5" borderRadius="md" className={css({ bg: "bg.surface", color: "fg", fontFamily: "body" })}>Feature 3</Box>
        </Grid>
      </Stack>
    </Container>
  ),
};
