"use client";

import { useInstanceParams } from "@/components/params-context";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/lib/trpc/client";

import { DetailsDataTable } from "./details-data-table";

export function ResultsSection() {
  const params = useInstanceParams();
  const { status, data } =
    api.institution.instance.algorithm.allResults.useQuery({
      params,
    });

  if (status !== "success") return <Skeleton className="h-60 w-full" />;

  return (
    <Tabs defaultValue={data.firstNonEmpty}>
      <TabsList className="w-full">
        {data.results.map((result, i) => (
          <TabsTrigger
            className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            value={result.algName}
            key={i}
            disabled={result.data.length === 0}
          >
            {result.displayName}
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator className="my-4" />
      {data.results.map((result, i) => (
        <TabsContent key={i} value={result.algName}>
          <DetailsDataTable data={result.data} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
