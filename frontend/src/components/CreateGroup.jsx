import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, notification, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import BadgeUser from "./BadgeUser";
import { GroupIcon, PhotoIcon, PhotoIconBig } from "./Icons";
import UserList from "./UserList";

const CreateGroup = ({ setFetchAllData, fetchAllData }) => {
  const { user } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [avatar, setAvatar] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleAvatar = (file) => {
    const pics = file.file;
    console.log(file);
    console.log(file.fileList);
    if (pics.status === "removed") {
      return;
    }
    setLoadingImage(true);
    if (pics === undefined) {
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setFileList(file.fileList);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("could_name", "dalqfcdow");

      fetch("https://api.cloudinary.com/v1_1/dalqfcdow/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatar(data.url.toString());
          setLoadingImage(false);
          return;
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    } else {
      setLoadingImage(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setAvatar("");
    setSearchValue("");
    setSearchResult([]);
    setGroupChatName("");
    setSelectedUsers([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setAvatar("");
    setSearchValue("");
    setSearchResult([]);
    setGroupChatName("");
    setSelectedUsers([]);
    setFileList([]);
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

      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createGroup = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/chat/group",
        {
          chatName: groupChatName,
          chatAvatar: avatar,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setSearchResult(data);
      setFetchAllData(!fetchAllData);
      notification.success({
        message: "Create Success!",
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setSearchResult([]);
    setGroupChatName("");
    setSelectedUsers([]);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userRemove) => {
    setSelectedUsers(() => {
      return selectedUsers.filter((user) => {
        return user._id !== userRemove._id;
      });
    });
  };

  return (
    <>
      <div onClick={showModal}>
        <GroupIcon />
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <h1 className="p-5 text-2xl text-center">Create Group</h1>
        <div className="flex mr-6">
          <Input
            placeholder="Name group"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            className="h-10"
          ></Input>
        </div>
        <div className="mr-6 my-2 shadow-lg chat">
          <Upload.Dragger
            name="avatar"
            maxCount={1}
            listType="picture"
            fileList={fileList}
            onChange={(file) => handleAvatar(file)}
            icon
            beforeUpload={() => {
              // do something with the file
              return false; // return false to prevent the action from being triggered
            }}
          >
            <div className="flex justify-center">
              <PhotoIconBig className="h-8 w-8" />
              <h1 className="text-lg ml-3">Choose Group Avatar</h1>
            </div>
          </Upload.Dragger>
        </div>
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
        <div className="flex flex-wrap mt-1">
          {selectedUsers.map((user, key) => (
            <BadgeUser user={user} handleDelete={handleDelete} key={key} />
          ))}
        </div>
        <div className="h-[200px] mr-6 overflow-auto mt-2">
          {searchResult && (
            <UserList searchResult={searchResult} handleGroup={handleGroup} />
          )}
        </div>

        <div className="flex justify-center">
          <Button
            className="mt-3 w-48 h-10 bg-cyan-200 font-medium text-lg border-none"
            onClick={createGroup}
            loading={loading || loadingImage}
          >
            {!loadingImage ? "Create" : "Uploading image"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreateGroup;
