/**
 * Mock Service for Dispute Analysis
 */
export const submitDispute = async (data) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Mock response with a generated email
  return {
    success: true,
    message: "Dispute analyzed successfully.",
    generatedEmail: `Subject: Formal Dispute Regarding Insurance Claim - ${data.description.substring(0, 20)}...

Dear Support Team,

I am writing to formally dispute the recent decision regarding my insurance claim. 

Details provided:
${data.description}

Attached are the relevant supporting documents for your review. I request a re-evaluation of my case based on the provided information.

Thank you for your prompt attention to this matter.

Sincerely,
[Your Name]`,
    status: "Email template ready for submission"
  };
};
