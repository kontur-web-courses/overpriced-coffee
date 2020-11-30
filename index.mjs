import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let usersCarts = new Map();
let products = [
  { name: "Americano", image: "/static/img/americano.jpg", price: 500, },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 228 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 700 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 1000 }
];

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
  res.redirect('/menu');
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title: "Menu",
    theme: _.cookies.theme,
    items: products,
  });
});

app.get("/buy/:name", (req, res) => {
  let username = req.cookies.UserName;
  for (let product of products)
    if (product.name === req.params.name) {
      let userCart = usersCarts.get(username);
      userCart.cart.push(product);
      userCart.totalCost += product.price;
    }
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  if(!usersCarts.has(req.cookies.UserName))
    res.redirect('/login');
  let userCart = usersCarts.get(req.cookies.UserName);
  res.render("cart", {
    layout: "default",
    title: "Cart",
    theme: req.cookies.theme,
    total: userCart.totalCost,
    items: userCart.cart
  });
});

app.post("/cart", (req, res) => {
  let userCart = usersCarts.get(req.cookies.UserName);
  userCart.cart = [];
  userCart.totalCost = 0;
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  if (req.query.name === undefined) {
    res.render("login", {
      layout: "default",
      title: "Login",
      theme: req.cookies.theme,
      UserName: req.cookies.UserName
    });
  }
  else {
    res.cookie('UserName', req.query.name);
    usersCarts.set(req.query.name, {cart: [], totalCost: 0})
    res.redirect('/login');
  }
});

app.get("/theme", (req, res) => {
  let theme = ''
  if(req.query.value === 'true'){
    theme = 'dark'
  }
  res.cookie('theme', theme);
  res.status(204).end();
})

app.listen(port, () => console.log(`App listening on port ${port}`));
