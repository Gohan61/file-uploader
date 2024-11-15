import { useState } from "react";
import { File } from "../types/types";

export default function FileDetails({ file }: File) {
  const [showFileDetails, setShowFileDetails] = useState(false);

  return (
    <div key={file.id}>
      <h3>{file.title}</h3>
      <button onClick={() => setShowFileDetails(!showFileDetails)}>
        {showFileDetails ? "Hide" : "Show details"}
      </button>
      {showFileDetails ? (
        <>
          <p>
            <span>Created at: </span>
            {file.createdAt}
          </p>
          <p>
            <span>Size: </span>
            {file.size}
          </p>
          <p>
            <span>Upload time: </span>
            {file.uploadTime} seconds
          </p>
          {file.updatedAt ? (
            <p>
              <span>Updated at: </span>
              {file.updatedAt}
            </p>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
