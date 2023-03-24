import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import ChatBox from "./ChatBox";
import ChatDetail from "./ChatDetail";

const SingleChat = ({ fetchAllData, setFetchAllData }) => {
  const [showChatDetail, setShowChatDetail] = useState(true);
  return (
    <>
      <div className="flex flex-1">
        <ChatBox
          fetchAllData={fetchAllData}
          setFetchAllData={setFetchAllData}
          showChatDetail={showChatDetail}
          setShowChatDetail={setShowChatDetail}
        />
        <ChatDetail
          fetchAllData={fetchAllData}
          setFetchAllData={setFetchAllData}
          showChatDetail={showChatDetail}
        />
      </div>
    </>
  );
};

export default SingleChat;
