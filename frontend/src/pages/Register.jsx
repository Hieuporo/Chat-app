import React from "react";
import { Tabs } from "antd";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Register = () => {
  const items = [
    {
      key: "1",
      label: `Login`,
      children: <Login />,
    },
    {
      key: "2",
      label: `Sign up`,
      children: <Signup />,
    },
  ];

  return (
    <div className="register-container flex justify-center items-center">
      <div className="bg-white flex lg:w-[500px] rounded-xl shadow-lg shadow-slate-400">
        <div className="block mx-8 mb-6 mt-3 w-full">
          <Tabs
            defaultActiveKey="1"
            items={items}
            className="font-medium text-2xl"
          ></Tabs>
        </div>
      </div>
    </div>
  );
};

export default Register;
