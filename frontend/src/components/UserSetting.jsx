import React, { useState } from "react";
import Infomation from "./UserSetting/Infomation";
import PasswordChange from "./UserSetting/PasswordChange";

const UserSetting = () => {
  const [option, setOption] = useState("info");

  return (
    <div className="w-wl flex">
      <div className="basis-1/4 pl-8 pt-6">
        <h1 className="text-[26px] font-semibold">Settings</h1>

        <div className="mt-6 ml-1">
          <div
            className={`text-xl font-medium select-none hover:cursor-pointer hover:opacity-80 ${
              option === "info" ? "text-blue-700" : ""
            }`}
            onClick={() => setOption("info")}
          >
            Change Infomation
          </div>
          <div
            className={`text-xl mt-4 font-medium select-none hover:cursor-pointer hover:opacity-80 ${
              option === "password" ? "text-blue-700" : ""
            }`}
            onClick={() => setOption("password")}
          >
            Change Password
          </div>
        </div>
      </div>
      {option === "info" ? <Infomation /> : <PasswordChange />}
    </div>
  );
};

export default UserSetting;
