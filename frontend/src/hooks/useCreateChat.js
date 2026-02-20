import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatDetail } from "../services/ChatService";

export const useCreateChatDetails = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (chatDetail) => {
      return createChatDetail(chatDetail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getChatDetails"] });
    },
  });

  return mutation;
};
