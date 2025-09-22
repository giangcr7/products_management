const express = require('express');
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
database.conn();

const app = express();

// parse application
app.use(bodyParser.urlencoded({ extended: false }));

// flash thông báo
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());
// TinyMce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End TinyMce
// change method
app.use(methodOverride("_method"));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

// App Locals Var
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
routeAdmin(app);
route(app);
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
}

// Export app cho Vercel
module.exports = app;
