import 'app-module-path/register';

import { startCronJobs } from 'jobs/cron/start';
import * as Session from 'express-session';
import * as Express from 'express';
import * as parser from 'body-parser';
import * as CONFIG from 'constants/config';
import * as Store from 'express-mysql-session';
import { router } from 'api/router';

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
app.use(parser.json({ limit: '26mb' }));
app.use(parser.urlencoded({ extended: true, limit: '26mb' }));
app.get('/affiliate', (req, res) =>
  res.sendFile(__dirname + '/views/affiliate.html')
);
app.use('/static', Express.static(__dirname + '../web/dist'));
app.get('/panel', (req, res) => res.sendFile(__dirname + '/views/panel.html'));
app.use('/api/6', router);
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/app.html'));
app.get('/*', (req, res) => {
  if (!CONFIG.PROD) req.session.uid = 1;
  res.sendFile(__dirname + '/views/info.html');
});

if (CONFIG.CRON) startCronJobs();