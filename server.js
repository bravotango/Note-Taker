const express = require('express');
const path = require('path');
const routes = require('./routes');
const { colorLog } = require('./public/assets/middleware/colorLog');

const app = express();

app.use(colorLog);
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
  console.log(`\n\n🚀 App listening at http://localhost:${PORT}\n\n`)
);
