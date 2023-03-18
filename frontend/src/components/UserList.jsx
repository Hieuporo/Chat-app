import React from "react";
import { List, Avatar } from "antd";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";

const UserList = ({ searchResult, handleGroup, chatAccess }) => {
  const { setSelectedChat, user } = ChatState();

  const accessChat = async (userInfo) => {
    console.log(userInfo);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.post(
        "/api/v1/chat/accessChat",
        { userId: userInfo._id },
        config
      );

      setSelectedChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (userInfo) => {
    if (chatAccess) {
      accessChat(userInfo);
    } else {
      handleGroup(userInfo);
    }
  };

  return (
    <List className="user-box cursor-pointer mt-4">
      {searchResult &&
        searchResult.map((user, key) => (
          <li
            className="flex py-3 px-1 hover:bg-cyan-300 rounded-md"
            key={key}
            onClick={() => handleClick(user)}
          >
            <Avatar src={user.avatar} className="w-14 h-14" />
            <div className="ml-4">
              <div className="font-medium text-base">{user.name}</div>
              <div>Email: {user.email}</div>
            </div>
          </li>
        ))}
    </List>
  );
};

export default UserList;
