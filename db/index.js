const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);
const dbFile = 'db/db.json';

class DB {
  read() {
    return readFromFile(dbFile, 'utf-8');
  }

  write(note) {
    return writeToFile(dbFile, JSON.stringify(note));
  }

  readNotes() {
    return this.read().then((data) => {
      let parsedNotes;

      try {
        parsedNotes = [].concat(JSON.parse(data));
      } catch (err) {
        parsedNotes = [];
      }

      return parsedNotes;
    });
  }

  writeNotes(note) {
    const { title, text } = note;

    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    return this.readNotes()
      .then((data) => [...data, newNote])
      .then((updated) => this.write(updated))
      .then(() => newNote);
  }

  deleteNote(id) {
    return this.readNotes()
      .then((data) => data.filter((note) => note.id !== id))
      .then((updated) => this.write(updated));
  }
}

module.exports = new DB();
