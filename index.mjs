import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

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

app.get("/menu", (req, res) => {
  if (!('cart' in req.cookies)){
    res.cookie('cart', []);
  }
  else{
    res.cookie('cart', req.cookies.cart);
  }
  res.render("menu", {
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
      },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      {
        name: "Latte",
        image: "/static/img/latte.jpg",
        price: 10000,
      },
      {
        name: "Flat-white",
        image: "/static/img/flat-white.jpg",
        price: 10000,
      },
    ],
  });
});

app.get("/buy/:name", (req, res) => {
  const coffeeName = req.params.name;
  const cart = req.cookies.cart;
  cart.push(new Order(coffeeName, `/static/img/${coffeeName.toLowerCase()}.jpg`, 10000));
  res
    .cookie('cart', cart)
    .redirect("/menu");
});

app.get("/cart", (req, res) => {
  const prices = [];
  const cart = req.cookies.cart;
  for (const order of cart){
    prices.push(order.price);
  }
  res.render("cart", {
    layout: "default",
    total_price: prices.reduce((a, b) => a + b, 0),
    items: cart,
  });
  res.cookie('cart', cart);
});

app.post("/cart", (req, res) => {
  res.cookie('cart', []);
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  res
    .cookie('username', req.query.username)
    .render('login', {
    layout: "default", username: req.cookies.username,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));


class Order {
  constructor(name, image, price) {
    this.name = name;
    this.image = image;
    this.price = price;
  }
}
