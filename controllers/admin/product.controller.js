const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { route } = require("../../routes/admin/product.route");
// GET /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;

    }

    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts);
    // end pagination
    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}
// GET /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await Product.updateOne({ _id: id }, { status });
    res.redirect(req.get("Referer") || "/admin/products");
};
// GET /admin/products/change-multi
module.exports.changesMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: "true", deletedAt: new Date() })
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
        default:
            break;
    }
    res.redirect(req.get("Referer") || "/admin/products");
};
// GET /admin/products/delete

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    res.redirect(req.get("Referer") || "/admin/products");
}

