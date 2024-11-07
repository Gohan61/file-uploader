import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Folders } from "../types/types";

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
  }: {
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
    getFolders: Folders;
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
          setLoginStatus(true);
          getFolders();

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
    <div>
      <h2>Sign in</h2>

      <form action="" method="POST" encType="multipart/form-data">
        <label htmlFor="username">Username</label>
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
        />
        <p>{inputValidation.username}</p>
        <label htmlFor="password">Password</label>
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
        />
        {<p>{inputValidation.password}</p>}
        {error.password ? <p>{error.password}</p> : ""}
        {error.user ? <p>{error.user}</p> : ""}
        <button
          onClick={(e) => {
            handleSignin(e);
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
