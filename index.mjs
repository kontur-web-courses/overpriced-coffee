import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

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

app.use(express.static('static'));

app.get("/", (_, res) => {
  res.redirect("/menu");
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/img/americano.jpg",
        price: 999,
      },
      { name: "Cappuccino",
        image: "/img/cappuccino.jpg",
        price: 888,
      },
      {
        name: "Latte",
        image: "/img/latte.jpg",
        price: 777,
      },
      { name: "Espresso",
        image: "/img/espresso.jpg",
        price: 666,
      },
    ],
  });
});

let totalPrice = 0;
let americanoCount = 0;
let cappuccinoCount = 0;
let latteCount = 0;
let espressoCount = 0;

app.get("/buy/:name", (req, res) => {
  let item = req.url.replace("/buy/", "");
  if (item == "Americano"){
    americanoCount+=1;
  } else if (item == "Cappuccino"){
    cappuccinoCount+=1;
  } else if (item == "Latte"){
    latteCount+=1
  } else if (item == "Espresso") {
    espressoCount += 1;
  }
  res.redirect("/menu")
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    totalPrice: 999*americanoCount+888*cappuccinoCount+777*latteCount+666*espressoCount,
    americanoCount: americanoCount,
    cappuccinoCount: cappuccinoCount,
    latteCount: latteCount,
    espressoCount: espressoCount,
    layout: false,
  })
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.render("login", {layout: false});
});

app.listen(port, () => console.log(`App listening on port ${port}`));
