import { useState } from "react";
import { submitDispute } from "../services/DisputeService";

export const useDispute = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const analyzeDispute = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submitDispute(data);
      setResult(response);
    } catch (err) {
      setError("Failed to analyze dispute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetDispute = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    result,
    analyzeDispute,
    resetDispute
  };
};
