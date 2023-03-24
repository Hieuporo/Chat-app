import { Button, Input, notification } from "antd";
import React, { useState } from "react";
import { AddUserIcon } from "../Icons";
import ModalItem from "../ModalItem";
import UserList from "../UserList";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import socket from "../../config/socket";

const AddMember = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const { selectedChat, setSelectedChat, user } = ChatState();
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    setSearchResult([]);
  };
  const searchUserList = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `/api/v1/user?search=${searchValue}`,
        config
      );

      const result = data.filter(
        (item) => !selectedChat.users.some((item2) => item._id === item2._id)
      );
      setSearchResult(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroup = async (userInfo) => {
    if (selectedChat.groupAdmin !== user._id) {
      notification.error({
        message: "Only admin can do this",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.patch(
        "/api/v1/chat/addMember",
        { chatId: selectedChat._id, userId: userInfo._id },
        config
      );
      socket.emit("addUser", userInfo._id);
      setSelectedChat(data);
      // out modal
      handleCancel();

      notification.success({
        message: " Add successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalItem
      icon={<AddUserIcon />}
      title="Add member"
      open={open}
      handleCancel={handleCancel}
      showModal={showModal}
    >
      <h3 className="text-center text-2xl font-semibold mb-3">Add member</h3>
      <div className="flex mr-6 mt-2">
        <Input
          placeholder="Search user to add"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-10"
        ></Input>
        <Button className="h-10" onClick={searchUserList}>
          Search
        </Button>
      </div>
      <div className="h-[240px] mr-6 overflow-auto mt-2">
        <UserList searchResult={searchResult} handleGroup={handleGroup} />
      </div>
    </ModalItem>
  );
};

export default AddMember;
