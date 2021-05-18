import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

// allow static files
app.use("/static", express.static("static"));

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

// redirect to /menu
app.get("/", (_, res) => {
  res.redirect("/menu");
});

app.get("/", (_, res) => {
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

// card hbs
let items = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 999,
  },
  {
    name: "Flat-White",
    image: "/static/img/flat-white.jpg",
    price: 999,
  },
  {
    name: "Latte-Macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 999,
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 999,
  },
];

let carts = {
  "0": []
}

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: items,
  });
});


app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: carts["0"],
  });
});



app.get("/buy/:name", (req, res) => {
  // totalCard.push(req.params)
  let name = req.params.name;
  let item = items.find(i => i.name == name);
  console.log(item);
  if (item != -1) {
    carts["0"].push(item);
  }
  res.redirect("/menu");
  // res.status(501).end();
});

app.get("/cart", (req, res) => {
  res.status(501).end();
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
