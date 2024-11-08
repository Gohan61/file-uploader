import React, { useState } from "react";
import { fileData } from "../types/types";
import { useOutletContext } from "react-router-dom";

export default function File() {
  const {
    files: contextFiles,
    setFiles,
  }: {
    files: fileData;
    setFiles: React.Dispatch<React.SetStateAction<fileData>>;
  } = useOutletContext();
  const [error, setError] = useState();

  function deleteFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileId: number
  ) {
    e.preventDefault();
    let respStatus: number;
    const fileIndex = contextFiles.data.findIndex((file) => file.id === fileId);
    const newFiles = contextFiles.data.toSpliced(fileIndex, 1);

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
          setFiles({ data: newFiles });
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
