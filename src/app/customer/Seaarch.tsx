import { Input } from "@/components/ui/input";

type SearchProps = React.ComponentProps<typeof Input>;

export default function Search(props: SearchProps) {
  return <Input placeholder="Search..." {...props} />;
}
