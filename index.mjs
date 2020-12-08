import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const products = [
    {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
    },
    {
        name: "Cappuccino",
        image: "/static/img/cappuccino.jpg",
        price: 999
    },
    {
        name: "Espresso",
        image: "/static/img/espresso.jpg",
        price: 999,
    },
    {
        name: "Latte",
        image: "/static/img/latte.jpg",
        price: 999,
    },
    {
        name: "Flat-white",
        image: "/static/img/flat-white.jpg",
        price: 999,
    },
    {
        name: "Latte-macchiato",
        image: "/static/img/latte-macchiato.jpg",
        price: 999,
    },
]
// let cart = [];

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser())
app.use('/static', express.static('static'))

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

app.get("/", (_, res) => {
    res.sendFile(path.join(rootDir, "/static/html/index.html"));
    res.redirect('/menu')
});

app.get("/menu", (req, res) => {
    res.render("menu", {
        layout: "default",
        title: 'Меню',
        isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
        items: products,
    });
});

app.get("/buy/:name", (req, res) => {
    const cart = req.cookies.cart || [];
    cart.push(req.params.name);
    res.cookie('cart', cart);
    res.redirect('/');
});

app.get("/cart", (req, res) => {
    const _cart = req.cookies.cart || [];
    const cart = _cart.map(el => products.find(product => product.name === el));
    res.render('cart', {
        layout: 'default',
        title: 'Корзина',
        isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
        fullPrice: cart.reduce((accum, curVal) => curVal.price + accum, 0),
        items: cart,
    });
});

app.post("/cart", (req, res) => {
    res.cookie('cart', []);
    res.redirect('/');
});

app.get("/login", (req, res) => {
    const username = req.query.username || req.cookies.username || 'Аноним';
    res.cookie('username', username);
    res.render('login', {
        layout: 'default',
        title: 'Личный кабинет',
        isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
        username: username,
    });
});

app.get("/history", (req, res) => {
    res.render('history', {
        layout: 'default',
        title: 'История',
        isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
        history: [
            {
                number: 1,
                cart: [
                    {
                        name: 'Americano',
                        price: 999,
                    }
                ],
            }
        ],
    });
    // res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
