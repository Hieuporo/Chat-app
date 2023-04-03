import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../config/socket";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [fetchUserData, setFetchUserData] = useState(false);
  const [chats, setChats] = useState([]);
  const [notify, setNotify] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [friendOnline, setFriendOnline] = useState([]);
  const [fetchFriendList, setFetchFriendList] = useState(false);
  const [invites, setInvites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [fetchInviteList, setFetchInviteList] = useState(false);
  const [fetchRequestList, setFetchRequestList] = useState(false);

  const friendOnlineRef = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserData]);

  const fetchInvite = async () => {
    if (user) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get("/api/v1/friend/invite", config);

        setInvites(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchRequest = async () => {
    if (user) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get("/api/v1/friend/request", config);

        setRequests(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvite();
      fetchRequest();
    }
  }, [user, fetchInviteList, fetchRequestList]);

  useEffect(() => {
    if (user) {
      console.log(socket.connected);
      socket.emit("setup", user);
      socket.on("connected", () => console.log("connected"));
      // eslint-disable-next-line react-hooks/exhaustive-deps

      return () => {
        console.log("disconnect");
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setSelectedChat,
        selectedChat,
        chats,
        setChats,
        setUser,
        fetchUserData,
        setFetchUserData,
        notify,
        setNotify,
        friendOnline,
        setFriendOnline,
        friendOnlineRef,
        invites,
        setInvites,
        friendList,
        setFriendList,
        fetchFriendList,
        setFetchFriendList,
        requests,
        setRequests,
        fetchInviteList,
        setFetchInviteList,
        fetchRequestList,
        setFetchRequestList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
