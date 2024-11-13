import multer from "multer";
import "dotenv/config";

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

export async function handleUpload(file: string) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "raw",
  });
  return res;
}

export async function handleDelete(public_id: string) {
  const res = await cloudinary.uploader.destroy(
    public_id,
    { resource_type: "raw" },
    (result: any) => result
  );

  return res;
}

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
