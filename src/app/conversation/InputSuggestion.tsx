// import { Sparkles } from "lucide-react";
// import { useState } from "react";

// import type { Network } from "@/data/types";

// import { Button } from "@/components/ui/button";

// import AiSuggestion from "./AiSuggestion";

// type InputSuggestionProps = {
//   conversationId: string;
//   network: Network;
//   onSelectSuggestion: (suggestion: string) => void;
// };

// export default function InputSuggestion({
//   conversationId,
//   network,
//   onSelectSuggestion,
// }: InputSuggestionProps) {
//   const [showSuggestion, setShowSuggestion] = useState(false);

//   return (
//     <>
//       {showSuggestion && (
//         <AiSuggestion
//           conversationId={conversationId}
//           network={network}
//           onClose={() => {
//             setShowSuggestion(false);
//           }}
//           onSelectSuggestion={onSelectSuggestion}
//         />
//       )}
//       <Button
//         onClick={() => {
//           setShowSuggestion(true);
//         }}
//         size="icon"
//         variant="ghost"
//       >
//         <Sparkles />
//       </Button>
//     </>
//   );
// }
