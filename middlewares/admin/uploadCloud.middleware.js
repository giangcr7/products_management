const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ================= Cloudinary config =================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

// ================= Hàm upload stream =================
const streamUpload = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

// ================= Middleware upload Cloudinary =================
const uploadToCloud = async (req, res, next) => {
    if (req.file) {
        try {
            const result = await streamUpload(req.file);
            // gán theo đúng tên field user upload (thumbnail, image, avatar...)
            req.body[req.file.fieldname] = result.secure_url;
        } catch (err) {
            console.error("Upload thất bại:", err);
            req.flash("error", "Upload ảnh thất bại!");
            return res.redirect("back"); // quay lại trang hiện tại
        }
    }
    next();
};
module.exports = uploadToCloud;
