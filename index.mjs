import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const carts = {}
const coffee = [
    {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
    },
    {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999},
    {name: "Latte", image: "/static/img/latte.jpg", price: 1},
    {name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 99}]

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
    res.redirect("/menu")
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: coffee,
    });
});

app.get("/buy/:name", (req, res) => {
    if (!carts[req.cookies.name]){
        res.redirect("/login")
    }
    carts[req.cookies.name].push({...(coffee.find(c => c.name === req.params.name))});
    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    res.render('cart', {
        layout: 'default',
        fullPrice: carts[req.cookies.name].reduce((summ, curVal) => curVal.price + summ, 0),
        items: carts[req.cookies.name]
    });
});

app.post("/cart", (req, res) => {
    const userName = req.cookies.name;
    carts[req.cookies.name] = [];
    res.redirect("/menu");
});

app.get("/login", (req, res) => {
    let name;
    if (req.query.username) {
        name = req.query.username;
        res.cookie("name", name);
    } else if (req.cookies.name) {
        name = req.cookies.name;
    }

    if (name && !carts[name]) {
        carts[name] = [];
    }
    res.render("login",
        {
            layout: "default",
            username: name || "Аноним"
        });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
