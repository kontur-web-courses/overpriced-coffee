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
  //res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    title: "Menu",
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 130,
      },
      { name: "Cappuccino",
        image: "/static/img/cappuccino.jpg",
        price: 140, 
      },
      {
        name: "Espresso",
        image: "/static/img/espresso.jpg",
        price: 160,
      },
      {
        name: "Latte",
        image: "/static/img/latte.jpg",
        price: 170,
      }
    ],
  });
});

const getUserName = (req, res) => {
  let name = req.cookies.login;
  if(!name) {
    name = 'user' + String(Math.random()).slice(2, 10);
    res.cookie("login", name);
  }
  return name;
}

app.get("/buy/:name", (req, res) => {
  let userName = getUserName(req, res);
  toCart(req.params.name, userName);
  res.redirect('/menu');
});

let carts = new Map();

function toCart(drinkName, userName) {
  let result;
  switch(drinkName) {
    case 'Americano' : result = {name: "Americano", image: "/static/img/americano.jpg", price: 130}
    break;
    case 'Cappuccino': result = {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 140}
    break;
    case 'Espresso' : result = {name: "Espresso", image: "/static/img/espresso.jpg", price: 160}
    break;
    case 'Latte' : result = {name: "Latte", image: "/static/img/latte.jpg", price: 170}
    break;
  }
  let cart = carts.get(userName);
  if (!cart){
    cart = {purchases: [], sum: 0};
  }
  cart.sum += result.price;
  cart.purchases.push(result);
  carts.set(userName, cart);
}

app.get("/cart", (req, res) => {
  let cart = carts.get(getUserName(req, res));
  if (!cart) cart = {purchases: [], sum: 0};
  res.render("cart", {
    title: "Cart",
    layout: "default",
    items : cart.purchases,
    sum: cart.sum,
  });
});

app.post("/cart", (req, res) => {
  carts.delete(getUserName(req, res));
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  const userName = getUserName(req, res);
  if(req.query.name){
    const cart = carts.get(userName);
    res.cookie("login", req.query.name);
    carts.set(req.query.name, cart);
    res.redirect('/login');
  }
  else{
    res.render("login", {layout: "default", title: "Login", name: req.cookies.login});
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
