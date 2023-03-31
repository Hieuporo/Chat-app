/* eslint-disable array-callback-return */
import { Avatar, Badge } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import socket from "./../config/socket";

const ListFriend = () => {
  const {
    friendList,
    setFriendList,
    fetchFriendList,
    setFetchFriendList,
    user,
    setSelectedChat,
    selectedChat,
    chats,
    friendOnline,
    setFriendOnline,
    friendOnlineRef,
  } = ChatState();

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

  const getAllfriends = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/v1/friend", config);

      setFriendList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllfriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, fetchFriendList, chats]);

  useEffect(() => {
    socket.on("isOnline", (id) => {
      if (!friendOnlineRef.current.includes(id) && id !== user._id) {
        setFriendOnline((friendOnline) => {
          const newFriendOnline = [...friendOnline, id];
          friendOnlineRef.current = newFriendOnline;
          return newFriendOnline;
        });
      }
    });
    socket.on("userDisconnected", (userId) => {
      setFriendOnline((friendOnline) => {
        const newFriendOnline = friendOnline.filter(
          (friendId) => friendId !== userId
        );
        friendOnlineRef.current = newFriendOnline;
        return newFriendOnline;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => {
      socket.off("isOnline");
      socket.off("userDisconnected");
    };
  });

  return (
    <div className="fixed w-[353px] h-vh overflow-auto right-0">
      <div>
        <h1 className="text-lg opacity-70 mt-4">Contacts</h1>
        <div className="mt-4">
          {friendList.map((friend, key) => {
            if (friendOnline.includes(friend._id)) {
              return (
                <div
                  className="flex h-12 items-center pt-2 cursor-pointer hover:opacity-90"
                  onClick={() => accessChat(friend)}
                  key={key}
                >
                  <Badge
                    count={" "}
                    size="small"
                    offset={[-6, 34]}
                    color="green"
                  >
                    <Avatar src={friend.avatar} className="w-10 h-10" />
                  </Badge>
                  <div className="ml-3 font-semibold">{friend.name}</div>
                </div>
              );
            }
          })}
          {friendList.map((friend, key) => {
            if (!friendOnline.includes(friend._id)) {
              return (
                <div
                  className="flex h-12 items-center pt-2 cursor-pointer hover:opacity-90"
                  onClick={() => accessChat(friend)}
                  key={key}
                >
                  <Avatar src={friend.avatar} className="w-10 h-10" />
                  <div className="ml-3 font-semibold">{friend.name}</div>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div>
        <h1 className="text-lg opacity-70 mt-4">Group conversations</h1>
        <div className="mt-4">
          {chats.map((chat, key) => {
            if (chat.isGroupChat) {
              if (chat.users.some((user) => friendOnline.includes(user._id))) {
                return (
                  <div
                    className="flex h-12 items-center mt-2 cursor-pointer"
                    key={key}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <Badge
                      count={" "}
                      size="small"
                      offset={[-6, 34]}
                      color="green"
                    >
                      {" "}
                      <Avatar src={chat.chatAvatar} className="w-10 h-10" />
                    </Badge>
                    <div className="ml-3 font-semibold">{chat.chatName}</div>
                  </div>
                );
              }
            }
          })}
          {chats.map((chat, key) => {
            if (chat.isGroupChat) {
              if (!chat.users.some((user) => friendOnline.includes(user._id))) {
                return (
                  <div
                    className="flex h-12 items-center mt-2 cursor-pointer"
                    key={key}
                    onClick={() => setSelectedChat(chat)}
                  >
                    {" "}
                    <Avatar src={chat.chatAvatar} className="w-10 h-10" />
                    <div className="ml-3 font-semibold">{chat.chatName}</div>
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ListFriend;
