const express = require("express");
const router = express.Router();
const multer = require("multer");

// ================= Multer (memory storage) =================
const upload = multer();
// ================= Controller + Validate =================
const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");
// ===================== Routes =====================

// List
router.get("/", controller.index);

// Change status
router.patch("/change-status/:status/:id", controller.changeStatus);

// Multi action
router.patch("/change-multi", controller.changesMulti);

// Delete
router.delete("/delete/:id", controller.deleteItem);

// Create
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadToCloud,
    validate.createPost,
    controller.createPost
);

// Edit
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadToCloud,
    validate.createPost,
    controller.editPatch
);

// Detail
router.get("/detail/:id", controller.detail);

module.exports = router;
