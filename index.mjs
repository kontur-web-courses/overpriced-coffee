import express, {response} from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let items = new Array();

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

app.use(express.static('.'))

app.get("/", (_, res) => {
  res.redirect('/menu')
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
      },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 1929 },
      { name: "Exclusive Old Tarantulo", image: "/static/img/beer.jpg", price: 1.50 },
      { name: "Latte", image: "/static/img/latte.jpg", price: 790 },
      { name: "Espresso", image: "/static/img/espresso.jpg", price: 890 },
      { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 790 }
    ],
  });
});

app.get("/buy/:name", (req, res) => {
  items.push(req.params);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: items
  });
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
