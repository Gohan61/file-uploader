import { useState } from "react";

export default function GetFile({
  fileId,
  fileTitle,
}: {
  fileId: number;
  fileTitle: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleDownload() {
    setIsLoading(true);
    setError("");
    fetch(`http://localhost:3000/files/${fileId}`).then(async (res) => {
      if (!res.ok) {
        const resp = await res.json();
        setError(resp.errors);
      } else {
        const blob = await res.blob();
        const fileUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileTitle;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);

        setIsLoading(false);
      }
    });
  }

  return (
    <>
      <button onClick={handleDownload} disabled={isLoading}>
        {isLoading ? "Downloading" : "Download file"}
      </button>
      {error ? <p>{error}</p> : ""}
    </>
  );
}
