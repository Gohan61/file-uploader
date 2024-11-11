import { useState } from "react";
import { Folders } from "../types/types";

export default function DeleteFolder({
  folderTitle,
  getFolders,
}: {
  folderTitle: string;
  getFolders: Folders;
}) {
  const [error, setError] = useState("");

  function deleteFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    title: string
  ) {
    let respStatus: number;
    e.preventDefault();

    fetch(`http://localhost:3000/folders/${title}`, {
      mode: "cors",
      method: "DELETE",
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
          getFolders();
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
      <button onClick={(e) => deleteFolder(e, folderTitle)}>
        Delete folder
      </button>
      {error ? <p>{error}</p> : ""}
    </>
  );
}
