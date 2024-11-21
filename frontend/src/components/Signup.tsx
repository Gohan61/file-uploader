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
    <div className="flex flex-column flex-wrap justify-center w-full">
      <h2 className="text-2xl mb-3 w-full text-center">Sign up</h2>
      <form
        action=""
        method="POST"
        encType="multipart/form-data"
        className="flex gap-1 flex-column flex-wrap w-[300px]"
      >
        <label htmlFor="username" className="font-bold text-lg">
          Username (required)
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={signupForm.username}
          onChange={(e) =>
            setSignupForm({ ...signupForm, username: e.target.value })
          }
          required
          className="rounded-md border-sky-950 shadow-sm border-2"
        />
        {error.username ? (
          <p data-testid="usernameError" className="text-red-500 bold w-full">
            {error.username}
          </p>
        ) : (
          ""
        )}
        {error.duplicate ? <p>{error.duplicate}</p> : ""}
        <label htmlFor="name" className="font-bold text-lg w-full">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={signupForm.name}
          onChange={(e) =>
            setSignupForm({ ...signupForm, name: e.target.value })
          }
          className="rounded-md border-sky-950 shadow-sm border-2"
        />
        {error.name ? <p data-testid="nameError">{error.name}</p> : ""}
        <label htmlFor="password" className="font-bold text-lg">
          Password (required)
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={signupForm.password}
          onChange={(e) =>
            setSignupForm({ ...signupForm, password: e.target.value })
          }
          className="rounded-md border-sky-950 shadow-sm border-2"
        />
        {error.password ? (
          <p data-testid="passwordError" className="text-red-500 bold w-full">
            {error.password}
          </p>
        ) : (
          ""
        )}
        <button
          onClick={(e) => handleSignup(e)}
          className="mt-2 px-2 border-2 rounded-md h-fit bg-sky-800 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
