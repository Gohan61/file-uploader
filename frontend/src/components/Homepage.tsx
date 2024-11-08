import { useOutletContext } from "react-router-dom";
import cloud from "../assets/cloud-storage.png";
import Upload from "./Upload";
import File from "./File";

export default function HomePage() {
  const { loginStatus }: { loginStatus: boolean } = useOutletContext();

  return (
    <div>
      <img src={cloud} alt="Cloud representing cloud storage" />
      {loginStatus ? (
        <>
          <Upload></Upload>
          <File></File>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
