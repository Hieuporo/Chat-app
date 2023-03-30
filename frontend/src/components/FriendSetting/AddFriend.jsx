import { Button, Modal, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import socket from "../../config/socket";
import { ChatState } from "../../context/ChatProvider";
import AddMember from "../GroupSetting/AddMember";
import { AddUserIcon } from "../Icons";

const AddFriend = ({ receiverId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    user,
    setFetchFriendList,
    fetchFriendList,
    fetchRequestList,
    setFetchRequestList,
  } = ChatState();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addFriend = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.post(
        "/api/v1/friend/invite/createRequest",
        { receiverId },
        config
      );

      setFetchRequestList(!fetchRequestList);
      socket.emit("fetchInvites", receiverId);
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
        <AddUserIcon />
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
          <h1 className="text-2xl text-center">Add this user as a friend</h1>
          <div className="flex justify-between mt-10">
            <Button onClick={handleCancel} className="w-36 h-10">
              No
            </Button>
            <Button onClick={addFriend} type="primary" className="w-36 h-10">
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddFriend;
