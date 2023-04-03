import { notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { RemoveUserIcon } from "../Icons";
import ModalItem from "../ModalItem";
import UserList from "../UserList";
import socket from "../../config/socket";

const RemoveMember = () => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    fetchFriendList,
    setFetchFriendList,
  } = ChatState();
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleGroup = async (userInfo) => {
    if (selectedChat.groupAdmin !== user._id) {
      notification.error({
        message: "Only admin can do this",
      });
      return;
    }

    if (userInfo._id === user._id) {
      notification.error({
        message: "You can't remove yourself",
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
        "/api/v1/chat/removeMember",
        { chatId: selectedChat._id, userId: userInfo._id },
        config
      );

      socket.emit("removeUser", userInfo._id);
      data.users.forEach((user) =>
        socket.emit("fetchGroup", { id: user._id, chat: data })
      );
      setFetchFriendList(!fetchFriendList);
      setSelectedChat(data);
      handleCancel();
      notification.success({
        message: " Remove successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalItem
      icon={<RemoveUserIcon />}
      title="Remove member"
      open={open}
      handleCancel={handleCancel}
      showModal={showModal}
    >
      <h3 className="text-center text-2xl font-semibold mb-3">Remove member</h3>
      <p className="text-lg ml-3">Click to delete your member</p>
      <div className="h-[340px] mr-6 overflow-auto mt-2">
        <UserList searchResult={selectedChat.users} handleGroup={handleGroup} />
      </div>
    </ModalItem>
  );
};

export default RemoveMember;
