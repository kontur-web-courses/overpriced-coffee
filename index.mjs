import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const items = [
    { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
    { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
    { name: "Espresso", image: "/static/img/espresso.jpg", price: 666 },
    { name: "Latte", image: "/static/img/latte.jpg", price: 999 },
  ];
const cart = [];
let totalPrice = 0;

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
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: items,
  });
});

app.get("/buy/:name", (req, res) => {
  const item = items.find((a) => a.name === req.params["name"]);
  totalPrice += item.price;
  cart.push(item);
  res.redirect('/menu');
  res.send(req.params);
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: cart,
    total: totalPrice,
  });
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
