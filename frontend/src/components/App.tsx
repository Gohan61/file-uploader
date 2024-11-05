import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";

export default function App() {
  const [loginStatus, setLoginStatus] = useState(false);

  return (
    <>
      <Navbar props={{ loginStatus, setLoginStatus }}></Navbar>
      <Outlet context={{ loginStatus, setLoginStatus }}></Outlet>
    </>
  );
}
