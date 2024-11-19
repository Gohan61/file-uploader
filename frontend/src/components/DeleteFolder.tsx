import { useRef, useState } from "react";
import { Folders } from "../types/types";
import DeleteIcon from "../assets/delete.svg";

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
      <button onClick={openDialog} className="ml-6 col-start-2 col-end-3">
        <img src={DeleteIcon} alt="Trash can icon" />
      </button>
      <dialog
        ref={dialogRef}
        className="rounded-md ml-auto mr-auto left-0 right-0 bg-slate-400 p-3"
      >
        <p>Are you sure you want to delete this folder?</p>
        <div className="w-full flex">
          <button
            onClick={(e) => deleteFolder(e, folderTitle)}
            className="rounded-md bg-slate-600 text-white px-2 mt-2"
          >
            Yes, delete folder
          </button>
          <button
            onClick={closeDialog}
            className="rounded-md bg-slate-600 text-white px-2 mt-2 ml-auto"
          >
            Close
          </button>
        </div>
      </dialog>

      {error ? <p>{error}</p> : ""}
    </>
  );
}
