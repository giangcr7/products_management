module.exports.index = (req, res) => {
    res.render('client/pages/products/index.pug', { pageTitle: "Danh sách sản phẩm" });
}

module.exports.create = (req, res) => {
    res.render('client/pages/products/index.pug');
}

module.exports.edit = (req, res) => {
    res.render('client/pages/products/index.pug');
}
