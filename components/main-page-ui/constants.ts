export const SPACING = {
  gap: "gap-3 md:gap-4",
  gapHead: "gap-4 md:gap-6",
  gapCards: "gap-4 md:gap-3 lg:gap-4",
  gapSemantic: "gap-8 md:gap-12 lg:gap-16",
  gapSection: "gap-[120px] md:gap-[120px] lg:gap-[200px]",
} as const

export const ANIMATIONS = {
  hover: "hover:bg-accent/5 transition-all duration-200",
  hoverScale: "hover:scale-105 transition-all duration-200",
  transition: "transition-all duration-200"
} as const

export const LAYOUT = {
  container: "container !p-1 sm:!p-2 md:!p-4 lg:!p-6 mx-auto max-w-6xl",
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