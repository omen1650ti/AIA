import { useQuery } from "@tanstack/react-query";
import { getPolicies } from "../services/Policies";

export const useGetPolicies = (filters) => {
  return useQuery({
    queryKey: ["policies", filters],
    queryFn: () => getPolicies(filters),
  });
};
