import Header from "../components/Header";
import MyChats from "../components/MyChats";
import SingleChat from "../components/SingleChat";
import NavigationBar from "../components/NavigationBar";
import { ChatState } from "../context/ChatProvider";
import { useEffect, useState } from "react";

const Home = () => {
  const { user } = ChatState();
  const [page, setPage] = useState("chat");
  const [fetchAllData, setFetchAllData] = useState(false);

  console.log(fetchAllData);

  return (
    <div>
      {user && <Header />}
      {user && (
        <div className="flex h-vh">
          <NavigationBar setPage={setPage} />
          {page === "chat" && (
            <>
              <MyChats
                fetchAllData={fetchAllData}
                setFetchAllData={setFetchAllData}
              />
              <SingleChat
                fetchAllDat={fetchAllData}
                setFetchAllData={setFetchAllData}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
