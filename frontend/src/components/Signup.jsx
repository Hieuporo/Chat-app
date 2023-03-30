import React, { useState } from "react";
import { Input, Form, Button, notification, Upload } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import socket from "../config/socket";

const Signup = () => {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState();
  const [loading, setLoading] = useState();
  const [avatar, setAvatar] = useState();
  const { fetchUserData, setFetchUserData } = ChatState();

  const navigate = useNavigate();

  const handleAvatar = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!email || !password || !name) {
      notification.error({
        message: "Please provide all fields!",
      });
      setIsLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/auth/signup",
        { email, password, name, avatar },
        config
      );
      socket.connect();
      localStorage.setItem("userInfo", JSON.stringify(data));

      notification.success({
        message: "Sign up successful!",
        description: "Successfully Sign up. Please wait...",
      });
      setFetchUserData(!fetchUserData);
      navigate("/home");
    } catch (error) {
      notification.error({
        message: error.response.data.msg,
      });
    }
    setIsLoading(false);
  };
  return (
    <div className="">
      <Form>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ message: "Please enter your name" }]}
          labelCol={{ span: 5 }}
          labelAlign="left"
        >
          <Input
            placeholder="Enter Your Name"
            className="input-form"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ message: "Please enter your email" }]}
          labelCol={{ span: 5 }}
          labelAlign="left"
        >
          <Input
            placeholder="Enter Your Email"
            className="input-form"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ message: "Please enter your password" }]}
          labelCol={{ span: 5 }}
          labelAlign="left"
        >
          <Input.Password
            placeholder="Enter Your Password"
            className="input-form"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <div className="w-[400px]">
          <Upload.Dragger
            className="h-8"
            name="avatar"
            listType="picture"
            loading={true}
            onChange={(file) => handleAvatar(file.file)}
            beforeUpload={() => {
              // do something with the file
              return false; // return false to prevent the action from being triggered
            }}
          >
            <div className="w-2/12 inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <div className="text-lg w-8/12 inline-block text-center relative -top-2 text-gray-400">
              Choose Your Avatar
            </div>
          </Upload.Dragger>
        </div>

        <div className="flex justify-center mt-2">
          <Button
            size="large"
            className="ant-submit-btn"
            style={{
              backgroundColor: "#B4E4FF",
              border: "none",
              width: "200px",
              padding: "auto",
            }}
            htmlType="submit"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
