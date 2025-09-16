const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");


// GET /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = { deleted: false };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        { currentPage: 1, limitItems: 4 },
        req.query,
        countProducts
    );
    // sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {

        sort[req.query.sortKey] = req.query.sortValue;
    }
    sort.position = "desc";

    // end sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products,
        filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
};

// GET /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await Product.updateOne({ _id: id }, { status });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.get("Referer") || "/admin/products");
};

// POST /admin/products/change-multi
module.exports.changesMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash("success", `Đã xoá ${ids.length} sản phẩm thành công!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position });
            }
            req.flash("success", `Cập nhật vị trí ${ids.length} sản phẩm thành công!`);
            break;
        default:
            break;
    }
    res.redirect(req.get("Referer") || "/admin/products");
};

// GET /admin/products/delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", "Đã xoá sản phẩm thành công!");
    res.redirect(req.get("Referer") || "/admin/products");
};

// GET /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
};

// POST /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // req.body.thumbnail đã gán URL từ route nếu có file
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// GET /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const product = await Product.findOne({
            deleted: false,
            _id: req.params.id,
        });
        res.render("admin/pages/products/edit", {
            pageTitle: "Sửa sản phẩm",
            product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// PATCH /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    // req.body.thumbnail đã gán URL từ route nếu có file
    try {
        await Product.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Cập nhật thành công sản phẩm");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại sản phẩm");
    }
    res.redirect(req.get("Referer") || "/admin/products");
};

// GET /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const product = await Product.findOne({
            deleted: false,
            _id: req.params.id,
        });
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
