import { Button, Modal, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import socket from "../../config/socket";
import { ChatState } from "../../context/ChatProvider";
import { FriendIcon } from "../Icons";

const IsFriend = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, fetchFriendList, setFetchFriendList } = ChatState();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleleFriend = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.delete(`/api/v1/friend/${userId}`, config);

      socket.emit("fetchFriend", userId);
      setFetchFriendList(!fetchFriendList);
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal}>
        <FriendIcon />
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        width={300}
        style={{ top: 200 }}
      >
        <div>
          <h1 className="text-2xl text-center">Unfriend</h1>
          <div className="flex justify-between mt-6">
            <Button onClick={handleCancel} className="w-28 h-10">
              No
            </Button>
            <Button onClick={deleleFriend} type="primary" className="w-28 h-10">
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IsFriend;
