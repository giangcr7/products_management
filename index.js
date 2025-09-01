const express = require('express');
require('dotenv').config();

const database = require("./config/database");
const route = require("./routes/client/index.route");

database.conn();

const app = express();
const port = process.env.PORT;
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

route(app);

app.listen(port, () => {
    console.log(`Đã chạy thành công vào cổng ${port}`)
})
