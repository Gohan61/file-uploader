import { useRef, useState } from "react";
import { GetFolder } from "../types/types";
import Delete from "../assets/delete.svg";

export default function DeleteFile({
  getFolder,
  currentFolder,
  fileId,
  fileTitle,
}: {
  getFolder: GetFolder;
  currentFolder: number;
  fileId: number;
  fileTitle: string;
}) {
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
  const [error, setError] = useState();

  function deleteFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileId: number
  ) {
    e.preventDefault();
    let respStatus: number;

    fetch(`http://localhost:3000/files/${fileId}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        respStatus = res.status;
        return res.json();
      })
      .then((res) => {
        if (respStatus === 200) {
          getFolder(undefined, currentFolder);
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
      <button onClick={openDialog} className="ml-5">
        <img src={Delete}></img>
      </button>
      <dialog
        ref={dialogRef}
        className="rounded-md ml-auto mr-auto left-0 right-0 bg-slate-400 p-3 md:w-[500px]"
      >
        <div className="flex">
          <button
            onClick={(e) => deleteFile(e, fileId)}
            className="rounded-md bg-slate-600 text-white px-2 h-fit"
          >
            Yes, delete file {fileTitle}
          </button>
          <button
            onClick={closeDialog}
            className="rounded-md bg-slate-600 text-white px-2 h-fit md:ml-auto ml-8"
          >
            Close
          </button>
        </div>
        {error ? <p>{error}</p> : ""}
      </dialog>
    </>
  );
}
