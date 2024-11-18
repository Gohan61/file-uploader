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
  currentFolder: string;
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
      <dialog ref={dialogRef}>
        <button onClick={(e) => deleteFile(e, fileId)}>
          Yes, delete file {fileTitle}
        </button>
        <button onClick={closeDialog}>Close</button>
      </dialog>
      {error ? <p>{error}</p> : ""}
    </>
  );
}
