import express from 'express';
import * as path from 'path';
import hbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import {getPath} from './serverUtils.mjs';
const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser());

app.use('/static', express.static(path.join(rootDir, 'static')));

// Выбираем в качестве движка шаблонов Handlebars
app.set('view engine', 'hbs');

// Настраиваем пути и дефолтный view
app.engine(
    'hbs',
    hbs({
        extname: 'hbs',
        defaultView: 'default',
        layoutsDir: getPath(path, rootDir, '/views/layouts/'),
        partialsDir: getPath(path, rootDir, '/views/partials/'),
    })
);

app.listen(port, () => console.log(`App listening on port ${port}`));

export default app;

