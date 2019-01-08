import 'app-module-path/register';

import * as Session from 'express-session';
import * as Express from 'express';
import * as parser from 'body-parser';
import * as CONFIG from 'constants/config';
import * as Store from 'express-mysql-session';
import { router } from 'api/router';
import * as path from 'path';
import { cron } from 'jobs/cron';

// @ts-ignore
const SessionStore = Store(Session);
const app = Express();

app.listen(CONFIG.PORT, () => console.log('Listening on port', CONFIG.PORT));

app.use(
  Session({
    store: new SessionStore(CONFIG.MYSQL),
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
if (!CONFIG.PROD) {
  app.use((req, res, next) => {
    req.session.uid = 1;
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
}
app.use(parser.json({ limit: '26mb' }));
app.use(parser.urlencoded({ extended: true, limit: '26mb' }));
app.get('/affiliate', (req, res) =>
  res.sendFile(__dirname + '/views/affiliate.html')
);
app.use('/static', Express.static(__dirname + '../web/dist'));
app.use('/api/6', router);
app.get('/*', (req, res) =>
  res.sendFile(path.resolve(CONFIG.DIRECTORIES.CLIENT, 'dist', 'index.html'))
);

if (CONFIG.CRON) cron();
