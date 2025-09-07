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
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
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
