import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let card = [];
let total = 0;
let counter = {
    "Americano": 0, "Cappuccino": 0,
    "Espresso": 0, "Latte": 0
};
let prices = {
    "Americano": 199, "Cappuccino": 299,
    "Espresso": 399, "Latte": 499
};

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
app.use('/static', express.static('static'));
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
    res.redirect("/menu");
    res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: [
            {
                name: "Americano",
                image: "/static/img/americano.jpg",
                price: 199,
            },
            {
                name: "Cappuccino",
                image: "/static/img/cappuccino.jpg",
                price: 299
            },
            {
                name: "Espresso",
                image: "/static/img/espresso.jpg",
                price: 399
            },
            {
                name: "Latte",
                image: "/static/img/latte.jpg",
                price: 499
            },
        ],
    });
});

app.get("/buy/:name", (req, res) => {
    card.push(req.params.name);
    counter[req.params.name]++;
    total += prices[req.params.name];
    console.log(card);
    res.redirect('/menu');
});

app.get("/cart", (req, res) => {
    res.render('cart', {
        summ: total,
        layout: "default",
        items: [
            {
                name: "Americano",
                image: "/static/img/americano.jpg",
                price: `${counter["Americano"]} * 199`,
            },
            {
                name: "Cappuccino",
                image: "/static/img/cappuccino.jpg",
                price: `${counter["Cappuccino"]} * 299`
            },
            {
                name: "Espresso",
                image: "/static/img/espresso.jpg",
                price: `${counter["Espresso"]} * 399`
            },
            {
                name: "Latte",
                image: "/static/img/latte.jpg",
                price: `${counter["Latte"]} * 499`
            },
        ],
    })
});

app.post("/cart", (req, res) => {
        let card = [];
        let total = 0;
        let counter = {
            "Americano": 0, "Cappuccino": 0,
            "Espresso": 0, "Latte": 0
        };
        res.render('cart', {
            summ: total,
            layout: "default",
            items: [
                {
                    name: "Americano",
                    image: "/static/img/americano.jpg",
                    price: `${counter["Americano"]} * 199`,
                },
                {
                    name: "Cappuccino",
                    image: "/static/img/cappuccino.jpg",
                    price: `${counter["Cappuccino"]} * 299`
                },
                {
                    name: "Espresso",
                    image: "/static/img/espresso.jpg",
                    price: `${counter["Espresso"]} * 399`
                },
                {
                    name: "Latte",
                    image: "/static/img/latte.jpg",
                    price: `${counter["Latte"]} * 499`
                },
            ],
        });
    }
);

app.get("/login", (req, res) => {
    res.status(501).end();
});


app.listen(port, () => console.log(`App listening on port ${port}`));
