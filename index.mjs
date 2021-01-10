import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser());

let items = [
    {
      name: "Americano",
      image: "/img/americano.jpg",
      price: 999,
    },
    { 
      name: "Cappuccino", 
      image: "/img/cappuccino.jpg", 
      price: 999 
    },
    { 
      name: "Latte", 
      image: "/img/latte.jpg", 
      price: 1999 
    },
    { 
      name: "Espresso", 
      image: "/img/espresso.jpg", 
      price: 599 
    }
]

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
  // res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect("/menu")
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: items, 
  });
});

app.get("/buy/:name", (req, res) => {
  let shoppingList = req.cookies.shoppingList || [];
  shoppingList.push(req.params.name);
  console.log(shoppingList);
  res.cookie('shoppingList', shoppingList);
  res.redirect("/menu")
});

app.get("/cart", (req, res) => {
  let shoppingList = req.cookies.shoppingList || [];
  let _items = items.filter(x => shoppingList.includes(x["name"]));
  console.log(req.cookies, _items);
  let total = _items.length > 0 ?_items.map(x => x["price"]).reduce((a, b) => a + b) : 0;
  res.render("cart", {
    layout: "default",
    total : total,
    items: _items
  });
});

app.post("/cart", (req, res) => {
  res.cookie("shoppingList", []);
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  let username;

  if (req.query.username) {
    username = req.query.username;
  } else if (req.cookies.username) {
    username = req.cookies.username;
  } else 
  {
    username = "Анон";
  }

  res.cookie("username", username);

  res.render("login", {
    layout: "default",
    username: username
  });
});


app.listen(port, () => console.log(`App listening on port ${port}`));

app.use(express.static('static'));
