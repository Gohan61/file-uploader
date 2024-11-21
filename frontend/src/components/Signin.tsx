import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Folders, GetFolder } from "../types/types";

export default function Signin() {
  const [signinForm, setSigninForm] = useState({ username: "", password: "" });
  const [error, setError] = useState({ user: "", password: "" });
  const [inputValidation, setValidation] = useState({
    username: "",
    password: "",
  });
  const {
    setLoginStatus,
    getFolders,
    getFolder,
  }: {
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
    getFolders: Folders;
    getFolder: GetFolder;
  } = useOutletContext();
  const navigate = useNavigate();

  function focusValidation(element: string) {
    if (signinForm.username === "" && element === "username") {
      setValidation({ username: "Username cannot be empty", password: "" });
    } else if (signinForm.password === "" && element === "password") {
      setValidation({
        ...inputValidation,
        password: "Password cannot be empty",
      });
    }
  }

  function handleSignin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    let respStatus: number;
    setError({ user: "", password: "" });

    fetch("http://localhost:3000/signin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: signinForm.username,
        password: signinForm.password,
      }),
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          getFolders();
          getFolder(undefined, "main");
          setLoginStatus(true);
          localStorage.setItem("sessionPresent", "true");
          navigate("/home");
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        if (err instanceof Object) {
          setError({ user: "", password: err.message });
        } else {
          setError({ user: err, password: "" });
        }
      });
  }

  return (
    <div className="flex flex-column flex-wrap justify-center w-full">
      <h2 className="text-2xl mb-3 w-full text-center">Sign in</h2>
      <form
        action=""
        method="POST"
        encType="multipart/form-data"
        className="flex gap-1 flex-column flex-wrap w-[300px]"
      >
        <label htmlFor="username" className="font-bold text-lg">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={signinForm.username}
          required
          onChange={(e) => {
            setSigninForm({ ...signinForm, username: e.target.value });
            setValidation({ ...inputValidation, username: "" });
          }}
          onBlur={() => focusValidation("username")}
          className="rounded-md border-sky-950 shadow-sm border-2"
        />
        <p data-testid="usernameError" className="text-red-500 bold w-full">
          {inputValidation.username}
        </p>
        <label htmlFor="password" className="font-bold text-lg">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={signinForm.password}
          required
          onChange={(e) => {
            setSigninForm({ ...signinForm, password: e.target.value });
            setValidation({ ...inputValidation, password: "" });
          }}
          onBlur={() => focusValidation("password")}
          className="rounded-md border-sky-950 shadow-sm border-2"
        />
        {
          <p data-testid="passwordError" className="text-red-500 bold w-full">
            {inputValidation.password}
          </p>
        }
        {error.password ? <p className="w-full">{error.password}</p> : ""}
        {error.user ? (
          <p data-testid="userError" className="w-full">
            {error.user}
          </p>
        ) : (
          ""
        )}
        <button
          onClick={(e) => {
            handleSignin(e);
          }}
          className="mt-2 px-2 border-2 rounded-md h-fit bg-sky-800 text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
