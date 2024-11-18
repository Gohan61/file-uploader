import { useOutletContext } from "react-router-dom";
import cloud from "../assets/cloud-storage.png";
import Upload from "./Upload";
import File from "./File";

export default function HomePage() {
  const { loginStatus }: { loginStatus: boolean } = useOutletContext();

  return (
    <>
      {loginStatus ? (
        <>
          <Upload></Upload>
          <div className="col-start-1 col-end-3 row-span-2 grid grid-cols-[repeat(auto-fit,minmax(150px,350px))]">
            <File></File>
          </div>
        </>
      ) : (
        <div>
          <img
            src={cloud}
            alt="Cloud representing cloud storage"
            className="w-32 lg:w-48 object-contain"
          />
        </div>
      )}
    </>
  );
}
