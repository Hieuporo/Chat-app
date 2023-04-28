import React, { useState } from "react";
import { Form, Input, Upload, Button, notification } from "antd";
import { ChatState } from "../../context/ChatProvider";
import { PhotoIconBig } from "../Icons";
import axios from "axios";
import socket from "../../config/socket";
import { useNavigate } from "react-router-dom";

const Infomation = () => {
  const { user, setUser, fetchUserData, setFetchUserData } = ChatState();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar);
  const [fileList, setFileList] = useState([]);

  const navigate = useNavigate();

  const handleAvatar = (file) => {
    const pics = file.file;
    if (pics.status === "removed") {
      return;
    }
    setLoading(true);
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
          setLoading(false);
          return;
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const saveChange = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        "/api/v1/user/changeInfo",
        {
          name,
          email,
          avatar,
        },
        config
      );

      socket.emit("fetchChatAfterRename", user.id);

      localStorage.setItem("userInfo", JSON.stringify(data));

      notification.success({
        message: "Updated Successfully! Reloading Page...",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="basis-3/4 ml-10 mt-10">
      <h1 className="text-2xl font-medium">Your account settings</h1>
      <div className="mt-8">
        <Form className="form-user-data" layout="vertical">
          <Form.Item label="Name" name="name" initialValue={user.name}>
            <Input
              type="text"
              className="max-w-[460px]"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email" name="email" initialValue={user.email}>
            <Input
              type="email"
              className="max-w-[460px]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <div className="mr-6 my-2 shadow-lg chat max-w-[460px] mb-6">
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
                <h1 className="text-lg ml-3">Choose New Avatar</h1>
              </div>
            </Upload.Dragger>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-40 h-9 text-base"
              onClick={saveChange}
              loading={loading}
            >
              {!loading ? "Save settings" : "Upload image"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Infomation;
