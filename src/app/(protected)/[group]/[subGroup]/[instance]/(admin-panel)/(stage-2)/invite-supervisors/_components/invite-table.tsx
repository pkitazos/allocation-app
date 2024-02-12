import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supervisor = any;

export function InviteTable({ supervisors }: { supervisors: Supervisor[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>School ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supervisors.map((supervisor) => (
          <TableRow key={supervisor.supervisor}>
            <TableCell className="font-medium">{supervisor.name}</TableCell>
            <TableCell>{supervisor.schoolId}</TableCell>
            <TableCell>{supervisor.email}</TableCell>
            <TableCell className="text-right">{supervisor.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
