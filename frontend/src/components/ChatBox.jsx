import React, { useEffect, useState } from "react";
import { Avatar, Input } from "antd";
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

let currentChat;

const ChatBox = ({
  showChatDetail,
  setShowChatDetail,
  fetchAllData,
  setFetchAllData,
}) => {
  const { user, selectedChat, chats, setChats, notify, setNotify } =
    ChatState();
  const [chatData, setChatData] = useState([]);
  const [newMessage, setNewMessage] = useState();

  // useEffect(() => {
  //   socket.emit("setup", user);
  //   socket.on("connected", () => console.log("connected"));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps

  //   return () => {
  //     console.log("ngat ket noi");
  //     socket.disconnect();
  //   };
  // }, [user]);

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

  const sendMessage = async () => {
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
        console.log({
          selectedChat,
          newMessage,
        });

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
            <div className="w-14 h-14">
              <Avatar src={selectedChat.chatAvatar} className="w-14 h-14" />
            </div>
          ) : (
            <div className="w-14 h-14">
              <Avatar
                src={getSenderFull(user, selectedChat.users).avatar}
                className="w-14 h-14"
              />
            </div>
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
              <div className="h-10 flex items-center text-base mt-2" key={i}>
                {(isSameSender(chatData, m, i, user._id) ||
                  isLastMessage(chatData, i, user._id)) && (
                  <Avatar
                    onClick={() => console.log()}
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.avatar}
                  />
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
                  {m.content}
                </div>
              </div>
            ))}
          </ScrollableFeed>
        )}
      </div>
      <div className="h-12 w-full absolute bottom-0 flex items-center pt-1">
        {/* Image icon */}
        <div className="mr-2 ml-4 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-[#0084ff] "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        {/* emoji icon */}

        <div className="ml-2 mr-4 cursor-pointer">
          <svg
            className="w-6 h-6"
            height="20px"
            viewBox="0 0 17 16"
            width="20px"
            x="0px"
            y="0px"
          >
            <g fillRule="evenodd">
              <circle cx="5.5" cy="5.5" fill="none" r="1"></circle>
              <circle cx="11.5" cy="4.5" fill="none" r="1"></circle>
              <path
                d="M5.3 9c-.2.1-.4.4-.3.7.4 1.1 1.2 1.9 2.3 2.3h.2c.2 0 .4-.1.5-.3.1-.3 0-.5-.3-.6-.8-.4-1.4-1-1.7-1.8-.1-.2-.4-.4-.7-.3z"
                fill="none"
              ></path>
              <path
                d="M10.4 13.1c0 .9-.4 1.6-.9 2.2 4.1-1.1 6.8-5.1 6.5-9.3-.4.6-1 1.1-1.8 1.5-2 1-3.7 3.6-3.8 5.6z"
                fill="#0084ff"
              ></path>
              <path
                d="M2.5 13.4c.1.8.6 1.6 1.3 2 .5.4 1.2.6 1.8.6h.6l.4-.1c1.6-.4 2.6-1.5 2.7-2.9.1-2.4 2.1-5.4 4.5-6.6 1.3-.7 1.9-1.6 1.9-2.8l-.2-.9c-.1-.8-.6-1.6-1.3-2-.7-.5-1.5-.7-2.4-.5L3.6 1.5C1.9 1.8.7 3.4 1 5.2l1.5 8.2zm9-8.9c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-3.57 6.662c.3.1.4.4.3.6-.1.3-.3.4-.5.4h-.2c-1-.4-1.9-1.3-2.3-2.3-.1-.3.1-.6.3-.7.3-.1.5 0 .6.3.4.8 1 1.4 1.8 1.7zM5.5 5.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
                fill="#0084ff"
                fillRule="nonzero"
              ></path>
            </g>
          </svg>
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
