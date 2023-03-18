import { Modal } from "antd";
import React, { useState } from "react";
import DetailItem from "./DetailItem";

const ModalItem = ({ children, icon, title }) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <div onClick={showModal}>
        <DetailItem icon={icon} title={title} />
      </div>
      <Modal
        style={{ top: 200 }}
        open={open}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        {children}
      </Modal>
    </div>
  );
};

export default ModalItem;
