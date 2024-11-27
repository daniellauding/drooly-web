import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BackofficePlans() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="text-center text-sm text-muted-foreground">
                Plan management coming soon
              </div>
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}