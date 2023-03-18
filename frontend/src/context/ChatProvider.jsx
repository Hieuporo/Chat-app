import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [fetchUserData, setFetchUserData] = useState(false);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);
    } else {
      navigate("/");
    }
  }, [fetchUserData]);

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
