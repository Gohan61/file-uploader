import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../types/types";
import {
  fileData,
  folderData,
  Folders,
  folderType,
  GetFolder,
} from "../types/types";
import Folder from "./NewFolder";
import DeleteFolder from "./DeleteFolder";
import UpdateFolder from "./UpdateFolder";

export default function Navbar({
  props,
}: {
  props: {
    loginStatus: boolean;
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
    folders: folderData;
    error: string | undefined;
    setFiles: React.Dispatch<React.SetStateAction<fileData>>;
    uploadFolder: number | undefined;
    loading: boolean;
    getFolder: GetFolder;
    getFolders: Folders;
  };
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let folderTitle;
    props.folders.folders.map((folder) => {
      if (folder.id === props.uploadFolder) {
        return (folderTitle = folder.title);
      }
    });

    if (folderTitle) {
      props.getFolder(undefined, folderTitle);
    }
  }, [props.loading]);

  function logout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    let respStatus: number;

    fetch("http://localhost:3000/logout", {
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
          props.setLoginStatus(false);
          navigate("/home");
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
      {props.loginStatus ? (
        <nav className="text-lg bg-slate-50">
          <ul className="bg-sky-50 border-b-2 border-gray-950 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
            {props.folders.folders.map((folder: folderType) => {
              return (
                <li
                  key={folder.id}
                  className="p-[10px] grid grid-rows-2 grid-columns-2"
                >
                  <button
                    onClick={(e) => {
                      props.getFolder(e, folder.title);
                    }}
                    className="col-start-1 col-end-3 border-b-2 border-cyan-900 mb-2"
                  >
                    {folder.title}
                  </button>
                  {folder.title === "main" ? (
                    ""
                  ) : (
                    <>
                      <UpdateFolder
                        folderTitle={folder.title}
                        getFolders={props.getFolders}
                        folderId={folder.id}
                      ></UpdateFolder>
                      <DeleteFolder
                        folderTitle={folder.title}
                        getFolders={props.getFolders}
                      ></DeleteFolder>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex h-10 items-center p-2">
            <Folder getFolders={props.getFolders}></Folder>
            <button
              onClick={(e) => logout(e)}
              className="px-2 border-2 rounded-md h-fit ml-auto bg-sky-800 text-white"
            >
              Logout
            </button>
          </div>
          {error ? <p>{error}</p> : ""}
          {props.error ? <p>{props.error}</p> : ""}
        </nav>
      ) : (
        <div className="flex justify-around bg-slate-700 md:justify-center md:gap-16">
          <Link to={"/signup"} className="text-white font-bold">
            Sign up
          </Link>
          <Link to={"/signin"} className="text-white font-bold">
            Sign in
          </Link>
        </div>
      )}
    </>
  );
}
