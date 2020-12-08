import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use(cookieParser());

const products = [
  { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 888 },
  { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 777 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 666 },
  { name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 555 },
];
let users = [];


app.use('/static', express.static(path.join(rootDir, 'static')));

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
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: products,
  });
});

app.get("/buy/:name", (req, res) => {
  let currentUser = req.cookies.username || 'Аноним';
  let user = users.find(item => item.name = currentUser);
  let product = products.find( product => product.name === req.params.name);
  if (user) {
    user.products.push(product);
  } else {
    users.push({name: currentUser, products: [product]})
  }
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let currentUser = req.cookies.username || 'Аноним';
  let user = users.find(item => item.name === currentUser);
  let products;
  if (user) {
     products = user.products;
  } else {
    products = [];
  }
  res.render("cart", {
    layout: "default",
    sum: products.reduce((sum, elem) => sum + elem.price, 0),
    items: products,
  });
});

app.post("/cart", (req, res) => {
  let currentUser = req.cookies.username || 'Аноним';
  let user = users.find(item => item.name === currentUser);
  if (user) {
    user.products = [];
  }
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  if (req.query.username) {
    res.cookie("username", req.query.username);
    users = []
    res.redirect("/login");
  } else {
    let name = req.cookies.username || "Аноним";
    res.render("login", {
      layout: "default",
      username: name,
    });

  }
});


app.listen(port, () => console.log(`App listening on port ${port}`));
