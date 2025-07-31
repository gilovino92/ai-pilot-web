import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SkeletonTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">
            <Skeleton className="h-4 w-15" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="ml-auto h-4 w-15" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-25" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-25" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-15" />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
