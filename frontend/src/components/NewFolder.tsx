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
      <button
        onClick={() => setShowForm(true)}
        className="px-2 border-2 rounded-md h-fit bg-sky-800 text-white"
      >
        New folder
      </button>
      {showForm ? (
        <div className="z-1 absolute -mt-12 rounded-md ml-auto mr-auto left-0 right-0 bg-slate-400 p-3 grid grid-columns-1 grid-rows-1 md:w-[500px] justify-center items-end">
          <form
            action=""
            method="post"
            className="column-start-1 row-start-1 flex flex-column flex-wrap"
          >
            <label htmlFor="folderName" className="mr-2">
              Folder name:{" "}
            </label>
            <input
              type="text"
              name="folderName"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="rounded-md"
            />
            <button
              onClick={(e) => newFolder(e, folderName)}
              className="rounded-md bg-slate-600 text-white px-2"
            >
              Submit
            </button>
          </form>
          <button
            onClick={() => {
              setShowForm(false);
              setError("");
              setFolderName("");
            }}
            className="column-start-1 row-start-1 rounded-md bg-slate-600 text-white px-2"
          >
            Cancel
          </button>
          {error ? <p>{error}</p> : ""}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
