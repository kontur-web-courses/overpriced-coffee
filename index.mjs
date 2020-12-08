import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use(cookieParser())

const coffee = [
  {
    name: "Americano",
    image: "https://images.unsplash.com/photo-1532004491497-ba35c367d634?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "https://images.unsplash.com/photo-1505677410329-30fb6ebc10b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=642&q=80",
    price: 999
  },
  {
    name: "Latte",
    image: "https://images.unsplash.com/photo-1568046562322-0bbc869368ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
    price: 999
  },
  {
    name: "Espresso",
    image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    price: 9991
  },
  {
    name: "Macchiato",
    image: "https://images.unsplash.com/photo-1518012753778-7e1249d63f13?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    price: 9991
  },
];

const cartStart = {
  layout: "default",
  sum: 0,
  items: [],
};

let cart = Object.assign({}, cartStart);

function clearCart() {
  cart.items = [];
  cart.sum = 0;
}

const hisroryCarts = new Map();

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

app.get("/", (_, res) => {
  res.redirect('/menu')
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee,
  });
});

app.get("/buy/:name", (req, res) => {
  const coffeeName = req.params.name;
  const coffeeBuy = coffee.filter(item => item.name === coffeeName)[0];
  cart.items.push(coffeeBuy);
  cart.sum += coffeeBuy.price;

  hisroryCarts.set(req.cookies['name'], Object.assign({}, cart));

  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", cart);
});

app.post("/cart", (req, res) => {
  clearCart();
  hisroryCarts.delete(req.cookies['name']);

  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  let username = req.query.username !== req.cookies['name'] && req.query.username
    ? req.query.username
    : req.cookies['name'];

  
  cart = hisroryCarts.has(username) ? hisroryCarts.get(username) : Object.assign({}, cartStart);;
  
  res
    .cookie('name', username)
    .render("login", {
      layout: "default",
      name: username,
    });

});

app.listen(port, () => console.log(`App listening on port ${port}`));
