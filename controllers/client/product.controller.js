// GET /products

const Product = require("../../models/product.model");


module.exports.index = async (req, res) => {
    const products = await Product
        .find({
            status: "active",
            deleted: false
        })
        .sort({ position: "desc" });


    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });

    console.log(newProducts);

    res.render('client/pages/products/index.pug',
        {
            pageTitle: "Danh sách sản phẩm",
            products: newProducts
        });
}

module.exports.create = (req, res) => {

    res.render('client/pages/products/index.pug');
}

module.exports.edit = (req, res) => {
    res.render('client/pages/products/index.pug');
}
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };
        const product = await Product.findOne(find);
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });

    }
    catch (error) {
        // them req.flash vao de in ra thong bao loi khi go id sai
        res.redirect(`/products`);

    }

}

