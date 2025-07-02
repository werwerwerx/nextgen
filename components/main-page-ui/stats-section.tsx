import { GradientSectionHeading, GradientLargeHeading, Subtitle, MainHeading } from "@/components/ui/typography"
import { SPACING, CARDS } from "@/components/main-page-ui/constants"
import { CONENT_RESOURCES } from "@/components/main-page-ui/content-resources"
import { cn } from "@/lib/utils"

// Individual components for easier style refactoring
const StatCard = ({ stat, isLarge = false }: { stat: { value: string; label: string; comment: string }, isLarge?: boolean }) => (
  <div className={cn(
    "rounded-xl flex flex-col justify-end items-start transition-all duration-300 aspect-[2/1] w-full",
    isLarge && "md:aspect-[1/1]",
    !isLarge && "md:aspect-[2/1]",
    CARDS.base,
    CARDS.hover,
    CARDS.content
  )}>
    <div className={`flex flex-col ${SPACING.gap}`}>
      <div className={`flex flex-col gap-3 md:gap-6`}>
        <StatValue value={stat.value} />
        <StatLabel label={stat.label} />
      </div>
      <StatComment comment={stat.comment} />
    </div>
  </div>
)

const StatsGrid = () => (
  <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4">
    {/* Left column - first two stats stacked */}
    <div className="flex flex-col gap-3 md:gap-4">
      <StatCard stat={CONENT_RESOURCES.stats_block.stats[0]} />
      <StatCard stat={CONENT_RESOURCES.stats_block.stats[1]} />
    </div>
    
    {/* Right column - large third stat */}
    <div className="flex">
      <StatCard stat={CONENT_RESOURCES.stats_block.stats[2]} isLarge={true} />
    </div>
  </div>
)

export const StatsSection = () => (
  <section className={`w-full flex flex-col ${SPACING.gapSemantic}`}>
    <SectionHeader />
    <StatsGrid />
  </section>
) 


// text content
const StatValue = ({ value }: { value: string }) => (
  <GradientLargeHeading className="text-start">
   {value}
  </GradientLargeHeading>
)

const StatLabel = ({ label }: { label: string }) => (
  <MainHeading className="text-start !text-3xl">
    {label}
  </MainHeading>
)

const StatComment = ({ comment }: { comment: string }) => (
  <Subtitle className="text-start">
    {comment}
  </Subtitle>
)

const SectionHeader = () => (
  <div className={`flex flex-col ${SPACING.gap} text-center`}>
    <GradientSectionHeading 
      text={CONENT_RESOURCES.stats_block.title}
    />
    <Subtitle className="leading-relaxed max-w-2xl mx-auto">
      {CONENT_RESOURCES.stats_block.subtitle}
    </Subtitle>
  </div>
)
