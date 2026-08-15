import { trpc } from "@/lib/trpc";

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => utils.auth.me.invalidate(),
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => utils.auth.me.invalidate(),
  });

  return {
    user: user ?? null,
    loading: isLoading,
    login: (username: string, password: string) => loginMutation.mutateAsync({ username, password }),
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: () => logoutMutation.mutate(),
  };
}
