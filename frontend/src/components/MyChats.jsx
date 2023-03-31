import { Avatar } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/handleLogic";
import CreateGroup from "./CreateGroup";
import socket from "../config/socket";

const MyChats = ({ fetchAllData, setFetchAllData }) => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notify,
    setNotify,
    fetchFriendList,
    setFetchFriendList,
    fetchInviteList,
    setFetchInviteList,
    fetchRequestList,
    setFetchRequestList,
  } = ChatState();

  const getListChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/v1/chat", config);
      setChats(data);
    } catch (err) {
      console.log(err.response.data.msg);
    }
  };

  const handleChat = (chat) => {
    const newNotify = notify.filter((noti) => noti.chat._id !== chat._id);
    setNotify(newNotify);
    setSelectedChat(chat);
  };

  useEffect(() => {
    getListChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllData, fetchFriendList]);

  useEffect(() => {
    socket.on("fetchChats", () => {
      getListChat();
      setSelectedChat();
    });
    socket.on("online", (id) => {
      socket.emit("isOnline", id);
    });
    socket.on("fetchFriendList", () => {
      setFetchFriendList(!fetchFriendList);
    });
    socket.on("fetchRequestList", () => {
      setFetchInviteList(!fetchInviteList);
    });
    socket.on("fetchInviteList", () => {
      setFetchRequestList(!fetchRequestList);
    });
  });

  return (
    <div className="basis-96 h-vh overflow-auto pl-3">
      <div className="flex justify-between items-center h-12 pr-4 font-bold">
        <h1 className="text-3xl">Chats</h1>
        <CreateGroup
          setFetchAllData={setFetchAllData}
          fetchAllData={fetchAllData}
        />
      </div>
      <div>
        {chats &&
          // eslint-disable-next-line
          chats.map((chat, key) => {
            if (chat.latestMessage || chat.isGroupChat) {
              return (
                <div
                  className="flex mt-4 cursor-pointer"
                  key={key}
                  onClick={() => handleChat(chat)}
                >
                  {chat.isGroupChat ? (
                    <Avatar src={chat.chatAvatar} className="w-14 h-14" />
                  ) : (
                    <Avatar
                      src={getSenderFull(user, chat.users).avatar}
                      className="w-14 h-14"
                    />
                  )}
                  <div className="ml-4">
                    {chat.isGroupChat ? (
                      <div className="font-medium text-lg">{chat.chatName}</div>
                    ) : (
                      <div className="font-medium text-lg">
                        {getSender(user, chat.users)}
                      </div>
                    )}

                    <div className="text-gray-600">
                      {chat.latestMessage && chat.latestMessage.content}
                    </div>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default MyChats;
