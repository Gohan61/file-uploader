import { useRef, useState } from "react";
import { Folders } from "../types/types";

export default function UpdateFolder({
  folderTitle,
  getFolders,
  folderId,
}: {
  folderTitle: string;
  getFolders: Folders;
  folderId: number;
}) {
  const [error, setError] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  };
  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  function updateFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    title: string,
    folderId: number,
    newTitle: string
  ) {
    let respStatus: number;
    e.preventDefault();
    closeDialog();

    fetch(`http://localhost:3000/folders/${title}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: folderId,
        newTitle: newTitle,
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
          setNewFolderName("");
          setError("");
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
      <button onClick={openDialog}>···</button>
      <dialog ref={dialogRef}>
        <form action="" method="PUT">
          <label htmlFor="newFolderName">New folder name: </label>
          <input
            type="text"
            name="newFolderName"
            id="newFolderName"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button
            onClick={(e) =>
              updateFolder(e, folderTitle, folderId, newFolderName)
            }
          >
            Submit
          </button>
        </form>
      </dialog>
      {error ? <p>{error}</p> : ""}
    </>
  );
}
