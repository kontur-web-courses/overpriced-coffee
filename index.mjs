import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const coffee = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999,
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 9992,
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 9991,
  },
  {
    name: "Flat-White",
    image: "/static/img/flat-white.jpg",
    price: 9990,
  },
  {
    name: "Latte-Macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 9999,
  },
  {
    name: "Flag",
    image: "/static/img/flag.jpg",
    price: 1e9,
  },
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

app.get('/', (req, res) => {
  res.redirect('/menu')
})

app.get("/", (_, res) => {
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee,
  });
});

let ordered_coffee = [];

app.get("/buy/:name", (req, res) => {

  let new_coffee = { ...(coffee.find(item => item.name === req.params.name)) };
  ordered_coffee.push(new_coffee);

  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: ordered_coffee,
    sum: ordered_coffee.reduce((sum, coffee) => sum + coffee.price, 0),
  });
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.use('/static', express.static('static'))

app.listen(port, () => console.log(`App listening on port ${port}`));
