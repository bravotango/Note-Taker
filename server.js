const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/assets/helpers/uuid.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

const db = require('./db/db.json');

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.send(db);
});

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

app.post('/api/notes', (req, res) => {
  console.log(req.rawHeaders);
  console.info(`${req.method} request received to add a review`);
  console.log(`id, ${req.body.title}`);

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
    console.log(response);

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
  const findById = (n) => {
    n.id === req.params.id;
  };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.send(`error`);
      return;
    }
    const notes = JSON.parse(data);
    let found = "i'm empty";
    found = notes.forEach((note) => {
      return findById(note);
    });
    res.json(`found", ${req.params.id}`);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
