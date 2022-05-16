import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let users = [];

// let cartItems = [];

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");

app.use('/static', express.static('static'));
app.use(cookieParser());

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
  res.redirect("/menu");
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 99,
      },
      { name: "Cappuccino",
        image: "/static/img/cappuccino.jpg",
        price: 99
      },
      { name: "Espresso",
        image: "/static/img/espresso.jpg",
        price: 99
      },
      { name: "Latte",
        image: "/static/img/latte.jpg",
        price: 99
      },
      { name: "Latte-macchiato",
        image: "/static/img/latte-macchiato.jpg",
        price: 99
      },
      { name: "Flat-white",
        image: "/static/img/flat-white.jpg",
        price: 99
      }
    ],
  });
});

app.get("/buy/:name", (req, res) => {
  let username = "Аноним";
  try {
    username = req.cookies.username;
  } catch (TypeError) {
    console.dir("no such cookie");
  }
  let item = req.params.name;
  let user = users.filter(e => {
    return e.name === username
  })[0];

  let userCart = user.cartItems;

  userCart.push({
    name: item,
    image: "/static/img/" + item.toLowerCase() + ".jpg",
    price: 99
  });
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  let username = "Аноним";
  try {
    username = req.cookies.username;
  } catch (TypeError) {
    console.dir("no such cookie");
  }
  let user = users.filter(e => {
    return e.name === username
  })[0];

  let userCart = user.cartItems;

  let total = 0;
  userCart.forEach(function(e) {
    total += e.price;
  });

  res.render("cart", {
    layout: "default",
    items: userCart,
    total: total
  });
});

app.post("/cart", (req, res) => {
  let username = "Аноним";
  try {
    username = req.cookies.username;
  } catch (TypeError) {
    console.dir("no such cookie");
  }
  let user = users.filter(e => {
    return e.name === username
  })[0].cartItems = [];
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  let username = "Аноним";
  try {
    username = req.cookies.username;
  } catch (TypeError) {
    console.dir("no such cookie");
  }

  res.render("login", {
    layout: "default",
    username: username
  });

  let name = req.query.username;
  if (name) {
    res.cookie('username', name);
    users.push({name: name, cartItems: []});
  }

});


app.listen(port, () => console.log(`App listening on port ${port}`));
