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
        <>
          <div className="flex flex-column flex-wrap justify-center mt-3 relative">
            <h1 className="text-2xl font-extrabold mb-5 w-full text-center">
              Welcome to The Closed Box
            </h1>
            <div className="flex flex-column flex-wrap justify-center md:flex-row w-full">
              <p className="md:w-[300px] w-[250px]">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde
                assumenda quam praesentium aspernatur obcaecati quo quod iure
                animi! Reiciendis adipisci cum expedita porro dignissimos vel!
                Repudiandae qui perspiciatis accusamus libero.
              </p>
              <p className="md:w-[300px] w-[250px] mt-3 md:mt-0">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque
                sit ad obcaecati? Distinctio eaque impedit quo sit rem, a optio
                debitis placeat culpa aut laborum, esse ad, nihil sapiente
                neque!
              </p>
            </div>
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027032/File-uploader-homepage-images/qz6wni15qtr5hk9rb1r8.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute top-[60px] lg:top-0 left-0"
            />
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027031/File-uploader-homepage-images/ukz3pkq9allcnvjmzsmk.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute bottom-0 left-0"
            />
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027031/File-uploader-homepage-images/nvkzvfvjggwlbgssr2yw.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute top-[30%] md:top-[7%] lg:top-0 right-0"
            />
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027031/File-uploader-homepage-images/y4xna51knpjakgyb0h61.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute bottom-0 right-0"
            />
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027031/File-uploader-homepage-images/grjnbg8qtjqbbhacfolo.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute top-[55%] right-[10px] lg:right-[150px]"
            />
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027031/File-uploader-homepage-images/evvnuaxsvhvf3u9v7t1l.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute top-[45%] left-[10px]"
            />
            <img
              src={
                "https://res.cloudinary.com/du5var2so/image/upload/v1732027031/File-uploader-homepage-images/zwdk1ojg7tvog2flcsv7.png"
              }
              alt="Roll of film"
              className="w-[30px] md:w-[50px] object-contain absolute top-[20%] right-[12px] md:right-[20px] md:top-[30%] lg:right-[130px]"
            />
          </div>
        </>
      )}
    </>
  );
}
