const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
///////upload photo
const cloudinaryUploadImage = async (fileUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    return error;
  }
};
/////remove photo
const cloudinaryRemoveImage = async ( imagePublicId ) => {
    try {
        const result = await cloudinary.uploader.destroy( imagePublicId );
        return result;
    } catch ( error ) {
        return error;
    }
}
module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};