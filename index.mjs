import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let currentUser =  "ArianaGrande93";
let sums = {
  "ArianaGrande93": 0
};
let carts ={
  "ArianaGrande93": []
};
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
app.use(cookieParser());

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
  carts[currentUser].push(coffe);
  sums[currentUser] += coffe.price;
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    title: "Cart",
    total_price: sums[currentUser],
    items: carts[currentUser]
  });
});

app.post("/cart", (req, res) => {
  sums[currentUser] = 0;
  carts[currentUser] = [];
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  res.render('login', {
    layout: "default",
    title: "Login",
    user: req.query.user || req.cookies.user ||  "ArianaGrande93"
  });
  res.cookie('user', req.query.user || req.cookies.user);
  currentUser = req.query.user || req.cookies.user ||  "ArianaGrande93";
  if(!carts.hasOwnProperty(currentUser)){
    carts[currentUser] = []
    sums[currentUser] = 0
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
