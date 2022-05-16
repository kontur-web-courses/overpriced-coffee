import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;

const menu = [
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 120
  },
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 130
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 180
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 200
  },
  {
    name: "Latte-macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 200
  }
];

const orders = {};
const app = express();

app.use("/static", express.static("static"));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.redirect("/menu");
});

app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/")
  })
);


app.get("/menu", (req, res) => {
  if (!("cart" in req.cookies)) {
    res.cookie("cart", []);
  } else {
    res.cookie("cart", req.cookies.cart);
  }
  res.render("menu", {
    layout: "default",
    items: menu,
    title: "Меню"
  });
});

app.get("/buy/:name", (req, res) => {
  const username = req.cookies.user || "Анон";
  let newCoffee = menu.find(coffee => coffee.name === req.params.name);

  if (!(username in orders)) {
    orders[username] = [];
  }

  orders[username].push(newCoffee);
  res.cookie("cart", orders);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const username = req.cookies.user || "Анон";

  res.render("cart", {
    layout: "default",
    items: orders[username] || [],
    total: orders[username].reduce((sum, coffee) => sum + coffee.price, 0),
    title: "Корзиночка"
  });
  res.cookie("cart", req.cookies.order);
});

app.post("/cart", (req, res) => {
  const username = req.cookies.user || "Анон";
  orders[username] = [];
  res.cookie("cart", []);
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  const oldName = req.cookies.user;
  const newName = req.query.user;
  res.cookie("user", newName);
  orders[newName] = [...(orders[oldName] || [])];
  delete orders[oldName];

  res.render("login", {
    layout: "default",
    title: "Аккаунт",
    username: newName
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));