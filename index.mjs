import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static(path.join(rootDir, 'static')));

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
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu');
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
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      { name: "espresso", image: "/static/img/espresso.jpg", price: 888 },
      { name: "flat-white", image: "/static/img/flat-white.jpg", price: 777 },
      { name: "latte", image: "/static/img/latte.jpg", price: 666 },
      { name: "latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 555 },
    ],
  });
});

app.get("/buy/:name", (req, res) => {
  res.status(501).end();
});

app.get("/cart", (req, res) => {
  res.render("cart", {layout:"default"});
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
