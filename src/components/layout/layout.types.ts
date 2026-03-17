/** Semantic spacing scale for component APIs */
export type SpaceScale = "none" | "xs" | "sm" | "md" | "lg" | "xl";

/** @internal Maps semantic names to Panda spacing tokens */
export const spaceMap = {
  none: "0",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
} as const;
export type RadiiToken = "sm" | "md" | "lg" | "xl" | "full";
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";
