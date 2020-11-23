import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser());

let coffees = [{
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
        price: 9000
    },
    {
        name: "чяй)",
        image: "/static/img/tea.webp",
        price: 9001
    },
];

let users = {}

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
    res.redirect('/menu/');
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: coffees,
    });
});

app.get("/buy/:name", (req, res) => {
    let selected = coffees.find(x => x.name === req.params.name);
    console.log(selected);
    console.log(req.cookies)
    let userName = req.cookies["user"]
    users[userName].cart.push(selected);
    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    let userName = req.cookies["user"]
    res.render("cart", {
        layout: "default",
        items: users[userName].cart
    });
});

app.post("/cart", (req, res) => {
    let userName = req.cookies["user"]
    users[userName].cart = [];
    res.redirect('/');
});


app.use(express.urlencoded({ extended: true }))

app.get("/login", (req, res) => {
    res.render("login", { layout: "default" });
})

app.post("/login", (req, res) => {
    let userName = req.body["name"];
    console.log(Object.keys(users).indexOf(userName))

    if (Object.keys(users).indexOf(userName) === -1) {
        users[userName] = { cart: [] };
        console.log("asadads ", users);
    }

    if (userName !== undefined || userName !== "") {
        res.cookie('user', userName);
        console.log(req.cookies)
        res.redirect('/');
        return;
    }
    console.log('cookies', req.cookies, req.signedCookies);
    res.render("login", { layout: "default" });
});

app.use("/static", express.static("static"))

app.listen(port, () => console.log(`App listening on port ${port}`));