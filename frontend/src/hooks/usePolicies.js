import { useQuery } from "@tanstack/react-query";
import { getPolicies } from "../services/Policies";
import { useAtom } from "jotai";
import { policiesAtom } from "../store/atoms";
import { useEffect, useMemo } from "react";

export const useGetPolicies = (filters = {}) => {
  const [storedPolicies, setStoredPolicies] = useAtom(policiesAtom);

  const query = useQuery({
    queryKey: ["policies", filters],
    queryFn: () => getPolicies(filters),
    // Removed enabled: storedPolicies.length === 0 to allow filtering re-fetches
  });

  useEffect(() => {
    if (query.data) {
      setStoredPolicies(query.data);
    }
  }, [query.data, setStoredPolicies]);

  return {
    ...query,
    data: query.data || storedPolicies, // Prefer query.data for the most current filtered results
  };
};
