import { LeadRequestForm } from "@/features/lead/lead-request/lead-request";
import { PageContainer } from "@/components/continer";
import { SectionHeading, Subtitle } from "@/components/ui/typography";

export default function HelpPage() {
  return (
    <PageContainer className="min-h-[80vh] md:min-h-[90vh] justify-center">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <div className="text-center space-y-4">
          <SectionHeading>
            Требуется поддержка?
          </SectionHeading>
          <Subtitle>
            обсудим ваши вопросы в ближайшее время
          </Subtitle>
        </div>
        
        <LeadRequestForm />
      </div>
    </PageContainer>
  );
}
