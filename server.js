const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./public/assets/helpers/uuid.js');
const { clog } = require('./public/assets/middleware/clog');

const app = express();

app.use(clog);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

app.use(express.static('public'));

// TODO move these to helpers
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    const response = {
      status: 'success',
      body: newNote,
    };

    readAndAppend(newNote, './db/db.json');

    res.status(201).json(response);
  } else {
    res.status(500).json('Error in adding new note');
  }
});

app.post('/api/notes/:id', (req, res) => {
  res.send(`Find the array of notes - search for passed id ${req.params.id}`);
});

app.delete('/api/notes/:id', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const filteredNotes = json.filter((note) => {
        return note.id !== req.params.id;
      });
      writeToFile('./db/db.json', filteredNotes);
      // Respond to the DELETE request
      res.json(`Note ${req.params.id} has been deleted 🗑️`);
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
