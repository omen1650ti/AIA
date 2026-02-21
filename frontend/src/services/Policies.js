import { getAPI } from "./Axios";

export const getPolicies = async (filters) => {
  // Clean filters: remove null, undefined, or empty strings
  const cleanedFilters = Object.entries(filters || {}).reduce(
    (acc, [key, value]) => {
      // Skip null, undefined, or empty strings
      if (value === null || value === undefined || value === "") return acc;

      // Skip 'false' values for boolean flags (keep only 'true' features)
      if (typeof value === "boolean" && value === false) return acc;

      acc[key] = value;
      return acc;
    },
    {},
  );

  return await getAPI("v1/plans/", { params: cleanedFilters });
};
