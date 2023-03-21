import { Button, Upload } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { PhotoIcon, PhotoIconBig } from "../Icons";
import ModalItem from "../ModalItem";

const ChangePhoto = ({ setFetchAllData, setSelectedChat, fetchAllData }) => {
  const [fileList, setFileList] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [avatar, setAvatar] = useState("");
  const { selectedChat, user } = ChatState();
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleAvatar = (file) => {
    const pics = file.file;

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

  //change group ava
  const changeAvatar = async () => {
    if (avatar.trim().length === 0) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        "/api/v1/chat/changeAvatar",
        {
          chatAvatar: avatar,
          chatId: selectedChat._id,
        },
        config
      );
      setFetchAllData(!fetchAllData);
      setSelectedChat(data);
      setFileList([]);
      handleCancel();
    } catch (error) {
      console.log(error);
    }
    setAvatar("");
  };
  return (
    <ModalItem
      icon={<PhotoIcon />}
      title="Change photo"
      open={open}
      handleCancel={handleCancel}
      showModal={showModal}
    >
      <h3 className="text-center text-2xl font-semibold mb-3">
        Change group image
      </h3>
      <Upload.Dragger
        name="avatar"
        maxCount={1}
        listType="picture"
        fileList={fileList}
        onChange={(file) => handleAvatar(file)}
        className="chat"
        icon
        beforeUpload={() => {
          // do something with the file
          return false; // return false to prevent the action from being triggered
        }}
      >
        <div className="flex justify-center mt-2">
          <PhotoIconBig className="h-8 w-8" />
          <h1 className="text-lg ml-5">Choose Group Avatar</h1>
        </div>
      </Upload.Dragger>
      <div className="flex justify-end mt-4">
        <Button>Cancel</Button>
        <Button
          type="primary"
          className="ml-3"
          onClick={changeAvatar}
          loading={loadingImage}
        >
          Save
        </Button>
      </div>
    </ModalItem>
  );
};

export default ChangePhoto;
