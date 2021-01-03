import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

const coffee = [{
  name: "Americano",
  image: "/static/img/americano.jpg",
  price: 999,
},
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 999
  }];

app.use(cookieParser());
app.use('/static', express.static('static'));
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
  /*res.sendFile(path.join(rootDir, "/static/html/index.html"));*/
  res.redirect("/menu")
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee
  });
});

let ordered_coffee = {};

app.get("/buy/:name", (req, res) => {
  const userName = req.cookies.name;
  let user_ordered_coffee = ordered_coffee[userName];

  let new_coffee = { ...(coffee.find(item => item.name === req.params.name)) };
  let identic_coffee = user_ordered_coffee.find(item => item.name === req.params.name);

  if (!identic_coffee) {
    user_ordered_coffee.push(new_coffee);
  } else {
    identic_coffee.price += new_coffee.price;
  }

  console.log(user_ordered_coffee);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const userName = req.cookies.name;
  const user_ordered_coffee = ordered_coffee[userName];

  res.render("cart", {
    layout: "default",
    sum: user_ordered_coffee.reduce((sum, coffee) => sum + coffee.price, 0),
    items: user_ordered_coffee
  });
});

app.post("/cart", (req, res) => {
  const userName = req.cookies.name;
  let user_ordered_coffee = ordered_coffee[userName];
  user_ordered_coffee = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  let userName;
  if (req.query.username) {
    userName = req.query.username;
    res.cookie("name", userName);
  } else if (req.cookies.name) {
    userName = req.cookies.name;
  }

  if (userName && !ordered_coffee[userName]) {
    ordered_coffee[userName] = [];
  }

  res.render("login", {
    layout: "default",
    username: userName || "Аноним"
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
