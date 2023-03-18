import React from "react";
import { Badge, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const BadgeUser = ({ user, handleDelete }) => {
  return (
    <span>
      <Badge className="bg-cyan-400 p-2 rounded-3xl flex items-center mx-1 mt-1">
        <div className="pr-2 text-white font-medium">{user.name}</div>
        <button onClick={() => handleDelete(user)}>
          <CloseOutlined className="text-white" />
        </button>
      </Badge>
    </span>
  );
};
export default BadgeUser;
