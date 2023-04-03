import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const ImageList = () => {
  const [images, setImages] = useState([]);
  const [selectImage, setSelectImage] = useState();
  const { selectedChat, user } = ChatState();

  const getImages = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `/api/v1/message/images/${selectedChat._id}`,
        config
      );

      setImages(data);
    } catch (error) {
      notification.error({ message: "Something went wrong!s" });
    }
  };

  useEffect(() => {
    getImages();
  }, [selectedChat]);

  return (
    <div className="flex flex-wrap">
      {images.map((publicId) => (
        <div class="w-2/6 h-[107px] aspect-w-1 aspect-h-1">
          <img
            src={publicId.content}
            className="object-cover w-full h-full"
            alt="img"
            onClick={() => setSelectImage(publicId.content)}
          />
        </div>
      ))}
      {selectImage && (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center">
          <div className="h-full w-2/5 flex items-center">
            <img alt="img" src={selectImage} className="object-cover"></img>
          </div>
          <div className="absolute right-12 top-6 hover:opacity-50">
            <CloseOutlined
              className="text-3xl"
              onClick={() => setSelectImage()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageList;
