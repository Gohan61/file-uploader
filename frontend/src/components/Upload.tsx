import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { folderData } from "../types/types";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const { folders: folderList }: { folders: folderData } = useOutletContext();
  const [uploadFolder, setUploadFolder] = useState<number>(
    () => folderList.folders[0].id
  );
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files;
    if (file) {
      setFile(file[0]);
    }
  }

  function uploadFile(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setLoading(true);
    let respStatus: number;
    const dateTime = Date.now().toString();

    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("sendTime", dateTime);
    formData.append("folderId", uploadFolder.toString());

    fetch("http://localhost:3000/files/newfile", {
      mode: "cors",
      method: "POST",

      body: formData,
      credentials: "include",
    })
      .then((res) => {
        setLoading(false);
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          setFile(null);
          setUploadMessage("Upload succesfull");
          (() => setTimeout(() => setUploadMessage(""), 5000))();
          setFileInputKey(Date.now());
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        setFile(null);
        setUploadMessage("Upload failed");
        (() => setTimeout(() => setUploadMessage(""), 5000))();
        setFileInputKey(Date.now());

        setError(err);
      });
  }

  return (
    <div>
      <form action="" method="POST" encType="multipart/form-data">
        <label htmlFor="file">Click to pick a new file</label>
        <input
          type="file"
          name="file"
          id="file"
          key={fileInputKey}
          required
          onChange={(e) => handleFile(e)}
        />
        <label htmlFor="folder">Select a folder</label>
        <select
          name="folder"
          id="folder"
          defaultValue={"main"}
          value={uploadFolder}
          onChange={(e) => setUploadFolder(Number(e.target.value))}
        >
          {folderList.folders.map((folder) => {
            return (
              <option key={folder.id} value={folder.id}>
                {folder.title}
              </option>
            );
          })}
        </select>
        <button onClick={(e) => uploadFile(e)}>Upload new file</button>
      </form>
      {loading ? <p>Loading</p> : ""}
      {uploadMessage ? <p>{uploadMessage}</p> : ""}
      {error ? <p>{error}</p> : ""}
    </div>
  );
}
