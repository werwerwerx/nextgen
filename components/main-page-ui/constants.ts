export const SPACING = {
  gap: "gap-3 md:gap-4",
  gapHead: "gap-2 md:gap-6",
  gapCards: "gap-2 md:gap-3 lg:gap-4",
  gapSemantic: "gap-8 md:gap-12 lg:gap-16",
  gapSection: "gap-14 md:gap-20 lg:gap-28",
  spaceY: "space-y-8 md:space-y-12 lg:space-y-16",
  padding: "p-6 md:p-8 lg:p-12",
  paddingCard: "p-6 md:p-8",
  marginContainer: "px-4 py-8 md:py-16"
} as const

export const ANIMATIONS = {
  hover: "hover:bg-accent/5 transition-all duration-200",
  hoverScale: "hover:scale-105 transition-all duration-200",
  transition: "transition-all duration-200"
} as const

export const LAYOUT = {
  container: "container mx-auto max-w-6xl",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gridTwo: "grid grid-cols-1 md:grid-cols-2",
  flexCenter: "flex items-center justify-center",
  flexStart: "flex items-start",
  flexCol: "flex flex-col"
} as const

export const CARDS = {
  base: "bg-card border-border border",
  hover: "bg-card hover:bg-accent/5 transition-all duration-200 border-border",
  content: "p-6 md:p-8"
} as const 