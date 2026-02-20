import { getAPI } from "./Axios";

export const getPolicyDetail = async (policyId) => {
  return await getAPI(`/v1/plans/id/${policyId}`);
};