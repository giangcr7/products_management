const express = require('express');
require('dotenv').config();

const database = require("./config/database");

const route = require("./routes/client/index.route");

const routeAdmin = require("./routes/admin/index.route");

const systemConfig = require("./config/system");

database.conn();

const app = express();
const port = process.env.PORT;
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

// App Locals Var
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Routes

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Đã chạy thành công vào cổng ${port}`)
})
