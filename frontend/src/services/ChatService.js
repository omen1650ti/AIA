import {postAPI } from './Axios';

export const createChatDetail = async (chatDetail)=>{
  return await postAPI('/v1/chat/chat', chatDetail);
};
