import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser());
app.use("/static" ,express.static('static'));
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
  res.sendFile(path.join('/menu'));
});

let menuItems = [
  {name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 998 },
  {name: "Espresso", image: "/static/img/espresso.jpg", price: 997},
  {name: "Flat-white", image: "/static/img/flat-white.jpg", price: 996}
];

let data = {};

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: menuItems
  });
});

app.get("/buy/:name", (req, res) => {
  let item;
  for(let it of menuItems) {
    if(it.name === req.params.name) {
      item = it;
    }
  }
  data[req.cookies.name].push(item);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {layout: "default", items: data[req.cookies.name]
  });
});

app.post("/cart", (req, res) => {
  data[req.cookies.name] = [];
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  if(req.query.name != undefined) {
    res.cookie('name', req.query.name);
    data[req.cookies.name] = data[req.cookies.name] || [];
    res.redirect('/login');
  } else {

    res.render("login", {
      layout: "default",
      name: req.cookies.name
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
