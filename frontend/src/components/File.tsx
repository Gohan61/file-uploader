import { fileData, GetFolder } from "../types/types";
import { useOutletContext } from "react-router-dom";
import DeleteFile from "./DeleteFile";
import UpdateFile from "./UpdateFile";
import { useState } from "react";
import GetFile from "./GetFile";

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
  const [showFileDetails, setShowFileDetails] = useState(false);

  return (
    <>
      {contextFiles.data.length === 0 ? <p>No files</p> : ""}
      {contextFiles.data.map((file) => {
        return (
          <div key={file.id}>
            <h3>{file.title}</h3>
            <GetFile fileId={file.id} fileTitle={file.title}></GetFile>
            <button onClick={() => setShowFileDetails(!showFileDetails)}>
              {showFileDetails ? "Hide" : "Show details"}
            </button>
            {showFileDetails ? (
              <>
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
                {file.updatedAt ? (
                  <p>
                    <span>Updated at: </span>
                    {file.updatedAt}
                  </p>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
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
              fileTitle={file.title}
            ></DeleteFile>
          </div>
        );
      })}
    </>
  );
}
