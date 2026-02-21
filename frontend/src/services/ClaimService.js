import { postAPI } from './Axios';

// Mock service for claim analysis
export const analyzeClaim = async (claimData) => {
  // Artificial delay to show the cycling loader messages (requested for ~2.5 mins experience)
  // For demo purposes, we cycle for 15 seconds
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  return {
    id: "CLM-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    timestamp: new Date().toISOString(),
    status: "Highly Likely",
    score: 88,
    analysis: [
      "All 5 required documents (Aadhar, Plan, Discharge, Medical Cert, Bill) verified.",
      "Aadhar Card verified for identity verification.",
      "Policy coverage matches the reported claim type.",
      "Incident timestamp is within the active policy period.",
      "Medical records correctly reflect the reported injuries.",
      "All bills have been cross-verified with policy limits."
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
