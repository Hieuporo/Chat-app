import React from "react";

const DetailItem = ({ icon, title, isFirst, isLeave }) => {
  if (isFirst) {
    return (
      <div className="flex pb-3">
        <div>{icon}</div>
        <h3 className="ml-4">{title}</h3>
      </div>
    );
  }

  if (isLeave) {
    return (
      <div className="flex pb-3 pt-2 ml-3">
        <div>{icon}</div>
        <h3 className="ml-4 font-semibold cursor-pointer">{title}</h3>
      </div>
    );
  }

  return (
    <div className="flex py-3">
      <div>{icon}</div>
      <h3 className="ml-4">{title}</h3>
    </div>
  );
};

export default DetailItem;
