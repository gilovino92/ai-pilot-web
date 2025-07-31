import { Filter as FilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Filter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem>New</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Prospect</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Industry</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem>Grain Export</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Produce</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Other</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
