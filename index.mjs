import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'));
app.use(cookieParser());

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
    //res.sendFile(path.join(rootDir, "/static/html/index.html"));
    res.redirect('/menu');
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: menu,
    });
});

let cart = [];
let usersCarts = new Map();
const menu = [{
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
    },
    { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
    { name: "flat-white", image: "/static/img/flat-white.jpg", price: 899 },
    {
        name: "Espresso",
        image: "/static/img/espresso.jpg",
        price: 500,
    },
];

app.get("/buy/:name", (req, res) => {
    cart.push(menu.find(item => item.name == req.params.name));
    res.redirect('/menu');
});

let getCost = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

app.get("/cart", (req, res) => {
    let name = req.cookies.user || "Аноним";
    cart = usersCarts.get(name);
    if (!cart) {
        cart = [];
        usersCarts.set(name, cart);
    }
    res.render("cart", {
        layout: "default",
        items: cart,
        cost: getCost(),
    });
});

app.post("/cart", (req, res) => {
    cart = [];
    cost = 0;
    res.redirect('/menu');
});


app.get("/login", (req, res) => {
    if (req.query.name) {
        res.cookie("user", req.query.name);
        res.redirect("/login");
    } else {
        let name = req.cookies.user || "Аноним";
        res.render("login", {
            layout: "default",
            name: name,
        });

    }
});

app.listen(port, () => console.log(`App listening on port ${port}`));