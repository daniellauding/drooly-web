import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function BackofficeImages() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="text-center text-sm text-muted-foreground">
                Image management coming soon
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