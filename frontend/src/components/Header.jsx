import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Input,
  List,
  notification,
  Popover,
} from "antd";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import LoadingInfo from "./LoadingInfo";
import UserList from "./UserList";
import axios from "axios";
import { getSender } from "../config/handleLogic";
import { FriendIcon } from "./Icons";
import socket from "../config/socket";

const Header = () => {
  const {
    user,
    notify,
    invites,
    setInvites,
    fetchFriendList,
    setFetchFriendList,
    setSelectedChat,
    setNotify,
    setFetchInviteList,
    fetchInviteList,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const searchUserList = async () => {
    setLoading(true);

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

      setSearchResult(data);
    } catch (error) {
      notification.error({
        message: error.response.data.msg,
      });
    }
    setLoading(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <div className="w-36">
          <ProfileModal />
        </div>
      ),
    },
    {
      key: "2",
      label: <div className="w-36">Version 1.0.0</div>,
    },
  ];

  const handleNoti = (chat) => {
    const newNotify = notify.filter((noti) => noti.chat._id !== chat._id);
    setNotify(newNotify);
    setSelectedChat(chat);
  };

  const content = (
    <div className="w-80">
      <List
        dataSource={notify}
        renderItem={(noti) => (
          <List.Item>
            <div
              className="font-semibold px-4 py-2 hover:opacity-80 cursor-pointer text-base"
              onClick={() => handleNoti(noti.chat)}
            >
              You have a new message from{" "}
              {noti.chat.isGroupChat
                ? noti.chat.chatName
                : getSender(user, noti.chat.users)}
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  const listRequest = (
    <div className="w-[360px]">
      <List
        dataSource={invites}
        renderItem={(invite) => (
          <List.Item>
            <div className="flex items-center px-2">
              <div className="h-20 mr-4">
                <Avatar src={invite.senderId.avatar} className="w-16 h-16" />
              </div>
              <div>
                <div className="mb-3 font-medium text-base">
                  {invite.senderId.name}
                </div>
                <Button
                  type="primary"
                  className="w-28"
                  size="large"
                  onClick={() => acceptInvite(invite)}
                >
                  Confirm
                </Button>
                <Button
                  className="w-28 ml-3 border-none hover:bg-slate-300"
                  size="large"
                  onClick={() => rejectInvite(invite)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  const acceptInvite = async (invite) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.post(
        "/api/v1/friend",
        {
          userId: invite.senderId._id,
        },
        config
      );

      socket.emit("fetchFriend", invite.senderId._id);
      socket.emit("fetchRequests", invite.senderId._id);
      setFetchInviteList(!fetchInviteList);
      setFetchFriendList(!fetchFriendList);
    } catch (error) {
      notification.error({
        message: error.response.data.msg,
      });
    }
  };

  const rejectInvite = async (invite) => {
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
      setInvites(invites.filter((inv) => inv._id !== invite._id));
    } catch (error) {
      notification.error({
        message: error.response.data.msg,
      });
    }
  };

  useEffect(() => {}, [notify]);

  return (
    <div className="h-14 w-screen flex justify-between shadow-xl">
      <div className="w-14 h-14 flex items-center justify-center hover:text-gray-500 cursor-pointer">
        <Button onClick={showDrawer} className="border-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Button>
        <Drawer
          placement="left"
          width={446}
          onClose={onClose}
          open={open}
          addfriend
        >
          <div className="h-screen mr-6">
            <div className="flex">
              <Input
                placeholder="Search user on Chat App"
                className="h-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              ></Input>
              <Button onClick={searchUserList}>Search</Button>
            </div>
            {loading && <LoadingInfo />}
            {!loading && (
              <UserList searchResult={searchResult} chatAccess addfriend />
            )}
          </div>
        </Drawer>
      </div>

      <div className="logo"></div>

      {/* notify */}
      <div className="flex items-center justify-center">
        <Popover
          content={listRequest}
          title={<div className="text-lg">Friend requests</div>}
          trigger="click"
        >
          <div>
            <FriendIcon />
          </div>
        </Popover>
        <Popover
          content={content}
          title={<h1 className="text-lg font-medium">Notifications</h1>}
          trigger="click"
          className="ml-8 mr-6 text-2xl"
        >
          <Badge count={notify.length}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </Badge>
        </Popover>

        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          overlayClassName
        >
          <Avatar
            size="large"
            className="mr-4 ml-2 cursor-pointer"
            src={user.avatar}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
