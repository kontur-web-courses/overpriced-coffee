import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'))
app.use(cookieParser());

const carts = {};

const menu = [
    {
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
      name: "Espresso",
      image: "/static/img/espresso.jpg",
      price: 999
    },
    {
      name: "Flat White",
      image: "/static/img/flat-white.jpg",
      price: 999
    },
    {
      name: "Latte",
      image: "/static/img/latte.jpg",
      price: 999
    },
    {
      name: "Latte Macchiato",
      image: "/static/img/latte-macchiato.jpg",
      price: 999
    }];

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
  res.redirect('/menu')
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: menu,
  });
});

app.get("/buy/:name", (req, res) => {
    let username = req.cookies.username;
    if (!carts[username]){
        res.redirect("/login");
    }
    carts[username].push({...(menu.find(coffee => coffee.name === req.params.name))});
    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    let username = req.cookies.username;
    if (!carts[username]){
        res.redirect("/login");
    }
    res.render('cart', {
        layout: 'default',
        fullPrice: carts[username].reduce((summ, curVal) => curVal.price + summ, 0),
        items: carts[username]
    });
});

app.post("/cart", (req, res) => {
    let username = req.cookies.username;
    carts[username] = []
    res.redirect('/cart');
});

app.get("/login", (req, res) => {
    let username;
    if (req.query.username) {
        username = req.query.username;
    } else if (req.cookies.username) {
        username = req.cookies.username;
    } else {
        username = "Аноним"
    }

    if (!carts[username]){
        carts[username] = [];
    }

    res.cookie("username", username);
    res.render('login', {
        layout: "default",
        username: username
    })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
