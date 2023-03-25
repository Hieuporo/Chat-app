import { Avatar, Collapse } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { getSender, getSenderFull } from "../config/handleLogic";
import { ChatState } from "../context/ChatProvider";
import DetailItem from "./DetailItem";
import { DocumentIcon, LeaveGroupIcon, PhotoIcon } from "./Icons";

import UserItem from "./UserItem";
import ChangeChatName from "./GroupSetting/ChangeChatName";
import ChangePhoto from "./GroupSetting/ChangePhoto";
import AddMember from "./GroupSetting/AddMember";
import RemoveMember from "./GroupSetting/RemoveMember";

const ChatDetail = ({ showChatDetail, fetchAllData, setFetchAllData }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {}, [selectedChat]);

  if (!selectedChat) {
    return;
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-auto bg-white"
      style={{ display: showChatDetail ? "flex" : "none" }}
    >
      <div className="mt-10 w-full h-40 block">
        {selectedChat.isGroupChat ? (
          <div className="flex justify-center">
            <Avatar src={selectedChat.chatAvatar} className="w-20 h-20" />
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar
              src={getSenderFull(user, selectedChat.users).avatar}
              className="w-20 h-20"
            />
          </div>
        )}
        {selectedChat.isGroupChat ? (
          <div className="text-center font-medium text-lg">
            {selectedChat.chatName}
          </div>
        ) : (
          <div className="text-center font-medium text-lg">
            {getSender(user, selectedChat.users)}
          </div>
        )}
      </div>
      <div>
        <Collapse
          bordered={false}
          ghost={true}
          className="cursor-pointer"
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <CaretUpOutlined
              rotate={isActive ? 0 : 180}
              style={{ fontSize: "18px" }}
            />
          )}
        >
          {selectedChat.isGroupChat && (
            <Collapse.Panel
              header="Customize chat"
              key="1"
              className="text-base font-semibold"
            >
              {/* Change chat name */}
              <ChangeChatName
                setFetchAllData={setFetchAllData}
                setSelectedChat={setSelectedChat}
                fetchAllData={fetchAllData}
              />
              {/* change group image */}
              <ChangePhoto
                setFetchAllData={setFetchAllData}
                setSelectedChat={setSelectedChat}
                fetchAllData={fetchAllData}
              />
            </Collapse.Panel>
          )}
          {selectedChat.isGroupChat && (
            <Collapse.Panel
              header="Group options"
              className="text-base font-semibold"
              key="2"
            >
              {/* add member */}
              <AddMember />
              {/* remove member */}
              <RemoveMember />
            </Collapse.Panel>
          )}
          {selectedChat.isGroupChat && (
            <Collapse.Panel
              header="Chat members"
              className="text-base font-semibold"
              key="3"
            >
              <UserItem />
            </Collapse.Panel>
          )}
          <Collapse.Panel
            header="Media files"
            className="text-base font-semibold"
            key="4"
          >
            <DetailItem icon={<PhotoIcon />} isFirst={true} title="Media" />
            <DetailItem icon={<DocumentIcon />} title="Files" />
          </Collapse.Panel>
        </Collapse>
        {selectedChat.isGroupChat && (
          <DetailItem icon={<LeaveGroupIcon />} title="Leave group" isLeave />
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
