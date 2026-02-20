import { useMutation } from "@tanstack/react-query";
import { analyzeClaim } from "../services/ClaimService";

export const useClaimReview = () => {
  return useMutation({
    mutationFn: (claimData) => analyzeClaim(claimData),
    onSuccess: (data) => {
      console.log("Claim analysis completed successfully", data);
    },
    onError: (error) => {
      console.error("Error analyzing claim:", error);
    }
  });
};
