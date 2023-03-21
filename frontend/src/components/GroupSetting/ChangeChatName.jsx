import { Button, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { MsgIcon } from "../Icons";
import ModalItem from "../ModalItem";

const ChangeChatName = ({ setFetchAllData, setSelectedChat, fetchAllData }) => {
  const [groupName, setGroupName] = useState();
  const { selectedChat, user } = ChatState();

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleGroupName = async () => {
    if (groupName.trim().length === 0) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        "/api/v1/chat/rename",
        {
          chatName: groupName,
          chatId: selectedChat._id,
        },
        config
      );
      setFetchAllData(!fetchAllData);
      setSelectedChat(data);
      handleCancel();
    } catch (error) {
      console.log(error);
    }
    setGroupName("");
  };

  return (
    <ModalItem
      icon={<MsgIcon />}
      title="Change chat name"
      open={open}
      handleCancel={handleCancel}
      showModal={showModal}
    >
      <h3 className="text-center text-2xl font-semibold">Change chat name</h3>
      <div className="mt-6">
        <h2 className="mb-2">
          Changing the name of a group chat changes it for everyone.
        </h2>
        <Input
          placeholder="Chat Name"
          className="h-14"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        ></Input>
      </div>
      <div className="flex justify-end mt-4">
        <Button>Cancel</Button>
        <Button type="primary" className="ml-3" onClick={handleGroupName}>
          Save
        </Button>
      </div>
    </ModalItem>
  );
};

export default ChangeChatName;
