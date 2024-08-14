"use client";

import { Table } from "@tanstack/react-table";
import { XCircleIcon } from "lucide-react";

import {
  useDataTableFlags,
  useDataTableTags,
} from "@/components/data-table-context";

import { SearchableColumn } from "@/lib/validations/table";

import { Button } from "../button";
import { Input } from "../input";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  searchableColumn?: SearchableColumn;
  data: TData[];
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  searchableColumn,
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const tableFlags = useDataTableFlags();
  const tableTags = useDataTableTags();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumn && (
          <Input
            placeholder={`Search ${searchableColumn.displayName ?? ""}`}
            value={
              (table
                .getColumn(searchableColumn.id)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(searchableColumn.id)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getAllColumns().some((c) => c.id === "Flags") && (
          <DataTableFacetedFilter
            column={table.getColumn("Flags")}
            title="Flags"
            options={tableFlags}
          />
        )}
        {table.getAllColumns().some((c) => c.id === "Keywords") && (
          <DataTableFacetedFilter
            column={table.getColumn("Keywords")}
            title="Keywords"
            options={tableTags}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="flex h-8 items-center gap-2 text-muted-foreground"
          >
            <XCircleIcon className="h-4 w-4" />
            <p>Reset</p>
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
