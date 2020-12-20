import app from './expressSettings.mjs';
import router from './routes.mjs';

app.use('/', router);