import { useRef, useState } from "react";
import { folderData, folderType, GetFolder } from "../types/types";
import { useOutletContext } from "react-router-dom";

export default function UpdateFile({
  getFolder,
  currentFolder,
  fileId,
  currentFilename,
}: {
  getFolder: GetFolder;
  currentFolder: string;
  fileId: number;
  currentFilename: string;
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
  const [error, setError] = useState({
    title: "",
    folder: "",
    otherError: "",
  });
  const [fileName, setFileName] = useState(currentFilename);
  const { folders: folderList }: { folders: folderData } = useOutletContext();
  const [folder, setFolder] = useState(currentFolder);

  function updateFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileId: number,
    folder: string,
    newTitle: string
  ) {
    let respStatus: number;
    e.preventDefault();
    closeDialog();

    fetch(`http://localhost:3000/files/${fileId}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newTitle: newTitle,
        newFolder: folder,
      }),
      credentials: "include",
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
        let emptyTitleError = "";
        let emptyFolderError = "";

        if (err instanceof Array) {
          err.map((item) => {
            if (item.path === "newTitle") {
              emptyTitleError = item.msg;
            } else if (item.path === "newFolder") {
              emptyFolderError = item.msg;
            }
          });
          setError({
            title: emptyTitleError,
            folder: emptyFolderError,
            otherError: "",
          });
        } else {
          setError({
            title: "",
            folder: "",
            otherError: err,
          });
        }
      });
  }

  return (
    <>
      <button onClick={openDialog} className="mb-auto mr-5">
        ···
      </button>
      <dialog ref={dialogRef}>
        <h2>Update folder name and/or current folder</h2>
        <form method="put">
          <label htmlFor="fileName">File name: </label>
          <input
            type="text"
            name="fileName"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <select
            name="folder"
            id="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          >
            {folderList.folders.map((item: folderType) => {
              return (
                <option key={item.id + "update"} value={item.title}>
                  {item.title}
                </option>
              );
            })}
          </select>
          <button onClick={(e) => updateFile(e, fileId, folder, fileName)}>
            Submit
          </button>
        </form>
        <button
          onClick={() => {
            closeDialog();
            setFileName(currentFilename);
          }}
        >
          Close
        </button>
      </dialog>
      {error ? <p>{error.folder}</p> : ""}
      {error ? <p>{error.title}</p> : ""}
      {error ? <p>{error.otherError}</p> : ""}
    </>
  );
}
