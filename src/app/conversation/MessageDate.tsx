import { format } from "date-fns";

type MessageDateProps = {
  show: boolean;
  timestamp: number;
};

export default function MessageDate({ show, timestamp }: MessageDateProps) {
  if (!show) {
    return null;
  }

  return (
    <p className="text-muted-foreground mt-4 text-center text-xs italic">
      {format(timestamp, "MMM d, yyyy")}
    </p>
  );
}
