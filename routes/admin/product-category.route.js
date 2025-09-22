const express = require("express");
const router = express.Router();
const multer = require("multer");

// ================= Multer (memory storage) =================
const upload = multer();
const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get('/', controller.index);
router.get('/create', controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadToCloud,
    validate.createPost,
    controller.createPost
);


module.exports = router;