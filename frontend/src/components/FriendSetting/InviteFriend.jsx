import { Button, Modal, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import socket from "../../config/socket";
import { ChatState } from "../../context/ChatProvider";
import { CancelRequest } from "../Icons";

const InviteFriend = ({ invite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    user,
    setFetchFriendList,
    fetchFriendList,
    fetchInviteList,
    setFetchInviteList,
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

  const removeRequest = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.delete(
        `/api/v1/friend/invite/delelteRequest/${invite._id}`,
        config
      );

      socket.emit("fetchRequests", invite.senderId._id);
      setFetchInviteList(!fetchInviteList);
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
    }
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
        "/api/v1/friend",
        { userId: invite.senderId._id },
        config
      );

      socket.emit("fetchFriend", invite.senderId._id);
      socket.emit("fetchInvites", invite.senderId._id);
      setFetchInviteList(!fetchInviteList);
      setFetchRequestList(!fetchRequestList);
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
        <CancelRequest />
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
          <h1 className="text-2xl text-center">Accept friend request</h1>
          <div className="flex justify-between mt-10">
            <Button onClick={removeRequest} className="w-36 h-10">
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

export default InviteFriend;
