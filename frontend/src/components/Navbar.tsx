import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../types/types";
import { folderData, folderType } from "../types/types";

export default function Navbar({
  props,
}: {
  props: {
    loginStatus: boolean;
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
    folders: folderData;
    error: string | undefined;
  };
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

  function getFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    folder: string
  ) {
    e.preventDefault();

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
          console.log(res);
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
                  <button onClick={(e) => getFolder(e, folder.title)}>
                    {folder.title}
                  </button>
                </li>
              );
            })}
          </ul>
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
