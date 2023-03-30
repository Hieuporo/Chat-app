import { Button, Modal, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import socket from "../../config/socket";
import { ChatState } from "../../context/ChatProvider";
import { RemoveUserIcon } from "../Icons";

const CancelRequest = ({ request }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, fetchRequestList, setFetchRequestList } = ChatState();

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
      const { data } = await axios.delete(
        `/api/v1/friend/invite/delelteRequest/${request._id}`,
        config
      );

      setFetchRequestList(!fetchRequestList);
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal} className="cursor-pointer">
        <RemoveUserIcon />
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
          <h1 className="text-2xl text-center">Remove friend request</h1>
          <div className="flex justify-evenly mt-10">
            <Button className="w-36 h-10">No</Button>
            <Button
              type="primary"
              className="w-36 h-10"
              onClick={removeRequest}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CancelRequest;
