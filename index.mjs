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
    price: 99
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 199
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 229
  },
  {
    name: "Flat white",
    image: "/static/img/flat-white.jpg",
    price: 259
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 59
  },
  {
    name: "Latte Macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 299
  },
];

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
app.use('/static', express.static('static'));
app.use(cookieParser());
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
    items: coffee,
  });
});

app.get("/buy/:name", (req, res) => {
  let cart;
  if (req.cookies.cart) {
    cart = req.cookies.cart;
  } else {
    cart = [];
  }
  cart.push(req.params.name);
  res.cookie('cart', cart);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let cart;
  if(req.cookies.cart)
    cart = req.cookies.cart;
  else
    cart = [];

  const cartWithCoffee = cart.map(name => coffee.find(c => c.name === name));
  res.render('cart', {
    layout: "default",
    items: cartWithCoffee,
    amount: cartWithCoffee.reduce((res, cur) => cur.price + res, 0),
  });
});

app.post("/cart", (req, res) => {
  res.cookie('cart', []);
  res.redirect('/');
});

app.get("/login", (req, res) => {
  let username;
  if (req.query.username) {
    username = req.query.username;
  } else if (req.cookies.username) {
    username = req.cookies.username;
  } else {
    username = 'Заядлый кофеман';
  }
  res.cookie('username', username);
  res.render('login', {
    layout: 'default',
    username: username
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
