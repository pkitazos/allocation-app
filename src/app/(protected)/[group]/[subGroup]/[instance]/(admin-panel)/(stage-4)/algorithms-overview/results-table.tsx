"use client";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BuiltInAlg } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";
import { ResultsTableRow } from "./results-table-row";

export function ResultsTable({
  params,
  selectedAlgorithm,
}: {
  params: instanceParams;
  selectedAlgorithm: BuiltInAlg | undefined;
}) {
  const [selectedMatching, setSelectedMatching] = useState(selectedAlgorithm);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Matching Type</TableHead>
          <TableHead className="text-center">Weight</TableHead>
          <TableHead className="w-fit min-w-[8rem] text-center">
            Profile
          </TableHead>
          <TableHead className="w-32 text-center">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ResultsTableRow
          algName={"generous"}
          algDisplayName={"Generous"}
          params={params}
          selectedMatching={selectedMatching}
          setSelectedMatching={setSelectedMatching}
        />
        <ResultsTableRow
          algName={"greedy"}
          algDisplayName={"Greedy"}
          params={params}
          selectedMatching={selectedMatching}
          setSelectedMatching={setSelectedMatching}
        />
        <ResultsTableRow
          algName={"minimum-cost"}
          algDisplayName={"Minimum Cost"}
          params={params}
          selectedMatching={selectedMatching}
          setSelectedMatching={setSelectedMatching}
        />
        <ResultsTableRow
          algName={"greedy-generous"}
          algDisplayName={"Greedy-Generous"}
          params={params}
          selectedMatching={selectedMatching}
          setSelectedMatching={setSelectedMatching}
        />
      </TableBody>
    </Table>
  );
}
