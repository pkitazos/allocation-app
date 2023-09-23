import { Input } from "@/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, EyeOffIcon, ListFilter } from "lucide-react";
import { Button } from "midone";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  canFilter: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  canFilter,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className=" min-h-8 my-1.5 -ml-1 text-left">
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="backdrop-blur-lg" align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {canFilter && (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">
              <ListFilter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="mb-5 w-[300px]">
            <Input
              placeholder={`Filter ${title}`}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
