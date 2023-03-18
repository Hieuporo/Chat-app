import React, { useState } from "react";
import { Modal, Button, Avatar } from "antd";
import { ChatState } from "../context/ChatProvider";

const ProfileModal = () => {
  const { user } = ChatState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal}>User Information</div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <h1 className="p-5 text-2xl text-center">Your information</h1>

        <div className="flex mt-4 p-5">
          <Avatar src={user.avatar} className="w-28 h-28" />
          <div className="ml-8">
            <div className="font-medium text-2xl">{user.name}</div>
            <div className="text-lg">Email: {user.email}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;
