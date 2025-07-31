import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import type { Customer as TCustomer } from "@/data/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Delete from "./Delete";
import Edit from "./Edit";

type CustomerProps = {
  data: TCustomer;
};

export default function Customer({ data }: CustomerProps) {
  return (
    <Card className="gap-2 py-4 pb-2">
      <CardHeader className="flex items-start justify-between px-4">
        <div className="space-y-1.5">
          <CardTitle>{data.company_name}</CardTitle>
          <CardDescription>{data.industry}</CardDescription>
        </div>
        <Badge variant="default">{data.status}</Badge>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground shrink-0" size={14} />
          <p className="text-muted-foreground text-sm">Last contact: --</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-4">
        <Button asChild size="sm" variant="link">
          <Link
            params={{ companyId: data.id.toString() }}
            to="/companies/$companyId"
          >
            View Details
          </Link>
        </Button>
        <div className="flex items-center">
          <Edit data={data} />
          <Delete data={data} />
        </div>
      </CardFooter>
    </Card>
  );
}
