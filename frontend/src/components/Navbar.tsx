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
import Folder from "./Folder";

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
      <h1>
        <Link to={"/home"}>The Closed Box</Link>
      </h1>
      {props.loginStatus ? (
        <nav>
          <ul>
            <li>
              <Link to={"/home"}>Home</Link>
            </li>
            {props.folders.folders.map((folder: folderType) => {
              return (
                <li key={folder.id}>
                  <button
                    onClick={(e) => {
                      props.getFolder(e, folder.title);
                    }}
                  >
                    {folder.title}
                  </button>
                </li>
              );
            })}
          </ul>
          <Folder getFolders={props.getFolders}></Folder>
          <button onClick={(e) => logout(e)}>Logout</button>
          {error ? <p>{error}</p> : ""}
          {props.error ? <p>{props.error}</p> : ""}
        </nav>
      ) : (
        <>
          <Link to={"/signup"}>Sign up</Link>
          <Link to={"/signin"}>Sign in</Link>
        </>
      )}
    </>
  );
}
