import React, { useState } from "react";
import { fileData, GetFolder } from "../types/types";
import { useOutletContext } from "react-router-dom";

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
  const [error, setError] = useState();

  function deleteFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileId: number
  ) {
    e.preventDefault();
    let respStatus: number;

    fetch(`http://localhost:3000/files/${fileId}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          getFolder(undefined, currentFolder);
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  function updateFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileId: number,
    folder: string,
    newTitle: string
  ) {
    let respStatus: number;
    e.preventDefault();

    fetch(`http://localhost:3000/files/${fileId}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newTitle: newTitle,
        newFolder: folder,
      }),
      credentials: "include",
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          getFolder(undefined, currentFolder);
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

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
            <button onClick={(e) => deleteFile(e, file.id)}>Delete file</button>
          </div>
        );
      })}
      {error ? <p>{error}</p> : ""}
    </>
  );
}
