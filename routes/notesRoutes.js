const notes = require('express').Router();
const db = require('../db');

notes.get('/api/notes', (req, res) => {
  db.readNotes()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => res.status(500).json(err));
});

notes.post('/api/notes', (req, res) => {
  db.writeNotes(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

notes.post('/api/notes/:id', (req, res) => {
  res.send(`Find the array of notes - search for passed id ${req.params.id}`);
});

notes.delete('/api/notes/:id', (req, res) => {
  db.deleteNote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch((err) => res.status(500).json(err));
});

module.exports = notes;
