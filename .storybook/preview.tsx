import type { Preview } from "@storybook/react";
import type { ReactRenderer } from "@storybook/react";
import type { DecoratorFunction } from "@storybook/csf";
import React, { useEffect } from "react";
import "../src/index.css";

const BACKGROUNDS = {
  dark: "#0A0A0B",
  light: "#FBF3E0",
  white: "#FFFFFF",
} as const;

const FOREGROUNDS = {
  dark: "#FFF8E7",
  light: "#1A1610",
  white: "#18181B",
} as const;

// Decorator that sets data-color-mode and syncs the story background
const withGremlinTheme: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const colorMode = (context.globals.colorMode || "dark") as keyof typeof BACKGROUNDS;

  // Set background on the document body so it fills the entire canvas
  useEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = BACKGROUNDS[colorMode];
    document.body.style.backgroundColor = BACKGROUNDS[colorMode];
  }, [colorMode]);

  return (
    <div
      data-color-mode={colorMode}
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: BACKGROUNDS[colorMode],
        color: FOREGROUNDS[colorMode],
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {},
  },
  globalTypes: {
    colorMode: {
      description: "Color mode for components",
      toolbar: {
        title: "Color Mode",
        icon: "moon",
        items: [
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "light", title: "Light", icon: "sun" },
          { value: "white", title: "White", icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorMode: "dark",
  },
  decorators: [withGremlinTheme],
};

export default preview;
