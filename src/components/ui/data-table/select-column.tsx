import { CheckedState } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export function getSelectColumn<T>() {
  const column: ColumnDef<T> = {
    id: "select",
    header: ({ table }) => {
      const allRowsSelected = table.getIsAllPageRowsSelected();
      const someRowsSelected = table.getIsSomePageRowsSelected();

      const checkedState = allRowsSelected
        ? true
        : someRowsSelected
          ? "indeterminate"
          : false;

      function handleCheck(value: CheckedState) {
        if (value === "indeterminate") table.toggleAllPageRowsSelected(true);
        else table.toggleAllPageRowsSelected(!!value);
      }

      return (
        <Checkbox
          checked={checkedState}
          onCheckedChange={handleCheck}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
  return column;
}
