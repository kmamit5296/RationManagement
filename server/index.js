/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const pdf = require('html-pdf');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '100Mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Set headers to prevent caching of index.html
app.get('/', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });
  next();
});

app.get('/data', (req, res) => {
  console.time('fetching'); // eslint-disable-line
  fs.readFile('server/data.json', (err, data) => {
    if (err) {
      console.error(err); // eslint-disable-line
      res.status(500).json({ error: err });
      return;
    }
    console.timeEnd('fetching'); // eslint-disable-line
    res.json(JSON.parse(data.toString()));
  });
});

app.post('/data', (req, res) => {
  console.time('saving'); // eslint-disable-line
  fs.writeFile('server/data.json', JSON.stringify(req.body), err => {
    if (err) {
      console.error(err); // eslint-disable-line
      res.status(500).json({ error: err });
      return;
    }
    console.timeEnd('saving'); // eslint-disable-line
    res.json({});
  });
});

app.get('/pdf', (req, res) => {
  fs.readFile('server/data.json', (err, data) => {
    if (err) {
      console.error(err); // eslint-disable-line
      res.status(500).json({ error: err });
      return;
    }
    data = JSON.parse(data.toString());
    const monthData = data.monthlyData[req.query.month];
    const accData = data.accounts.filter(acc => !monthData.includes(acc.rationNumber));
    const contents = fs.readFileSync('server/accounts.ejs', 'utf-8');

    let options = {
                "height": "11in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                }
            };
    const html = ejs.render(contents, { accData });
    pdf.create(html, options).toFile("server/report.pdf", function (err, data) {
        if (err) {
            res.send(err);
        } else {
            const readStream = fs.createReadStream(data.filename);
            readStream.on('open', function () {
              readStream.pipe(res);
            });
            readStream.on('close', function () {
              fs.unlinkSync(data.filename);
            });
            readStream.on('error', function (err) {
              console.log(err); // eslint-disable-line
            });
        }
    });
  });
});


// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
