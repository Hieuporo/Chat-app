import React, { useEffect, useState } from "react";
import { Avatar, Badge, Input, Popover, Tooltip, notification } from "antd";
import { ChatState } from "../context/ChatProvider";
import {
  getSenderFull,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/handleLogic";
import axios from "axios";
import ScrollableFeed from "react-scrollable-feed";
import socket from "../config/socket";
import { Image } from "cloudinary-react";
import { EmojiIcon } from "./Icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

let currentChat;

const ChatBox = ({
  showChatDetail,
  setShowChatDetail,
  fetchAllData,
  setFetchAllData,
}) => {
  const {
    user,
    selectedChat,
    chats,
    setChats,
    notify,
    setNotify,
    friendOnline,
  } = ChatState();
  const [chatData, setChatData] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSelectEmoji = (emoji) => {
    const msg = newMessage + emoji.native;
    setNewMessage(msg);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");
    formData.append("could_name", "dalqfcdow");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dalqfcdow/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setImageUrl(data.secure_url);
  };

  useEffect(() => {
    sendMessage("img");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const fetchChatData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`,
        config
      );

      setChatData(data);
      socket.emit("joinRoom", selectedChat._id);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (type) => {
    if (type && type !== "img" && type !== "file") {
      if (newMessage.trim().length === 0) {
        setNewMessage("");
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/v1/message/newMessage",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("sendNewMessage", data);

        //update latestmessage in chats
        data.chat.latestMessage = data;

        let index;
        let value;
        const newChats = chats.map((chat, i) => {
          if (chat._id === data.chat._id) {
            index = i;
            chat.latestMessage = data;
            value = chat;
          }
          return chat;
        });

        newChats.splice(index, 1);
        newChats.unshift(value);

        setChats(newChats);

        if (
          chats.filter((chat) => {
            return chat._id === data.chat._id;
          }).length === 0
        ) {
          setChats([data.chat, ...chats]);
        }
        setChatData([...chatData, data]);
      } catch (err) {
        console.log(err.response.data.msg);
      }
      setNewMessage("");
    } else if (type === "img" && imageUrl) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/v1/message/newMessage",
          {
            content: imageUrl,
            chatId: selectedChat._id,
            type: "img",
          },
          config
        );

        socket.emit("sendNewMessage", data);

        //update latestmessage in chats
        data.chat.latestMessage = data;

        let index;
        let value;
        const newChats = chats.map((chat, i) => {
          if (chat._id === data.chat._id) {
            index = i;
            chat.latestMessage = data;
            value = chat;
          }
          return chat;
        });

        newChats.splice(index, 1);
        newChats.unshift(value);

        setChats(newChats);

        if (
          chats.filter((chat) => {
            return chat._id === data.chat._id;
          }).length === 0
        ) {
          setChats([data.chat, ...chats]);
        }
        setChatData([...chatData, data]);
      } catch (err) {
        notification.error({ msg: "Something went wrong" });
      }
      setNewMessage("");
      setImageUrl("");
    }
  };

  useEffect(() => {
    currentChat = selectedChat;
    if (selectedChat) {
      fetchChatData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      if (!currentChat || currentChat._id !== newMessage.chat._id) {
        setFetchAllData(!fetchAllData);

        const check = notify.filter(
          (nofi) => nofi.chat._id === newMessage.chat._id
        );

        if (check.length === 0) {
          setNotify([...notify, newMessage]);
        }
      } else {
        setChatData([...chatData, newMessage]);
      }
    });
  });

  if (!selectedChat) {
    return (
      <div className="flex justify-center items-center w-full">
        <div>
          <p className="text-4xl font-thin">Please choose a chat to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${!showChatDetail ? "w-full" : "w-ws"} pr-2`}>
      {selectedChat && (
        <div className="w-full h-14 flex pl-2 mt-3 border-b shadow-sm">
          {selectedChat.isGroupChat ? (
            selectedChat.isGroupChat &&
            selectedChat.users.some((user) =>
              friendOnline.includes(user._id)
            ) ? (
              <Badge count={" "} size="small" offset={[-10, 47]} color="green">
                <Avatar src={selectedChat.chatAvatar} className="w-14 h-14" />
              </Badge>
            ) : (
              <Avatar src={selectedChat.chatAvatar} className="w-14 h-14" />
            )
          ) : !selectedChat.isGroupChat &&
            friendOnline.includes(
              getSenderFull(user, selectedChat.users)._id
            ) ? (
            <Badge count={" "} size="small" offset={[-10, 47]} color="green">
              <Avatar
                src={getSenderFull(user, selectedChat.users).avatar}
                className="w-14 h-14"
              />
            </Badge>
          ) : (
            <Avatar
              src={getSenderFull(user, selectedChat.users).avatar}
              className="w-14 h-14"
            />
          )}
          {selectedChat.isGroupChat ? (
            <div className="text-xl font-medium ml-3">
              {selectedChat.chatName}
            </div>
          ) : (
            <div className="text-xl font-medium ml-3">
              {getSenderFull(user, selectedChat.users).name}
            </div>
          )}
          <div
            className="absolute right-4 top-6"
            onClick={() => setShowChatDetail(!showChatDetail)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#0084ff] cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </div>
        </div>
      )}
      <div className="h-[556px] block">
        {chatData && (
          <ScrollableFeed className="overflow-auto">
            {chatData.map((m, i) => (
              <div className="flex items-center text-base mt-2" key={i}>
                {(isSameSender(chatData, m, i, user._id) ||
                  isLastMessage(chatData, i, user._id)) && (
                  <Tooltip title={m.sender.name} placement="left">
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      name={m.sender.name}
                      src={m.sender.avatar}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                )}
                <div
                  className="rounded-2xl px-3 py-2"
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(chatData, m, i, user._id),
                    marginTop: isSameUser(chatData, m, i, user._id) ? 3 : 10,
                  }}
                >
                  {m.type === "text" ? (
                    m.content
                  ) : (
                    <Image
                      cloudName="dalqfcdow"
                      publicId={m.content}
                      width="300"
                      height="300"
                      crop="fill"
                    />
                  )}
                </div>
              </div>
            ))}
          </ScrollableFeed>
        )}
      </div>
      <div className="h-12 w-full absolute bottom-0 flex items-center pt-1">
        {/* Image icon */}
        <div className="mr-2 ml-4 cursor-pointer">
          <label htmlFor="file-input">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#0084ff] cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <input
              type="file"
              id="file-input"
              className="hidden"
              onChange={(e) => handleImageUpload(e)}
            />
          </label>
        </div>
        {/* emoji icon */}

        <div className="ml-2 mr-4 cursor-pointer">
          <Popover
            content={<Picker data={data} onEmojiSelect={handleSelectEmoji} />}
            trigger="click"
          >
            <div>
              <EmojiIcon />
            </div>
          </Popover>
        </div>
        <Input
          placeholder="Aa"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={sendMessage}
        />

        {/* Send icon */}
        <button
          className="mx-2 cursor-pointer hover:opacity-70"
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-[#0084ff]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
