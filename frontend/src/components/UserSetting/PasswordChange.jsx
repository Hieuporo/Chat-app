import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

const PasswordChange = () => {
  const { user, fetchUserData, setFetchUserData } = ChatState();

  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const saveChange = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        "/api/v1/auth/changePassword",
        {
          password,
          newPassword,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setFetchUserData(!fetchUserData);
      notification.success({
        message: "Updated Successfully!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="basis-3/4 ml-10 mt-10">
      <h1 className="text-2xl font-medium">Change password</h1>
      <div className="mt-8">
        <Form className="form-user-data" layout="vertical">
          <Form.Item label="Password" name="password">
            <Input
              type="password"
              className="max-w-[460px]"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Item>
          <Form.Item label="Password confirm" name="Confirm Password">
            <Input
              type="password"
              className="max-w-[460px]"
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-40 h-9 text-base mt-3"
              onClick={saveChange}
            >
              Save settings
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordChange;
