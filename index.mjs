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
let history = {};

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
    title: "Меню"
  });
});

let ordered_coffee = {};

app.get("/buy/:name", (req, res) => {
  const userName = req.cookies.name;
  let user_cart = ordered_coffee[userName];

  let new_coffee = { ...(coffee.find(item => item.name === req.params.name)) };
  // let identic_coffee = user_cart.find(item => item.name === req.params.name);
  //
  // if (!identic_coffee) {
    user_cart.push(new_coffee);
  // } else {
  //   identic_coffee.price += new_coffee.price;
  // }

  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const userName = req.cookies.name;
  let user_cart = ordered_coffee[userName];

  res.render("cart", {
    layout: "default",
    sum: user_cart.reduce((sum, coffee) => sum + coffee.price, 0),
    items: user_cart,
    title: "Корзина"
  });
});

app.post("/cart", (req, res) => {
  const userName = req.cookies.name;
  if (!history[userName]){
    history[userName] = [];
  }
  ordered_coffee[userName].forEach(element => {
    let coffee = history[userName].find(coffee => coffee.name === element.name);
    if (!coffee)
      history[userName].push({name: element.name, countOfCoffee: 1});
    else
      coffee.countOfCoffee += 1;
  });
  ordered_coffee[userName] = [];
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

  if (userName && !ordered_coffee[userName]) {
    ordered_coffee[userName] = [];
  }

  res.render("login", {
    layout: "default",
    username: userName || "Аноним",
    title: "Личный кабинет"
  })
});

app.get("/history", (req, res) => {
  const userName = req.cookies.name;
  res.render("history",{
    layout: "default",
    items: history[userName],
    title: "История покупок",
  });
})

app.listen(port, () => console.log(`App listening on port ${port}`));
