import { useContext } from "react";
import { SSEContext } from "@/components/SSEProvider";

export function useSSE() {
  return useContext(SSEContext);
}
