//8=>
import express, { response } from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

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

app.get("/", (req, res) => {
  res.redirect("/menu")
});
const coffee = [
    {
      name: "Americano",
      image: "/static/img/americano.jpg",
      price: 999,
    },
    { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
    { name: "Espresso", image: "/static/img/espresso.jpg", price: 600 },
  ];
  app.get("/menu", (_, res) => {
    res.render("menu", {
      layout: "default",
      items: coffee,
    });
  });


app.get("/buy/:name", (req, res) => {
  let carts = req.cookies.cart ? req.cookies.cart : [];
  carts.push(req.params.name);
  res.cookie('cart', carts);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  let carts = req.cookies.cart ? req.cookies.cart : [];
  const cart = carts.map(element => coffee.find(coffee => coffee.name === element));
  res.render('cart', {
    layout: 'default',
    fullPrice: cart.reduce((sum, val) => val.price + sum, 0),
    items: cart
  });
});

app.post("/cart", (req, res) => {
  res.cookie('cart', []);
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  let userName;
  if (req.query.username) {
    userName = req.query.username;
  }
  else if (req.cookies.username) {
    userName = req.cookies.username;
  }
  else {
    userName = "NoName";
  }
  res.cookie("username", userName);
  res.render('login', {
    layout: 'default',
    username: userName
  });
});


app.listen(port, () => console.log(`App listening on port ${port}`));

app.use(express.static('.'));
