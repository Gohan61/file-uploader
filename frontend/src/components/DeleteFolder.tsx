import { useRef, useState } from "react";
import { Folders } from "../types/types";

export default function DeleteFolder({
  folderTitle,
  getFolders,
}: {
  folderTitle: string;
  getFolders: Folders;
}) {
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };
  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  function deleteFolder(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    title: string
  ) {
    let respStatus: number;
    e.preventDefault();
    closeDialog();

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
      <button id="open" onClick={openDialog}>
        Delete folder
      </button>
      <dialog id="dialog" ref={dialogRef}>
        <p>Are you sure you want to delete this folder?</p>
        <button onClick={(e) => deleteFolder(e, folderTitle)}>
          Yes, delete folder
        </button>
        <button id="close" onClick={closeDialog}>
          Close
        </button>
      </dialog>

      {error ? <p>{error}</p> : ""}
    </>
  );
}
