import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
let products = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  { name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999 },
  {
    name: "Nesquik",
    image: "/static/img/Nesquik.jpg",
    price: 300,
  },
];
let carts = new Map();
const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use(cookieParser());
app.use('/static', express.static(path.join(rootDir, 'static')))
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
  carts.get(req.cookies.name).push(products.filter(n => n.name === req.params.name)[0]);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  console.log(carts.get(req.cookies.name));
  res.render('cart', {
    layout: "default",
    items: carts.get(req.cookies.name)
  });
});

app.post("/cart", (req, res) => {
  clearCart(req.cookies.name);
  res.render('cart', {
    layout: "default",
    items: carts.get(req.cookies.name)
  });
});

app.get("/login", (req, res) => {
  res.render('login',{
    layout: "default"
  });
  if(req.query.name)
  {
    res.cookie('name', req.query.name);
    if(!carts.has(req.query.name))
      carts.set(req.query.name, []);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));

function clearCart(name) {
  while (carts.get(name).length > 0)
    carts.get(name).pop();
}
