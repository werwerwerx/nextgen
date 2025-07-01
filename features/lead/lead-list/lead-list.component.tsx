"use client";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { TGETLeadResponse } from "../lead-request/shared";
import { useQuery } from "@tanstack/react-query";
import { nextJsonApiInstance } from "@/lib/api.instance";

const getLeads = async () => {
  const response = await nextJsonApiInstance<TGETLeadResponse>("/api/leads");
  if (!response.success) {
    throw new Error(response.errorMessage);
  }
  return response.data || [];
};

export const useGetLeads = () => {
  return useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });
};

export const LeadList = () => {
  const { data: leads, isPending, error } = useGetLeads();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список лидов</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error.message}</p>}
        <ul className="flex flex-col gap-2">
          {leads?.map((lead) => (
            <li key={lead.id}>{lead.name} {lead.email} {lead.phone} {lead.interest}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
