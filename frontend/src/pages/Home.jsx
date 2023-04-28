import Header from "../components/Header";
import MyChats from "../components/MyChats";
import SingleChat from "../components/SingleChat";
import NavigationBar from "../components/NavigationBar";
import { ChatState } from "../context/ChatProvider";
import { useEffect, useState } from "react";
import ListFriend from "../components/ListFriend";
import UserSetting from "../components/UserSetting";
import socket from "../config/socket";

const Home = () => {
  const { user } = ChatState();
  const [page, setPage] = useState("chat");
  const [fetchAllData, setFetchAllData] = useState(false);

  return (
    <div>
      {user && <Header />}
      {user && (
        <div className="flex h-vh">
          <NavigationBar setPage={setPage} />
          {page === "chat" ? (
            <>
              <MyChats
                fetchAllData={fetchAllData}
                setFetchAllData={setFetchAllData}
              />
              <SingleChat
                fetchAllData={fetchAllData}
                setFetchAllData={setFetchAllData}
              />
            </>
          ) : (
            <UserSetting />
          )}
          <ListFriend />
        </div>
      )}
    </div>
  );
};

export default Home;
