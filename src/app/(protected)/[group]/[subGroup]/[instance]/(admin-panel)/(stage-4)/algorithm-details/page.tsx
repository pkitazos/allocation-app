import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";
import { DetailsTable } from "./details-table";

export default async function Page({
  params,
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const { results, firstNonEmpty } =
    await api.institution.instance.algorithmResultsGeneral.query({
      params,
    });

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex w-1/2 flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">Algorithm Results</h2>
        <Tabs defaultValue={results[firstNonEmpty].algName}>
          <TabsList className="w-full">
            {results.map((result, i) => (
              <TabsTrigger
                className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                value={result.algName}
                key={i}
                disabled={result.data.matching.length === 0}
              >
                {result.displayName}
              </TabsTrigger>
            ))}
            {/* <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="greedy"
            >
              Greedy
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="minimum-cost"
            >
              Minimum Cost
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="greedy-generous"
            >
              Greedy-Generous
            </TabsTrigger> */}
          </TabsList>
          <Separator className="my-4" />
          {results.map((result, i) => (
            <TabsContent key={i} value={result.algName}>
              <DetailsTable data={result.data} />
            </TabsContent>
          ))}
          {/*           
          <TabsContent value="greedy">
            <DetailsTable data={results[1].data} />
          </TabsContent>
          <TabsContent value="minimum-cost">
            <DetailsTable data={results[2].data} />
          </TabsContent>
          <TabsContent value="greedy-generous">
            <DetailsTable data={results[3].data} />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
