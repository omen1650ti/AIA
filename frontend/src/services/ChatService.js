import {postAPI } from './Axios';

export const createChatDetail = async (chatDetail)=>{
  return await postAPI('/chat/new-chat', chatDetail);
};
