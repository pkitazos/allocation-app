"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { MatchingDetailsDto } from "@/lib/validations/matching";
import { detailsColumns } from "./details-columns";

export function DetailsDataTable({ data }: { data: MatchingDetailsDto[] }) {
  return <DataTable columns={detailsColumns} data={data} />;
}
