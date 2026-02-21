import { postAPI } from './Axios';

/**
 * Real Service for Dispute Analysis using multi-file upload
 */
export const submitDispute = async (data) => {
  const formData = new FormData();
  
  // The backend expects files under the key 'files'
  if (data.claimFile) formData.append('files', data.claimFile);
  if (data.rejectionFile) formData.append('files', data.rejectionFile);
  
  // user_input is required by the API
  formData.append('user_input', data.description || "Dispute analysis request");

  return await postAPI('/v1/dispute/generate-mail', formData);
};
