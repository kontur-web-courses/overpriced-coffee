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

app.use('/static', express.static('static'));

app.get("/", (_, res) => {
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  //
  res.redirect('/menu');
});

let items = new Map();
items.set('Americano', { name: "Americano", image: "/static/img/americano.jpg", price: 999, });
items.set('Cappuccino', { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 });
items.set('Latte', { name: "Latte", image: "static/img/latte.jpg", price: 499 });
items.set('Latte Macchiato', { name: "Latte Macchiato", image: "static/img/latte-macchiato.jpg", price: 799 });
items.set('Flat White', { name: "Flat White", image: "static/img/flat-white.jpg", price: 299 });

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: items.values(),
  });
});

let users = new Map();

app.get("/buy/:name", (req, res) => {
  if (!req.cookies.name) {
    res.redirect('/login');
    return;
  }

  if (!users.has(req.cookies.name)) {
    users.set(req.cookies.name, []);
  }

  if (items.has(req.params.name)) {
    users.get(req.cookies.name).push(items.get(req.params.name));
  }
  else res.status(404).end();

  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  if (!req.cookies.name) {
    res.redirect('/login');
    return;
  }

  if (!users.has(req.cookies.name)) {
    users.set(req.cookies.name, []);
  }

  let total = 0;
  for (let i of users.get(req.cookies.name)) {
    total += i.price;
  }
  res.render("cart", {
    layout: "default",
    total: total,
    items: users.get(req.cookies.name),
  });
});

app.post("/cart", (req, res) => {
  users.set(req.cookies.name, []);
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  if (req.query.name) {
    res.cookie('name', req.query.name, { maxAge: 900000 });
    users.set(req.cookies.name, []);
    res.redirect('/login');
    return;
  }

  let name = req.cookies.name || 'Аноним';
  res.render('login', {
    layout: 'default',
    name: name,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));