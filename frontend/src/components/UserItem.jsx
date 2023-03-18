import { Avatar } from "antd";
import React from "react";
import { ChatState } from "../context/ChatProvider";

const UserItem = () => {
  const { user, selectedChat } = ChatState();
  return (
    <>
      {selectedChat.users.map((user, key) => (
        <div className="flex mb-2 cursor-pointer">
          <Avatar src={user.avatar} className="w-12 h-12" />
          <div className="ml-4">
            <div className="font-medium text-base">{user.name}</div>
            <div className="text-sm opacity-90">{user.email}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserItem;
