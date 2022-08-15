import { SanityAssetDocument } from "@sanity/client";
import React, { useEffect } from "react";
import { AiFillDelete as DeleteIcon } from "react-icons/ai";

interface Props {
  discardFile: (url: string) => void;
  url: string;
  fileState: {
    file: File;
    url: string;
    asset?: SanityAssetDocument | undefined;
  };
}
const MediaPreview = ({ discardFile, url, fileState }: Props) => {
  const imgTypes = ["png", "jpg", "gif", "jpeg"];
  const vidTypes = ["mp4", "mov"];

  const fileType = fileState.file.name.split(".").pop();

  console.log("fileType", fileType);

  return (
    <div className="file-container relative max-h-[32rem] col-span-1">
      <span
        className="discard z-20 cursor-pointer bg-[rgba(44,44,44,0.9)] absolute top-2 left-2 p-2 rounded-full shadow-lg"
        onClick={() => discardFile(url)}
      >
        <DeleteIcon className="text-xl text-[#fff]" />
      </span>
      {fileType && imgTypes.includes(fileType) && (
        <img
          src={url}
          alt=""
          className="rounded-xl h-[12rem] w-full object-cover"
        />
      )}
      {fileType && vidTypes.includes(fileType) && (
        <video src={url} className="rounded-xl h-[12rem] w-full object-cover" />
      )}
    </div>
  );
};

export default MediaPreview;
