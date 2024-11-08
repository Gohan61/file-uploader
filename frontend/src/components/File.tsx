import { fileData } from "../types/types";
import { useOutletContext } from "react-router-dom";

export default function File() {
  const { files: contextFiles }: { files: fileData } = useOutletContext();

  return (
    <>
      <p> {contextFiles.data.length === 0 ? <p>No files</p> : ""}</p>
      {contextFiles.data.map((file) => {
        return (
          <div key={file.id}>
            <h3>{file.title}</h3>
            <p>
              <span>Created at: </span>
              {file.createdAt}
            </p>
            <p>
              <span>Size: </span>
              {file.size}
            </p>
            <p>
              <span>Upload time: </span>
              {file.uploadTime} seconds
            </p>
          </div>
        );
      })}
    </>
  );
}
