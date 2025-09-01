const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const route = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;
mongoose.connect("mongodb://localhost:27017/product-management");
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

route(app);

app.listen(port, () => {
    console.log(`Đã chạy thành công vào cổng ${port}`)
})
