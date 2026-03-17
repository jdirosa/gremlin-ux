// ── Theme ─────────────────────────────────────────────────────────────
export { ThemeProvider, useColorMode } from "./theme-provider";
export type { ColorMode, ThemeProviderProps } from "./theme-provider";

// ── Components ────────────────────────────────────────────────────────
export { Button, IconButton } from "./components/button";
export type { ButtonProps, IconButtonProps } from "./components/button";

export { TextInput } from "./components/text-input";
export type { TextInputProps } from "./components/text-input";

export { FormField } from "./components/form-field";
export type { FormFieldProps } from "./components/form-field";

export { Modal } from "./components/modal";
export type {
  ModalProps,
  ModalTriggerProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseProps,
  ModalSize,
} from "./components/modal";

export { ToastProvider, useToast } from "./components/toast";
export type { ToastOptions, ToastPosition, ToastProviderProps } from "./components/toast";

export { Autocomplete } from "./components/autocomplete";
export type {
  AutocompleteProps,
  AutocompleteTriggerProps,
  AutocompleteContentProps,
  AutocompleteInputProps,
  AutocompleteListProps,
  AutocompleteItemProps,
  AutocompleteTagListProps,
  AutocompleteTagProps,
  AutocompleteClearAllProps,
  AutocompleteGroupProps,
  AutocompleteGroupLabelProps,
  AutocompleteSeparatorProps,
  AutocompleteEmptyProps,
  AutocompleteCreateProps,
} from "./components/autocomplete";

export { Section } from "./components/section";
export type { SectionProps } from "./components/section";

export { ParallaxLayout } from "./components/parallax-layout";
export type { ParallaxLayoutProps } from "./components/parallax-layout";

export { Card } from "./components/card";
export type { CardProps } from "./components/card";

export { Badge } from "./components/badge";
export type { BadgeProps } from "./components/badge";

export { Icon } from "./components/icon";
export type { IconProps } from "./components/icon";

export { Divider } from "./components/divider";
export type { DividerProps } from "./components/divider";

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

export { Animate } from "./components/animate";
export type { AnimateProps } from "./components/animate";

// ── Layout ───────────────────────────────────────────────────────────
export { Box, Stack, HStack, Grid, Container, Text, Heading } from "./components/layout";
export type { BoxProps, StackProps, HStackProps, GridProps, ContainerProps, TextProps, HeadingProps, SpaceScale, RadiiToken, ContainerSize } from "./components/layout";

// ── Recipes ───────────────────────────────────────────────────────────
export { entranceRecipe } from "./recipes";
export type { EntranceVariantProps } from "./recipes";

export { sectionRecipe, type SectionVariantProps } from "./components/section";
export { cardRecipe, type CardVariantProps } from "./components/card";
export { badgeRecipe, type BadgeVariantProps } from "./components/badge";
export { iconRecipe, type IconVariantProps } from "./components/icon";
export { dividerRecipe, type DividerVariantProps } from "./components/divider";
export { headingRecipe, type HeadingVariantProps } from "./components/layout/heading.recipe";
export { highlightRecipe, type HighlightVariantProps } from "./components/highlight";
export { codeBlockRecipe, type CodeBlockVariantProps } from "./components/code-block";
export { textareaRecipe, type TextareaVariantProps } from "./components/textarea";

// ── Tokens ───────────────────────────────────────────────────────────
export { token } from "./tokens";
export type { Token } from "./tokens";

// ── Hooks ─────────────────────────────────────────────────────────────
export { useFormFieldContext, useControllableState } from "./hooks";
export type { FormFieldContextValue } from "./hooks";
