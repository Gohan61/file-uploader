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
        console.log(res);

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
        }}
      ></Navbar>
      <Outlet
        context={{
          loginStatus,
          setLoginStatus,
          getFolders,
          files,
          folders,
          uploadFolder,
          setUploadFolder,
          loading,
          setLoading,
        }}
      ></Outlet>
    </>
  );
}
