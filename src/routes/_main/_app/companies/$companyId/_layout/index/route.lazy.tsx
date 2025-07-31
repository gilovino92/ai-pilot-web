import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Building, Globe, Mail, MapPin, Phone, Users2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerQueryOptions } from "@/data/customer";

export const Route = createLazyFileRoute(
  "/_main/_app/companies/$companyId/_layout/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { companyId } = Route.useParams();
  const { data } = useSuspenseQuery(customerQueryOptions(companyId));

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-4">
              <Building className="text-muted-foreground shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium">Industry</p>
                <p className="text-muted-foreground text-sm">{data.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-muted-foreground shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-muted-foreground text-sm">
                  {data.phone_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-muted-foreground shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground text-sm">{data.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-muted-foreground shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-muted-foreground text-sm">{data.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="text-muted-foreground shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium">Website</p>
                <p className="text-muted-foreground text-sm">{data.website}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users2 className="text-muted-foreground shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium">Employees</p>
                <p className="text-muted-foreground text-sm">
                  {data.num_employees}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            <div>
              <p className="text-muted-foreground text-sm">Total Deal Value</p>
              <p className="text-lg font-medium">$3.2M</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Lifetime Value</p>
              <p className="text-lg font-medium">$3.2M</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Open Opportunities
              </p>
              <p className="text-lg font-medium">10</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active Contracts</p>
              <p className="text-lg font-medium">2</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Avg. Response Time
              </p>
              <p className="text-lg font-medium">4h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
