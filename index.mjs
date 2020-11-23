import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let cart = new Map();
let history = new Map();
const coffeeArray = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 350,
  },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 755 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 999 },
  { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 1350 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 1500 },]

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
app.use(cookieParser())
app.use('/static', express.static('static'))
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
    items: coffeeArray,
    title: "Меню"
  });
});

app.get("/buy/:name", (req, res) => {
  if(getName(req)){
    if(!cart.has(getName(req)))
     cart.set(getName(req), new Map())
  let coffeeName = req.params.name;
  let tempCart = cart.get(getName(req))
  if (tempCart.has(coffeeName)) {
    tempCart.set(coffeeName, tempCart.get(coffeeName) + 1);
  }
  else {
    tempCart.set(coffeeName, 1);
  }
  res.redirect('/menu');
}else

res.redirect('/login')
});

app.get("/cart", (req, res) => {
  let resArray = []
  let fullPrice = 0
  if(getName(req)){
    if(!cart.has(getName(req)))
     cart.set(getName(req), new Map());
    let tempCart = cart.get(getName(req))
    for(let [name, count] of tempCart){
      const price = coffeeArray.find(e => e.name === name).price;
      resArray.push({
        name: name,
        count: count,
        image: `/static/img/${name}.jpg`,
        pricePerOne: price,
        price: price * count
      });
      fullPrice += price * count;
    }
    res.render("cart", {
      title: "Корзина",
      layout: "default",
      items: resArray,
      fullPrice: fullPrice
    });
  }
else
  res.redirect('/login')
});

app.post("/cart", (req, res) => {
  if(getName(req)){
    if(!history.has(getName(req)))
      history.set(getName(req), []);
    let deletingMap = new Map(cart.get(getName(req)))
    history.get(getName(req)).push(deletingMap);
    history.set(getName(req), history.get(getName(req)))
    cart.get(getName(req)).clear();
    res.redirect('/cart');
  }
    else
      res.redirect('/login')
});

app.get("/history", (req, res) => {
  if(getName(req)){
    if(!history.has(getName(req)))
      history.set(getName(req), []);
    let tempHistory = history.get(getName(req));
    let resArray = [];
    for(let array of tempHistory){
      for(let [name, count] of array){
        const price = coffeeArray.find(e => e.name === name).price;
        resArray.push({
          name: name,
          count: count,
          image: `/static/img/${name}.jpg`,
          pricePerOne: price,
          price: price * count
        });
      }
    }
    res.render("history", {
      title: "История заказов",
      layout: "default",
      items: resArray
    });
  }
    else
      res.redirect('/login')
});


app.get("/login", (req, res) => {
    if(req.query.name){
      if(cart.has(req.query.name))
        res.status(418).end();
        else{
          res.cookie('name', req.query.name);
          res.redirect('/menu')
          cart.set(req.query.name, new Map())
        }
    }else{
      let login = 'Аноним'
      if(getName(req))
        login = getName(req)
      res.render("login", {
        title: "Личный кабинет",
        layout: "default",
        login: login
      });
    }
});

app.listen(port, () => console.log(`App listening on port ${port}`));

function getName(req){
  return req.cookies['name'];
}