import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services";
import type { LoginRequest } from "@/types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}
