import { useQuery } from "@tanstack/react-query";
import { getPolicyDetail } from "../services/PolicyDetail";

export const useGetPolicyDetail = (policyId) => {
  return useQuery({
    queryKey: ["getPolicyDetail", policyId],
    queryFn: () => getPolicyDetail(policyId),
    enabled: !!policyId, // prevents running if id is undefined/null
  });
};
