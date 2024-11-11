import { fileData, GetFolder } from "../types/types";
import { useOutletContext } from "react-router-dom";
import DeleteFile from "./DeleteFile";
import UpdateFile from "./UpdateFile";

export default function File() {
  const {
    files: contextFiles,
    setFiles,
    currentFolder,
    getFolder,
  }: {
    files: fileData;
    setFiles: React.Dispatch<React.SetStateAction<fileData>>;
    currentFolder: string;
    getFolder: GetFolder;
  } = useOutletContext();

  return (
    <>
      {contextFiles.data.length === 0 ? <p>No files</p> : ""}
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
            <UpdateFile
              getFolder={getFolder}
              currentFolder={currentFolder}
              fileId={file.id}
              currentFilename={file.title}
            ></UpdateFile>
            <DeleteFile
              getFolder={getFolder}
              currentFolder={currentFolder}
              fileId={file.id}
            ></DeleteFile>
          </div>
        );
      })}
    </>
  );
}
