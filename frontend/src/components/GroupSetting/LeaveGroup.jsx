import React, { useState } from "react";
import { LeaveGroupIcon } from "../Icons";
import { Button, Modal } from "antd";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const LeaveGroup = ({
  fetchAllData,
  setFetchAllData,
  showChatDetail,
  setShowChatDetail,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleGroupName = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.patch(
        "/api/v1/chat/leaveGroup",
        {
          chatId: selectedChat._id,
        },
        config
      );
      handleCancel();
      setFetchAllData(!fetchAllData);
      setSelectedChat();
      setShowChatDetail(!showChatDetail);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ml-3 mt-2">
      <div onClick={showModal} className="flex">
        <LeaveGroupIcon />
        <div className="ml-3 text-base font-semibold ">Leave group</div>
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        width={400}
        style={{ top: 200 }}
      >
        <div>
          <h1 className="text-2xl text-center">Leave group</h1>
          <div className="flex justify-between mt-10">
            <Button onClick={handleCancel} className="w-36 h-10">
              No
            </Button>
            <Button
              type="primary"
              onClick={handleGroupName}
              className="w-36 h-10"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveGroup;
