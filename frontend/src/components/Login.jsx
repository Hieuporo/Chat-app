import React, { useState } from "react";
import { Input, Form, Button, notification, Upload } from "antd";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState();
  const { fetchUserData, setFetchUserData } = ChatState();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!email || !password) {
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
        "/api/v1/auth/login",
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      notification.success({
        message: "Login Success!",
        description: "Successfully Login. Please wait...",
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
    <Form>
      <Form.Item
        style={{ position: "relative" }}
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
      <div className="flex justify-center">
        <Button
          size="large"
          className="ant-submit-btn"
          style={{
            backgroundColor: "#B4E4FF",
            width: "200px",
            padding: "auto",
            border: "none",
          }}
          htmlType="submit"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Login
        </Button>
      </div>
    </Form>
  );
};

export default Login;
