import express from 'express';
import * as path from 'path';
import hbs from 'express-handlebars';
import cookieParser from 'cookie-parser';

const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use(cookieParser());

const items = [
    {
        name: 'Americano',
        image: '/static/img/americano.jpg',
        price: 999,
    },
    { name: 'Cappuccino', image: '/static/img/cappuccino.jpg', price: 999 },
    { name: 'Espresso', image: '/static/img/espresso.jpg', price: 999 },
    { name: 'Flat-white', image: '/static/img/flat-white.jpg', price: 999 },
    { name: 'Latte-macchiato', image: '/static/img/latte-macchiato.jpg', price: 999 },
    { name: 'Latte', image: '/static/img/latte.jpg', price: 999 },
];

const users = new Map();

app.use('/static', express.static(path.join(rootDir, 'static')));

app.get('/', (_, res) => {
    res.redirect('/menu');
});

// Выбираем в качестве движка шаблонов Handlebars
app.set('view engine', 'hbs');

// Настраиваем пути и дефолтный view
app.engine(
    'hbs',
    hbs({
        extname: 'hbs',
        defaultView: 'default',
        layoutsDir: path.join(rootDir, '/views/layouts/'),
        partialsDir: path.join(rootDir, '/views/partials/'),
    })
);

app.get('/', (_, res) => {
    res.sendFile(path.join(rootDir, '/static/html/index.html'));
});

app.get('/menu', (_, res) => {
    res.render('menu', {
        layout: 'default',
        title: 'Menu',
        items,
    });
});

app.get('/buy/:name', (req, res) => {
    const selectedCoffe = items.find((item) => item.name === req.params.name);
    let currentUser = getCurrentUser(req);
    currentUser.personalCartItems.push(selectedCoffe);
    currentUser.personalTotalPrice += selectedCoffe.price;
    res.redirect('/menu');
});

app.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Cart',
        layout: 'default',
        items: getCurrentUser(req).personalCartItems,
        totalPrice: getCurrentUser(req).personalTotalPrice,
    });
});

app.post('/cart', (req, res) => {
    let currentUser = getCurrentUser(req);
    currentUser.personalCartItems = [];
    currentUser.personalTotalPrice = 0;
    res.redirect('/cart');
});

app.get('/login', (req, res) => {
    let cookieName = req.cookies.currentUserName;
    let name = 'Аноним';

    if (req.query.username && req.query.username !== cookieName) {
        name = req.query.username;
        res.cookie('currentUserName', name);
    } else if (cookieName) {
        name = cookieName;
    }
    
    if (!users.get(name) || name === 'Аноним') {
        users.set(name, { personalCartItems: [], personalTotalPrice: 0 });
    }
    res.render('login', {
        title: 'Login',
        layout: 'default',
        userName: name,
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));

function getCurrentUser(req) {
    if (!req.cookies.currentUserName) {
        return users.get('Аноним');
    }
    return users.get(req.cookies.currentUserName);
}
