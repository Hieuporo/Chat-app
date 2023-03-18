import React, { useState } from "react";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Input,
  Modal,
  notification,
} from "antd";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import LoadingInfo from "./LoadingInfo";
import UserList from "./UserList";
import axios from "axios";

const Header = () => {
  const { user } = ChatState();
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
        <Drawer placement="left" onClose={onClose} open={open}>
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
            {!loading && <UserList searchResult={searchResult} chatAccess />}
          </div>
        </Drawer>
      </div>

      <div className="logo"></div>

      <div className="flex items-center justify-center">
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
        <Dropdown menu={{ items }} placement="bottomRight" overlayClassName>
          <div>
            <Avatar
              size="large"
              className="mr-4 ml-8 cursor-pointer"
              src={user.avatar}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
