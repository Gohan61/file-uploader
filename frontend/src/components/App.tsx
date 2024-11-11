import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { fileData, fileType, folderData } from "../types/types";

export default function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [folders, setFolder] = useState<folderData>({ folders: [] });
  const [error, setError] = useState("");
  const [files, setFiles] = useState<fileData>({ data: [] });
  const [uploadFolder, setUploadFolder] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string>("main");

  function getFolders() {
    let respStatus: number;

    fetch("http://localhost:3000/folders", {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          setFolder(res);
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  function getFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    folder: string
  ) {
    if (e) {
      e.preventDefault();
    }

    let respStatus: number;

    fetch(`http://localhost:3000/folders/${folder}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          setFiles({ data: res.folder[0].files });
          setCurrentFolder(folder);
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
      <Navbar
        props={{
          loginStatus,
          setLoginStatus,
          folders,
          error,
          setFiles,
          uploadFolder,
          loading,
          getFolder,
          getFolders,
        }}
      ></Navbar>
      <Outlet
        context={{
          loginStatus,
          setLoginStatus,
          getFolders,
          files,
          setFiles,
          folders,
          uploadFolder,
          setUploadFolder,
          loading,
          setLoading,
          currentFolder,
          getFolder,
        }}
      ></Outlet>
    </>
  );
}
