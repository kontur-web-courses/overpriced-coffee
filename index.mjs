import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

const DEFAULT_USERNAME = 'Аноним';
const menu = [
    {name: "Americano", image: "/static/img/americano.jpg", price: 999,},
    {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999},
    {name: "Espresso", image: "/static/img/espresso.jpg", price: 999},
    {name: "Flat-white", image: "/static/img/flat-white.jpg", price: 999},
    {name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 999},
    {name: "Latte", image: "/static/img/latte.jpg", price: 999},
];

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
        partialsDir: path.join(rootDir, "/views/partials/"),
    })
);

app.use(cookieParser());
app.use('/static', express.static('static'));

app.get("/", (_, res) => {
    res.sendFile(path.join(rootDir, "/static/html/index.html"));
    res.redirect('/menu');
});

app.get("/menu", (req, res) => {
    res.render("menu", {
        layout: "default",
        items: menu,
        pageTitle: 'Меню',
        dark: getTheme(req),
    });
});

app.get("/cart", (req, res) => {
    const cart = getCart(req);
    res.render("cart", {
        layout: "default",
        items: cart,
        pageTitle: 'Корзина',
        dark: getTheme(req),
    });
});

app.get("/buy/:name", (req, res) => {
    const coffe = menu.find(menuItem => menuItem.name === req.params.name);
    addToCart(req, res, coffe);
    res.redirect('/menu');
});

app.post("/cart", (req, res) => {
    const cart = getCart(req);
    addToHistoryOrders(req, res, cart);
    clearCart(res);
    res.redirect('/cart');
});

app.get("/login", (req, res) => {
    let username = req.cookies.username;
    if (req.query.username) {
        username = req.query.username;
        res.cookie('username', req.query.username);
    }
    res.render("login", {
        layout: "default",
        username: username || DEFAULT_USERNAME,
        pageTitle: 'Личный кабинет',
        dark: getTheme(req),
    });
});

app.get("/historyOrders", (req, res) => {
    const historyOrders = getHistoryOrders(req);
    res.render("historyOrders", {
        layout: "default",
        cart: historyOrders,
        pageTitle: 'История заказов',
        dark: getTheme(req),
    });
});

app.post("/historyOrders", (req, res) => {
    clearHistoryOrders(res);
    res.redirect('/historyOrders');
});

function getCart(req) {
    return JSON.parse(req.cookies.cart || '[]');
}

function addToCart(req, res, item) {
    const cartList = getCart(req);
    cartList.push(item);
    res.cookie('cart', JSON.stringify(cartList));
}

function clearCart(res) {
    res.cookie('cart', JSON.stringify([]));
}

function getTheme(req) {
    return req.cookies.dark === 'true'
}

function getHistoryOrders(req) {
    return JSON.parse(req.cookies.historyOrders || '[]');
}

function addToHistoryOrders(req, res, cart) {
    const historyOrdersList = getHistoryOrders(req);
    historyOrdersList.push(cart);
    res.cookie('historyOrders', JSON.stringify(historyOrdersList));
}

function clearHistoryOrders(res) {
    res.cookie('historyOrders', JSON.stringify([]));
}

app.listen(port, () => console.log(`App listening on port ${port}`));
