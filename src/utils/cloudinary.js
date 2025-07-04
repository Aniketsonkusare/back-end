import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config:", cloudinary.config());



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    console.log(localFilePath,"this is a local File path")
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been Uploaded Successfully
    console.log("file is Uploaded on Cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // clean up only if file exists
    }// remove locally saveed temporary file as the upload operation got failed
    return null
  }
};

export {uploadOnCloudinary}

