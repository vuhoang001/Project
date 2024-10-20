const cloudinary = require("../config/cloudinary.config");

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://tse2.mm.bing.net/th?id=OIP.gOg3xq5W6715ei5FAHTO4QHaFp&pid=Api&P=0&h=180";
    const folderName = "product/productId";
    const newFileName = "Book store";

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });

    return result;
  } catch (err) {
    console.error(err);
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/2502" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });

    return {
      image_url: result.secure_url,
      shopId: 2502,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (err) {
    return error;
  }
};

const uploadImageFromLocalFiles = async (files) => {
  const folderName = "product/2502";
  try {
    if (!files.length) {
      return;
    }
    const uploadedUrl = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      uploadedUrl.push({
        image_url: result.secure_url,
        shopId: 2502,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 250,
          width: 250,
          format: "jpg",
        }),
      });
    }
    return uploadedUrl;
  } catch (error) {
    return error;
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
};
