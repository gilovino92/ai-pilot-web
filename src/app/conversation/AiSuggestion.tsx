// import { useQuery } from "@tanstack/react-query";
// import { Bot, Check, RefreshCw, Sparkles, X } from "lucide-react";
// import { useEffect } from "react";

// import type { Network } from "@/data/types";

// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { conversationSuggestionQueryOptions } from "@/data/ai-suggestion";

// type AiSuggestionProps = {
//   conversationId: string;
//   network: Network;
//   onClose: () => void;
//   onSelectSuggestion: (suggestion: string) => void;
// };

// export default function AiSuggestion({
//   conversationId,
//   network,
//   onClose,
//   onSelectSuggestion,
// }: AiSuggestionProps) {
//   const { data, isFetching, refetch } = useQuery(
//     conversationSuggestionQueryOptions({ conversationId, network }),
//   );

//   useEffect(() => {
//     if (isFetching) {
//       window.gtag("event", "conversation_suggestion_requested", {
//         conversation_id: conversationId,
//         network,
//       });
//     }
//   }, [isFetching, conversationId, network]);

//   return (
//     <div className="bg-background absolute bottom-34 left-0 flex w-full flex-col gap-2 rounded-md border p-2 shadow-md xl:w-1/2">
//       <div className="flex flex-wrap items-center justify-between gap-1">
//         <div className="flex items-center gap-2">
//           <Sparkles size={16} />
//           <p className="text-sm font-medium">AI Suggestions</p>
//         </div>
//         <div>
//           <Button
//             disabled={isFetching}
//             onClick={() => {
//               refetch();
//               window.gtag("event", "conversation_suggestion_regenerated", {
//                 conversation_id: conversationId,
//                 network,
//               });
//             }}
//             size="sm"
//             variant="ghost"
//           >
//             <RefreshCw />
//             Regenerate
//           </Button>
//           <Button onClick={onClose} size="sm" variant="ghost">
//             <X />
//             Close
//           </Button>
//         </div>
//       </div>
//       <Alert>
//         <Bot />
//         <AlertTitle>Suggested Response</AlertTitle>
//         <AlertDescription>
//           {isFetching ? (
//             <>
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-5/6" />
//               <Skeleton className="h-4 w-3/4" />
//             </>
//           ) : (
//             <p>{data ?? "Try regenerating the suggestion to get a new one."}</p>
//           )}
//         </AlertDescription>
//         <AlertDescription>
//           <Button
//             disabled={isFetching || !data}
//             onClick={() => {
//               if (data) {
//                 onSelectSuggestion(data);
//               }
//             }}
//             size="sm"
//             variant="ghost"
//           >
//             <Check />
//             Use This Response
//           </Button>
//         </AlertDescription>
//       </Alert>
//     </div>
//   );
// }
