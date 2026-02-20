import { postAPI } from './Axios';

// Mock service for claim analysis
export const analyzeClaim = async (claimData) => {
  // Simulating API call
  console.log("Analyzing claim with data:", claimData);
  
  // Artificial delay to show loaders
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    id: "CLM-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    timestamp: new Date().toISOString(),
    status: "Highly Likely",
    score: 88,
    analysis: [
      "All 5 required documents have been uploaded and verified.",
      "Policy #POL-8821 coverage matches the 'Accident' claim type.",
      "Incident timestamp is within the active policy period.",
      "Medical records correctly reflect the reported injuries.",
      "No conflicting historical claims found for this policy holder."
    ],
    recommendations: [
      "Standard processing recommended.",
      "Ensure all signatures on the claim form are legible.",
      "The claim is ready for final submission."
    ]
  };
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
