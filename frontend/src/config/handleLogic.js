import { inView } from "framer-motion";

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 40;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 7;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const inThisList = (user, invites) => {
  const result = invites.some((invite) => {
    return invite.senderId._id === user._id;
  });

  return result ? true : false;
};

export const inThisRequests = (user, requests) => {
  const result = requests.some((request) => {
    return request.receiverId._id === user._id;
  });

  return result ? true : false;
};

export const getInvite = (user, invites) => {
  const result = invites.filter((invite) => invite.receiverId._id === user._id);
  return result[0];
};

export const getRequest = (user, requests) => {
  const result = requests.filter((request) => {
    return request.senderId._id === user._id;
  });
  return result[0];
};
