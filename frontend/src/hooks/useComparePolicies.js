import { useMutation, useQueryClient } from "@tanstack/react-query";
import { comparePolicies } from "../services/CompareService";

/**
 * Hook to handle policy comparison mutation
 */
export const useComparePolicies = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (comparisonData) => {
      return comparePolicies(comparisonData);
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed, e.g., comparison history
      queryClient.invalidateQueries({ queryKey: ["getPolicyComparison"] });
    },
  });

  return mutation;
};
