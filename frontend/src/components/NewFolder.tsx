import { useState } from "react";
import { Folders } from "../types/types";

export default function Folder({ getFolders }: { getFolders: Folders }) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  function newFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    title: string
  ) {
    let respStatus: number;
    e.preventDefault();

    fetch("http://localhost:3000/folders/new", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
      credentials: "include",
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          getFolders();
          setShowForm(false);
          setError("");
          setFolderName("");
        } else {
          throw res.errors;
        }
      })
      .catch((err) => {
        if (err instanceof Object) {
          setError(err[0].msg);
        } else {
          setError(err);
        }
      });
  }

  return (
    <>
      <button onClick={() => setShowForm(true)}>New folder</button>
      {showForm ? (
        <div>
          <form action="" method="post">
            <label htmlFor="folderName">Folder name: </label>
            <input
              type="text"
              name="folderName"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <button onClick={(e) => newFolder(e, folderName)}>Submit</button>
          </form>
          <button
            onClick={() => {
              setShowForm(false);
              setError("");
              setFolderName("");
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        ""
      )}
      {error ? <p>{error}</p> : ""}
    </>
  );
}
