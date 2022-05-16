import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3001;

const coffees = {
  americano: {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999
  },
  cappuccino: {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999
  },
  latte: {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 1337
  }
};

const cart = {};

const app = express();

app.use(express.static("."));
app.use(cookieParser());

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

app.get("/", (_, res) => res.redirect("menu"));

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: Object.values(coffees),
    title: "Меню"
  });
});

app.get("/buy/:name", (req, res) => {
  const username = req.cookies.username || "Аноним";

  if (!(username in cart)) {
    cart[username] = [];
  }

  cart[username].push(coffees[req.params.name.toLowerCase()]);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const username = req.cookies.username || "Аноним";

  res.render("cart", {
    layout: "default",
    items: cart[username] || [],
    title: "Корзина",
    helpers: {
      getTotalPrice(cart) {
        return cart.reduce(function(a, b) {
          return a + b.price;
        }, 0);
      }
    }
  });
});

app.post("/cart", (req, res) => {
  const username = req.cookies.username || "Аноним";
  cart[username] = [];
  res.redirect("menu");
});

app.get("/login", (req, res) => {
  const oldName = req.cookies.username;
  const newName = req.query.username;
  res.cookie("name", newName);
  cart[newName] = [...(cart[oldName] || [])];
  delete cart[oldName];

  res.render("login", {
    layout: "default",
    title: "Личный кабинет",
    username: newName
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
