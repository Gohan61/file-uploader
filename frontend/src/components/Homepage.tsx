import { useOutletContext } from "react-router-dom";
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
        <div className="flex flex-column flex-wrap justify-center mt-3">
          <h1 className="text-2xl font-extrabold mb-5 w-full text-center">
            Welcome to The Closed Box
          </h1>
          <div className="flex flex-column flex-wrap justify-center md:flex-row">
            <p className="md:w-[300px] w-[250px]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde
              assumenda quam praesentium aspernatur obcaecati quo quod iure
              animi! Reiciendis adipisci cum expedita porro dignissimos vel!
              Repudiandae qui perspiciatis accusamus libero.
            </p>
            <p className="md:w-[300px] w-[250px] mt-3 md:mt-0">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque
              sit ad obcaecati? Distinctio eaque impedit quo sit rem, a optio
              debitis placeat culpa aut laborum, esse ad, nihil sapiente neque!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
