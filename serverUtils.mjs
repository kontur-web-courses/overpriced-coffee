export function getPath(path, rootDir, neededPath) {
    return path.join(rootDir, neededPath)
}

export const items = [
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

export const users = new Map([['Аноним', { personalCartItems: [], personalTotalPrice: 0 }]]);

export function getCurrentUser(req) {
    if (!req.cookies.currentUserName) {
        return users.get('Аноним');
    }
    return users.get(req.cookies.currentUserName);
}