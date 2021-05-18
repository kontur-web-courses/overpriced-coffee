import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use(cookieParser());

const items = [
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
        name: "Nanachi",
        image: "/static/img/coffee1.jpg",
        price: 'Your friend'
    },
    {
        name: "Your girlfriend",
        image: "/static/img/coffee2.jpg",
        price: Infinity
    },
    {
        name: 'Flat white',
        image: "/static/img/flat-white.jpg",
        price: 101011010
    },
    {
        name: "Totoro",
        image: "/static/img/coffee3.jpg",
        price: 'Your life'
    },
]

app.use('/static', express.static('static'));

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
    res.redirect('/menu');
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: items
    });
});

let ordersForUsername = {}

app.get("/buy/:name", (req, res) => {
  res.status(501).end();
});

app.get("/cart", (req, res) => {
    if (req.cookies.username) {
        const username = req.cookies.username;
        let orderItems = [];
        if (ordersForUsername[username]) {
            orderItems = ordersForUsername[username].map(order => items.find(item => item.name === order));
        }
        let fullPrice = orderItems.reduce((prev, order) => parseInt(order.price) + prev, 0);

        if (isNaN(fullPrice)) {
            fullPrice = 'U don\'t deserve this';
        }

        if (req.cookies.username === 'kittygirl') {
            fullPrice = "It's yours for free :)\n 0"
        }
        res.render("cart", {
            layout: 'default',
            items: orderItems,
            fullPrice: fullPrice
        });
    }
    else {
        res.redirect('/login');
    }
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
