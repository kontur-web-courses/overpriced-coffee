import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'));
app.use(cookieParser());

const coffeeItems = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999},
  {
    name: "flat-white",
    image: "/static/img/flat-white.jpg",
    price: 300},
  {
    name: "Latte-macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 1337.99
  }]

const carts = {}
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

app.get("/", (req, res) => {
  res.redirect("/menu")
});

app.get("/menu", (req, res) => {
  res.render("menu", {
    layout: "default",
    items: coffeeItems,
    darkThemeOn: (req.cookies.dark_theme === "true" ?? false) ? "checked" : "",
    title: 'МЕНЮ',
  });
});

app.get("/cart", (req, res) => {
  if (!carts[req.cookies.name])
    carts[req.cookies.name] = []
  res.render('cart', {
    layout: 'default',
    fullPrice: carts[req.cookies.name].reduce((result, currentValue) => currentValue.price + result, 0),
    items: carts[req.cookies.name],
    darkThemeOn: (req.cookies.dark_theme === "true" ?? false) ? "checked" : "",
    title: "КОРЗИНА"
  });
});

app.get("/buy/:name", (req, res) => {
  if (!carts[req.cookies.name]){
    res.redirect("/login")
  }
  carts[req.cookies.name].push({...(coffeeItems.find(c => c.name === req.params.name))});
  res.redirect("/menu");
});


app.post("/cart", (req, res) => {
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
  else
    name = "RandomMammoth";

  if (!carts[name]) {
    carts[name] = [];
  }

  res.render("login",
      {
        layout: "default",
        username: name,
        darkThemeOn: (req.cookies.dark_theme === "true" ?? false) ? "checked" : "",
        title: "ВХОД"
      });
});

app.listen(port, () => console.log(`App listening on port ${port}`));