import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { QUERY_KEYS } from "@/shared/constants";

export function useProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => userService.getProfile(),
  });

  return { user, isLoading }
}