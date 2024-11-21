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
      setError("");
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
          closeDialog();
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
      <button
        onClick={openDialog}
        className="ml-auto row-span-2 col-start-1 col-end-2"
      >
        ···
      </button>
      <dialog
        ref={dialogRef}
        className="rounded-md ml-auto mr-auto left-0 right-0 bg-slate-400 p-3 md:w-[500px]"
      >
        <form action="" method="PUT" className="flex flex-column flex-wrap">
          <label htmlFor="newFolderName">New folder name: </label>
          <input
            type="text"
            name="newFolderName"
            id="newFolderName"
            className="mr-2"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button
            className="rounded-md bg-slate-600 text-white px-2 mt-2"
            onClick={(e) =>
              updateFolder(e, folderTitle, folderId, newFolderName)
            }
          >
            Submit
          </button>
          <button
            className="rounded-md bg-slate-600 text-white px-2 mt-2 ml-auto"
            onClick={closeDialog}
            type="button"
          >
            Cancel
          </button>
        </form>

        {error ? <p>{error}</p> : ""}
      </dialog>
    </>
  );
}
