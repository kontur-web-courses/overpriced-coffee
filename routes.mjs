import express from 'express';
import {items} from './serverUtils.mjs';
import {users} from './serverUtils.mjs';
import {getCurrentUser} from './serverUtils.mjs';
const router = express.Router();

router.get('/', (_, res) => {
    res.redirect('/menu');
});

router.get('/', (_, res) => {
    res.sendFile(path.join(rootDir, '/static/html/index.html'));
});

router.get('/menu', (_, res) => {
    res.render('menu', {
        layout: 'default',
        title: 'Menu',
        items,
    });
});

router.get('/buy/:name', (req, res) => {
    const selectedCoffe = items.find((item) => item.name === req.params.name);
    let currentUser = getCurrentUser(req);
    currentUser.personalCartItems.push(selectedCoffe);
    currentUser.personalTotalPrice += selectedCoffe.price;
    res.redirect('/menu');
});

router.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Cart',
        layout: 'default',
        items: getCurrentUser(req).personalCartItems,
        totalPrice: getCurrentUser(req).personalTotalPrice,
    });
});

router.post('/cart', (req, res) => {
    let currentUser = getCurrentUser(req);
    currentUser.personalCartItems = [];
    currentUser.personalTotalPrice = 0;
    res.redirect('/cart');
});

router.get('/login', (req, res) => {
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

export default router;
