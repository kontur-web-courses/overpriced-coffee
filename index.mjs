import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
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

app.use('/static', express.static('static'))

app.get("/", (_, res) => {
  //res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu');
});

const beverages = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  { 
    name: "Cappuccino", 
    image: "/static/img/cappuccino.jpg", 
    price: 999 
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 899,
  },
  {
    name: "Flat-white",
    image: "/static/img/flat-white.jpg",
    price: 899,
  },
  {
    name: "Latte-macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 899,
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 899,
  }
]

const userCart = new Map();

function getName(req, res){
  let userName = req.cookies["name"];
  if(!userName) {
    userName = `Anonymus${Math.random()}`
    res.cookie('name', userName)
  }
  return userName;
}

function getCart(req, res) {
  let userName = getName(req, res)
  let cart = userCart.get(userName);
  if(!cart) {
    cart = [];
    userCart.set(userName, cart);
  }
  return cart;
}

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: beverages,
  });
});


app.get("/buy/:name", (req, res) => {
  for(let i of beverages) {
    if(i.name == req.params["name"]) {
      let cart = getCart(req, res)
      cart.push(i)
    }
  }
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let cart = getCart(req, res);
  let totalPrice = 0;
  for(let i of cart){
    totalPrice += i.price;
  }
  res.render("cart", {
    layout: "default",
    total: totalPrice,
    items: cart,
  });
});

app.post("/cart", (req, res) => {
  let cart = getCart(req, res);
  cart.splice(0, cart.length);
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  if (req.query.name){
    res.cookie('name', req.query.name);
    res.redirect('/login');
  } else {
    res.render("login", {
      layout: "default",
      cookieName: req.cookies['name'] || "Аноним",
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
