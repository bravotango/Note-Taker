const express = require('express');
const path = require('path');
const routes = require('./routes');
const { clog } = require('./public/assets/middleware/clog');

const app = express();

app.use(clog);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
