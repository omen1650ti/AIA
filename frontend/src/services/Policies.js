import { getAPI } from "./Axios";

export const getPolicies = async (filters) => {
  return await getAPI("v1/plans/", { params: filters });
};
