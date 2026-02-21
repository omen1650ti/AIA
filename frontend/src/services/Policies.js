import { getAPI } from "./Axios";

export const getPolicies = async (filters) => {
  // Clean filters: remove null, undefined, or empty strings
  const cleanedFilters = Object.entries(filters || {}).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );

  return await getAPI("v1/plans/", { params: cleanedFilters });
};
