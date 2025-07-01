import { QueryClient } from "@tanstack/react-query";
import { isDev } from "./consts";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: isDev ? 0 : 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    },
  },
});