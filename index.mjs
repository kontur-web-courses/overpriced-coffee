import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

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
  res.redirect('/menu')
});

const drinks = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 900 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 600 },
];

app.get("/menu", (req, res) => {
  res.render("menu", {
    layout: "default",
    theme: req.cookies.theme,
    title: 'Меню Overpriced Coffee',
    items: drinks,
  });
});

let users = {};

class User {
  cart = {
    order: [],
    total: 0,
  };

  history = [];

  constructor(username) {
    this.username = username;
  }

  addCartToHistory() {
    this.history.push(Object.assign({}, this.cart));
  }

  clearCart() {
    this.cart.order = [];
    this.cart.total = 0;
  }
}

function addDrink(nameDrink, userName) {
  const drink = drinks.find(drink => drink.name === nameDrink);

  let user = users[userName];
  if (!user) {
    user = new User(userName);
    users[userName] = user;
  }

  user.cart.order.push(drink);
  user.cart.total += drink.price;
}

app.get("/buy/:name", (req, res) => {
  addDrink(req.params.name, req.cookies.login);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  const username = req.cookies.login;

  let user = users[username];
  if (!user) {
    user = new User(username);
    users[username] = user;
  }

  res.render("cart", {
    layout: "default",
    theme: req.cookies.theme,
    title: `Корзина пользователя ${req.cookies.login}`,
    items : user.cart.order, //userCart.order,
    total: user.cart.total,//userCart.total,
  });
});

app.post("/cart", (req, res) => {
  const username = req.cookies.login;

  let user = users[username];
  if (!user) {
    res.redirect('/login');
  }

  user.addCartToHistory();
  user.clearCart();

  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  if (req.query.username) {
    res.cookie("login", req.query.username);
    res.redirect('/login');
  } else {
    res.render("login", {
      title: 'Личный кабинет',
      theme: req.cookies.theme,
      layout: "default",
      username: req.cookies.login || "Аноним"
    });
  }
});

app.get("/theme", (req, res) => {
  let theme = '';
  if (req.query.value === 'true') {
    theme = 'dark';
  }
  res.cookie('theme', theme);
  res.status(204).end();
});

app.get("/history", (req, res) => {
  let user = users[req.cookies.login];
  if (!user) {
    res.redirect('\login');
  }

  res.render("history", {
    layout: 'default',
    title: 'История заказов',
    theme: req.cookies.theme,
    items: user.history,
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
