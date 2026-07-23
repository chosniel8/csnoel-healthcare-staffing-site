import { supabaseClient } from "@/lib/supabaseClient";
import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let active = true;

    void supabaseClient.auth.getSession().finally(() => {
      if (active) setSessionReady(true);
    });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(() => {
      setSessionReady(true);
      void utils.auth.me.invalidate();
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [utils.auth.me]);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: sessionReady,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    await supabaseClient.auth.signOut();
    utils.auth.me.setData(undefined, null);
    await utils.auth.me.invalidate();
  }, [utils]);

  const state = useMemo(() => ({
    user: meQuery.data ?? null,
    loading: !sessionReady || meQuery.isLoading,
    error: meQuery.error ?? null,
    isAuthenticated: Boolean(meQuery.data),
  }), [meQuery.data, meQuery.error, meQuery.isLoading, sessionReady]);

  useEffect(() => {
    if (!redirectOnUnauthenticated || state.loading || state.user || !redirectPath) return;
    if (typeof window === "undefined" || window.location.pathname === redirectPath) return;
    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, state.loading, state.user]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
