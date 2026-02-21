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
    enabled: storedPolicies.length === 0, // Only fetch if atom is empty
  });

  useEffect(() => {
    if (query.data && storedPolicies.length === 0) {
      setStoredPolicies(query.data);
    }
  }, [query.data, storedPolicies, setStoredPolicies]);

  return {
    ...query,
    data: storedPolicies.length > 0 ? storedPolicies : query.data,
  };
};
