import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { fileData, folderData } from "../types/types";
import cloud from "../assets/cloud-storage.png";
import { Link } from "react-router-dom";

export default function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [folders, setFolder] = useState<folderData>({ folders: [] });
  const [error, setError] = useState("");
  const [files, setFiles] = useState<fileData>({ data: [] });
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<number>();
  const [uploadFolder, setUploadFolder] = useState<number | undefined>(
    currentFolder
  );

  useEffect(() => {
    if (localStorage.getItem("sessionPresent")) {
      (() => {
        setLoginStatus(true);
        getFolders().then((res) => {
          getFolder(undefined, res[0].id);
        });
      })();
    }
  }, [loginStatus]);

  async function getFolders() {
    let respStatus: number;

    return fetch("http://localhost:3000/folders", {
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
          return res.folders;
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  async function getFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    folder: number
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
          setCurrentFolder(res.folder[0].id);
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
      <div className="shadow-sm bg-sky-900 flex p-2 items-center justify-center sticky top-0 z-20">
        <img
          src={cloud}
          alt="Cloud representing cloud storage"
          className="w-16 object-contain"
        />
        <h1 className="text-3xl text-center  font-black text-white font-mono">
          <Link to={"/home"}>The Closed Box</Link>
        </h1>
      </div>
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
          setCurrentFolder,
          setUploadFolder,
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
