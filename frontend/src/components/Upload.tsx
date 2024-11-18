import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { folderData } from "../types/types";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const { folders: folderList }: { folders: folderData } = useOutletContext();
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [collapse, setCollapse] = useState(false);

  const {
    uploadFolder,
    setUploadFolder,
    loading,
    setLoading,
  }: {
    uploadFolder: number | undefined;
    setUploadFolder: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  } = useOutletContext();

  useEffect(() => {
    if (folderList.folders.length != 0) {
      setUploadFolder(folderList.folders[0].id);
    }
  }, [folderList.folders]);

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
    if (uploadFolder) {
      formData.append("folderId", uploadFolder.toString());
    }

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
          setUploadMessage("Upload successful");
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
    <div className="flex flex-column flex-wrap justify-center p-3 pt-5 bg-sky-50 w-screen z-10 relative">
      {collapse ? (
        <>
          <form
            action=""
            method="POST"
            encType="multipart/form-data"
            className="flex flex-column w-[300px] flex-wrap gap-2"
          >
            <label htmlFor="file" className="font-bold text-lg">
              Click to pick a new file
            </label>
            <input
              type="file"
              name="file"
              id="file"
              key={fileInputKey}
              required
              onChange={(e) => {
                handleFile(e);
                setError("");
              }}
              className="file:rounded-md file:bg-slate-600 file:text-white italic"
            />
            <label htmlFor="folder" className="text-lg">
              Select a folder
            </label>
            <select
              name="folder"
              id="folder"
              value={uploadFolder}
              onChange={(e) => setUploadFolder(Number(e.target.value))}
              className="rounded-md border"
            >
              {folderList.folders.map((folder) => {
                return (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                );
              })}
            </select>
            <button
              onClick={(e) => uploadFile(e)}
              className="px-2 py-1 border-2 rounded-md h-fit bg-sky-800 text-white"
            >
              Upload new file
            </button>
          </form>
          {loading ? <p>Loading</p> : ""}
          {uploadMessage ? (
            <p className="mt-2 w-full text-center">{uploadMessage}</p>
          ) : (
            ""
          )}
          {error ? <p className="mt-2 w-full text-center">{error}</p> : ""}
          <button
            onClick={() => setCollapse(false)}
            className="absolute top-5 right-5"
          >
            {"Collapse"}
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setCollapse(true);
            setError("");
          }}
          className="text-lg px-2 py-1 border-2 rounded-md h-fit bg-sky-800 text-white"
        >
          Upload
        </button>
      )}
    </div>
  );
}
