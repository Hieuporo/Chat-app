import { Skeleton } from "antd";
import React from "react";

const LoadingInfo = ({ loading }) => {
  return (
    <div className="mt-8">
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </div>
  );
};

export default LoadingInfo;
