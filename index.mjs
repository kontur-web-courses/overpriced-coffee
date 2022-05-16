import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const coffee = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999,
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 9992,
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 9991,
  },
  {
    name: "Flat-White",
    image: "/static/img/flat-white.jpg",
    price: 9990,
  },
  {
    name: "Latte-Macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 9999,
  },
  {
    name: "Flag",
    image: "/static/img/flag.jpg",
    price: 1e9,
  },
];

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

app.use(cookieParser());

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  res.redirect('/menu')
})

app.get("/", (_, res) => {
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee,
  });
});

let ordered_coffee = [];

app.get("/buy/:name", (req, res) => {

  let new_coffee = { ...(coffee.find(item => item.name === req.params.name)) };

  let index = ordered_coffee.indexOf(new_coffee);

  ordered_coffee.push(new_coffee);
  // if (index === -1) {
  //   ordered_coffee.push(new_coffee);
  //   console.log('new');
  // }
  // else {
  //   ordered_coffee[index].price += new_coffee.price;
  //   console.log('old');
  // }

  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: ordered_coffee,
    sum: ordered_coffee.reduce((sum, coffee) => sum + coffee.price, 0),
  });
});

app.post("/cart", (req, res) => {
  ordered_coffee = [];
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  let userName;
  if (req.query.username) {
    userName = req.query.username;
    res.cookie("name", userName);
  } else if (req.cookies.name) {
    userName = req.cookies.name;
  }
  //
  // if (userName && !ordered_coffee[userName]) {
  //   ordered_coffee[userName] = [];
  // }

  res.render("login", {
    layout: "default",
    username: userName || "Аноним",
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
