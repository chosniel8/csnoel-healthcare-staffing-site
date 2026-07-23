import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { supabaseClient } from "./lib/supabaseClient";
import { trpc } from "./lib/trpc";
import "./index.css";

const queryClient = new QueryClient();

const reportProtectedRequestError = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (error.message === UNAUTHED_ERR_MSG) {
    console.info("A protected CSNoel request requires an active administrator session.");
  }
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    reportProtectedRequestError(event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    reportProtectedRequestError(event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      async headers() {
        const { data } = await supabaseClient.auth.getSession();
        return data.session?.access_token
          ? { Authorization: `Bearer ${data.session.access_token}` }
          : {};
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
