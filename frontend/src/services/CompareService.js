import { postAPI } from './Axios';

/**
 * Service to compare two policies
 * @param {Object} comparisonData - Object containing policy IDs (old_policy_id, new_policy_id)
 */
export const comparePolicies = async (comparisonData) => {
  const { old_policy_id, new_policy_id } = comparisonData;
  return await postAPI(`/v1/chat/policy-checker?old_policy_id=${old_policy_id}&new_policy_id=${new_policy_id}`);
};
