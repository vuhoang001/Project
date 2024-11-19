const sharp = require("sharp");

async function resizeImage(req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Dùng sharp để resize ảnh
    await sharp(req.file.path)
      .resize(250, 250) // Resize ảnh về kích thước 250x250 px
      .toFile(`./uploads/resized-${req.file.filename}`, (err, info) => {
        if (err) {
          return res.status(500).send("Error resizing image.");
        }
        console.log("Image resized:", info);
        req.file.resizedPath = `./src/uploads/resized-${req.file.filename}`; // Đường dẫn ảnh đã resize
        next(); // Tiếp tục với route xử lý
      });
  } catch (error) {
    return res.status(500).send("Error processing image.");
  }
}

module.exports = { resizeImage };
