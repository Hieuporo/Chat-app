import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import ChatDetail from "./ChatDetail";

const SingleChat = ({ fetchAllData, setFetchAllData }) => {
  const [showChatDetail, setShowChatDetail] = useState(false);

  return (
    <>
      <div
        className={`flex relative z-50 ${!showChatDetail ? "w-wd" : "flex-1"}`}
      >
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
          setShowChatDetail={setShowChatDetail}
        />
      </div>
    </>
  );
};

export default SingleChat;
