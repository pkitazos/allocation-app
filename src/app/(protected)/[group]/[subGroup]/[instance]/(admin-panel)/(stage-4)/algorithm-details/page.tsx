"use client";
import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/lib/trpc/client";
import { InstanceParams } from "@/lib/validations/params";

import { DetailsDataTable } from "./_components/details-data-table";

export default function Page({ params }: { params: InstanceParams }) {
  const { status, data } =
    api.institution.instance.algorithm.allResults.useQuery({
      params,
    });

  return (
    <PanelWrapper className="mt-20 flex flex-col items-center">
      <div className="flex w-full flex-col gap-3">
        <SubHeading className="mb-6 text-2xl">Algorithm Results</SubHeading>
        {status === "success" ? (
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
        ) : (
          <Skeleton className="h-60 w-full" />
        )}
      </div>
    </PanelWrapper>
  );
}
