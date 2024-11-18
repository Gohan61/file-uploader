import { useState } from "react";
import { File } from "../types/types";

export default function FileDetails({ file }: File) {
  const [showFileDetails, setShowFileDetails] = useState(false);

  return (
    <div key={file.id} className="mb-2">
      <h3 className="mb-1 font-bold text-lg">{file.title}</h3>
      <button
        onClick={() => setShowFileDetails(!showFileDetails)}
        className="italic"
      >
        {showFileDetails ? "Hide" : "Show details"}
      </button>
      {showFileDetails ? (
        <>
          <p className="text-sm">
            <span className="font-semibold">Created at: </span>
            {file.createdAt}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Size: </span>
            {file.size}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Upload time: </span>
            {file.uploadTime} seconds
          </p>
          {file.updatedAt ? (
            <p className="text-sm">
              <span className="font-semibold">Updated at: </span>
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
