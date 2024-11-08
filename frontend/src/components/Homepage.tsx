import { useOutletContext } from "react-router-dom";
import cloud from "../assets/cloud-storage.png";
import { fileData, fileType } from "../types/types";
import Upload from "./Upload";

export default function HomePage() {
  const {
    files: contextFiles,
    loginStatus,
  }: { files: fileData; loginStatus: boolean } = useOutletContext();

  return (
    <div>
      <img src={cloud} alt="Cloud representing cloud storage" />
      {loginStatus ? (
        <>
          <Upload></Upload>
          <div>
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
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
