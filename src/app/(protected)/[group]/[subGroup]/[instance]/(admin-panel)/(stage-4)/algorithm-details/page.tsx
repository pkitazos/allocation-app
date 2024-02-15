import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";

import { InstanceParams } from "@/lib/validations/params";
import { DetailsTable } from "./_components/details-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const { results, firstNonEmpty } =
    await api.institution.instance.algorithm.allResults.query({
      params,
    });

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex w-1/2 flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">Algorithm Results</h2>
        <Tabs defaultValue={results[firstNonEmpty]?.algName ?? ""}>
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
          </TabsList>
          <Separator className="my-4" />
          {results.map((result, i) => (
            <TabsContent key={i} value={result.algName}>
              <DetailsTable data={result.data} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
