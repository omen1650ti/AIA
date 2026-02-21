import { postAPI } from './Axios';

// Real service for claim analysis using multi-file upload
export const analyzeClaim = async (claimData) => {
  const formData = new FormData();
  
  // The backend expects an array of files under the key 'files'
  if (claimData.docs) {
    Object.values(claimData.docs).forEach(file => {
      if (file) formData.append('files', file);
    });
  }
  
  return await postAPI('/v1/extraction/upload', formData);
};

export const uploadClaimDocument = async (file) => {
    // Mock upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        url: URL.createObjectURL(file),
        name: file.name,
        uploadedAt: new Date().toISOString()
    };
};
