import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import ChatBox from "./ChatBox";
import ChatDetail from "./ChatDetail";

const SingleChat = () => {
  const [showChatDetail, setShowChatDetail] = useState(true);
  const { selectedChat } = ChatState();
  return (
    <>
      {selectedChat && (
        <div className="flex flex-1">
          <ChatBox
            showChatDetail={showChatDetail}
            setShowChatDetail={setShowChatDetail}
          />
          <ChatDetail showChatDetail={showChatDetail} />
        </div>
      )}
    </>
  );
};

export default SingleChat;
