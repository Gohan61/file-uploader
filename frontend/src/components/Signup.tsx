import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [signupForm, setSignupForm] = useState({
    username: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState({
    username: "",
    duplicate: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();

  const handleSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setError({ username: "", duplicate: "", password: "", name: "" });
    let respStatus: number;

    fetch("http://localhost:3000/signup", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signupForm.username,
        name: signupForm.name,
        password: signupForm.password,
      }),
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          navigate("/signin");
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        let usernameError = "";
        let passwordError = "";
        let nameError = "";

        if (err instanceof Array) {
          err.map((item) => {
            if (item.path === "username") {
              usernameError = item.msg;
            } else if (item.path === "password") {
              passwordError = item.msg;
            } else if (item.path === "name") {
              nameError = item.msg;
            }
          });

          setError({
            username: usernameError,
            duplicate: "",
            password: passwordError,
            name: nameError,
          });
        } else {
          setError({
            username: usernameError,
            duplicate: err,
            password: passwordError,
            name: nameError,
          });
        }
      });
  };

  return (
    <div>
      <h2>Sign up</h2>

      <form action="" method="POST" encType="multipart/form-data">
        <label htmlFor="username">Username (required)</label>
        <input
          type="text"
          name="username"
          id="username"
          value={signupForm.username}
          onChange={(e) =>
            setSignupForm({ ...signupForm, username: e.target.value })
          }
          required
        />
        {error.username ? <p>{error.username}</p> : ""}
        {error.duplicate ? <p>{error.duplicate}</p> : ""}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={signupForm.name}
          onChange={(e) =>
            setSignupForm({ ...signupForm, name: e.target.value })
          }
        />
        {error.name ? <p>{error.name}</p> : ""}
        <label htmlFor="password">Password (required)</label>
        <input
          type="password"
          name="password"
          id="password"
          value={signupForm.password}
          onChange={(e) =>
            setSignupForm({ ...signupForm, password: e.target.value })
          }
        />
        {error.password ? <p>{error.password}</p> : ""}
        <button onClick={(e) => handleSignup(e)}>Submit</button>
      </form>
    </div>
  );
}
