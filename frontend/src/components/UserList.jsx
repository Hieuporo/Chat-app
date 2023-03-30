import React from "react";
import { List, Avatar, notification } from "antd";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { IconPlus, MessageIconV2 } from "./Icons";

const UserList = ({ searchResult, handleGroup, chatAccess, addfriend }) => {
  const { setSelectedChat, user } = ChatState();

  const accessChat = async (userInfo) => {
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

  if (!addfriend) {
    return (
      <List className="user-box mt-4">
        {searchResult &&
          searchResult.map((user, key) => (
            <li
              className="flex py-3 px-1 hover:bg-gray-300 rounded-md items-center"
              key={key}
              onClick={() => handleClick(user)}
            >
              <div className="flex w-72 ">
                <Avatar src={user.avatar} className="w-14 h-14" />
                <div className="ml-4">
                  <div className="font-medium text-base">{user.name}</div>
                  <div>{user.email}</div>
                </div>
              </div>
            </li>
          ))}
      </List>
    );
  }
  return (
    <List className="user-box mt-4">
      {searchResult &&
        searchResult.map((user, key) => (
          <li
            className="flex py-3 px-1 hover:bg-gray-300 rounded-md justify-around items-center"
            key={key}
          >
            <div className="flex w-72 ">
              <Avatar src={user.avatar} className="w-14 h-14" />
              <div className="ml-4">
                <div className="font-medium text-base">{user.name}</div>
                <div>{user.email}</div>
              </div>
            </div>
            <MessageIconV2 onClick={() => handleClick(user)} />
          </li>
        ))}
    </List>
  );
};

export default UserList;
