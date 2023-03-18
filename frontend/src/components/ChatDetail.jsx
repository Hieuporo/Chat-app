import { Avatar, Button, Collapse, Input, Modal } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { getSender, getSenderFull } from "../config/handleLogic";
import { ChatState } from "../context/ChatProvider";
import DetailItem from "./DetailItem";
import {
  AddUserIcon,
  DocumentIcon,
  LeaveGroupIcon,
  MsgIcon,
  PhotoIcon,
  RemoveUserIcon,
} from "./Icons";

import UserItem from "./UserItem";
import ModalItem from "./ModalItem";

const ChatDetail = ({ showChatDetail }) => {
  const { user, selectedChat } = ChatState();

  if (!selectedChat) {
    return;
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-auto"
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
              <ModalItem icon={<MsgIcon />} title="Change chat name">
                <h3 className="text-center text-2xl font-semibold">
                  Change chat name
                </h3>
                <div className="mt-6">
                  <h2 className="mb-2">
                    Changing the name of a group chat changes it for everyone.
                  </h2>
                  <Input className="h-14"></Input>
                  <div className="flex justify-end border-none mt-4">
                    <Button>Close</Button>
                    <Button className="ml-2 bg-blue-500 text-white hover:opacity-70 active:text-black">
                      Save
                    </Button>
                  </div>
                </div>
              </ModalItem>

              <ModalItem icon={<PhotoIcon />} title="Change photo">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </ModalItem>
            </Collapse.Panel>
          )}
          {selectedChat.isGroupChat && (
            <Collapse.Panel
              header="Group options"
              className="text-base font-semibold"
              key="2"
            >
              <ModalItem icon={<AddUserIcon />} title="Add member">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </ModalItem>
              <ModalItem icon={<RemoveUserIcon />} title="Remove member">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </ModalItem>
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
