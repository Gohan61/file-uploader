import { fileData, GetFolder } from "../types/types";
import { useOutletContext } from "react-router-dom";
import DeleteFile from "./DeleteFile";
import UpdateFile from "./UpdateFile";
import GetFile from "./GetFile";
import FileDetails from "./FileDetails";

export default function File() {
  const {
    files: contextFiles,
    setFiles,
    currentFolder,
    getFolder,
  }: {
    files: fileData;
    setFiles: React.Dispatch<React.SetStateAction<fileData>>;
    currentFolder: string;
    getFolder: GetFolder;
  } = useOutletContext();

  return (
    <>
      {contextFiles.data.length === 0 ? (
        <p className="md:col-start-1 md:col-end-3 md:row-span-2 ">No files</p>
      ) : (
        ""
      )}
      {contextFiles.data.map((file) => {
        return (
          <div
            className="p-3 border rounded-lg border-s-indigo-500 m-2 hover:border-2 hover:shadow-md"
            key={file.id + "div"}
          >
            <div className="flex flex-column">
              <FileDetails file={file}></FileDetails>
              <UpdateFile
                getFolder={getFolder}
                currentFolder={currentFolder}
                fileId={file.id}
                currentFilename={file.title}
              ></UpdateFile>
            </div>
            <div className="flex justify-end">
              <GetFile fileId={file.id} fileTitle={file.title}></GetFile>
              <DeleteFile
                getFolder={getFolder}
                currentFolder={currentFolder}
                fileId={file.id}
                fileTitle={file.title}
              ></DeleteFile>
            </div>
          </div>
        );
      })}
    </>
  );
}
