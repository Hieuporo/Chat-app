import React, { useState } from "react";
import ChatBox from "./ChatBox";
import ChatDetail from "./ChatDetail";

const SingleChat = ({ fetchAllData, setFetchAllData }) => {
  const [showChatDetail, setShowChatDetail] = useState(false);
  return (
    <>
      <div
        className={`flex relative z-50 ${
          showChatDetail ? "flex-1" : "basis-[705px]"
        }`}
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
        />
      </div>
    </>
  );
};

export default SingleChat;
