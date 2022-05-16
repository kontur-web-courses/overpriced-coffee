import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let sum = 0;
let cart = [];
let coffeTypes = {
  "Americano": {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  "Cappuccino": {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999
  },
  "Espresso": {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 999
  },
  "Flat-white":{
    name: "Flat-white", 
    image: "/static/img/flat-white.jpg",
    price: 999
  },
  "Latte-macchiato": {
    name: "Latte-macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 999
  }
}


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

app.use('/static', express.static('static'));

app.get("/", (_, res) => {
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title: "Menu",
    items: Object.values(coffeTypes),
  });
});

app.get("/buy/:name", (req, res) => {
  let coffe = coffeTypes[req.originalUrl.substring(req.originalUrl.lastIndexOf('/') + 1)];
  cart.push(coffe);
  sum += coffe.price;
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    title: "Cart",
    total_price: sum,
    items: cart
  });
});

app.post("/cart", (req, res) => {
  sum = 0;
  cart = [];
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
