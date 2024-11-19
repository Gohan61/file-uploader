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
      <button onClick={openDialog} className="mb-auto ml-auto">
        ···
      </button>
      <dialog
        ref={dialogRef}
        className="rounded-md ml-auto mr-auto left-0 right-0 bg-slate-400 p-3 sm:w-full md:w-[500px]"
      >
        <h2>Update folder name and/or current folder</h2>
        <form method="put" className="flex flex-column flex-wrap mt-2">
          <label htmlFor="fileName" className="mr-2">
            File name:{" "}
          </label>
          <input
            type="text"
            name="fileName"
            id="fileName"
            value={fileName}
            className="rounded-md"
            onChange={(e) => setFileName(e.target.value)}
          />
          <select
            name="folder"
            id="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-md mt-2 h-fit md:ml-2"
          >
            {folderList.folders.map((item: folderType) => {
              return (
                <option key={item.id + "update"} value={item.title}>
                  {item.title}
                </option>
              );
            })}
          </select>
          <button
            onClick={(e) => updateFile(e, fileId, folder, fileName)}
            className="rounded-md bg-slate-600 text-white px-2 mt-14 h-fit -mr-14 md:mr-0 md:mt-6"
          >
            Submit
          </button>
          <button
            onClick={() => {
              closeDialog();
              setFileName(currentFilename);
            }}
            className="rounded-md bg-slate-600 text-white px-2 mt-14 h-fit ml-auto md:mr-0 md:mt-6"
          >
            Close
          </button>
        </form>
      </dialog>
      {error ? <p>{error.folder}</p> : ""}
      {error ? <p>{error.title}</p> : ""}
      {error ? <p>{error.otherError}</p> : ""}
    </>
  );
}
