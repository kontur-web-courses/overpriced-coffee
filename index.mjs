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
let cartProducts = [];
let userName;

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
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: products,
  });
});

app.get("/buy/:name", (req, res) => {
  cartProducts.push(products.find( product => product.name === req.params.name));
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    sum: cartProducts.reduce((sum, elem) => sum + elem.price, 0),
    items: cartProducts,
  });
});

app.post("/cart", (req, res) => {
  cartProducts = [];
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  if (req.query.username) {
    res.cookie("username", req.query.username);
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
