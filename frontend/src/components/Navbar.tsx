import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({
  props,
}: {
  props: {
    loginStatus: boolean;
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
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
          </ul>
          <button onClick={(e) => logout(e)}>Logout</button>
          {error ? <p>{error}</p> : ""}
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
