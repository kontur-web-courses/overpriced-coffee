import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

let dataBase = {};

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'));
app.use(cookieParser())

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
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
      },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      { name: "Latte", image: "/static/img/latte.jpg", price: 100 },
      { name: "Flat White", image: "/static/img/flat-white.jpg", price: 200 },
      { name: "Latte Macchiato", image: "/static/img/latte-macchiato.jpg", price: 300 },
      { name: "Espresso", image: "/static/img/espresso.jpg", price: 80 },
    ],
  });
});

app.get("/buy/:name", (req, res) => {
  const user = req.cookies.userName;
  const { selectedItems } = dataBase[user];

  if (!selectedItems) {
    dataBase[user].selectedItems = [];
  }
  dataBase[user].selectedItems.push({ ...req.params, ...req.query });
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  const user = req.cookies.userName;
  const total = dataBase[user].selectedItems.reduce((acc, item) => acc += Number(item.price), 0);

  res.render("cart", {
    layout: "default",
    cradItems: dataBase[user].selectedItems,
    total: total
  });
});

app.post("/cart", (req, res) => {
  const user = req.cookies.userName;

  dataBase[user].selectedItems = [];
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  const { username } = req.query;

  if (username) {
    dataBase[username] = { selectedItems: [] };
    res.cookie('userName', username);
    res.redirect('/menu');
  } else {
    res.cookie('userName', 'Аноним');
    res.render("login", {
      layout: "default",
      name: req.cookies.userName || 'Аноним'
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
