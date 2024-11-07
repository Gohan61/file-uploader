import { useOutletContext } from "react-router-dom";
import cloud from "../assets/cloud-storage.png";
import { fileData, fileType } from "../types/types";

export default function HomePage() {
  const {
    files: contextFiles,
    loginStatus,
  }: { files: fileData; loginStatus: boolean } = useOutletContext();

  return (
    <div>
      <img src={cloud} alt="Cloud representing cloud storage" />
      {loginStatus ? (
        <div> {contextFiles.data.length === 0 ? <p>No files</p> : ""}</div>
      ) : (
        ""
      )}
    </div>
  );
}
