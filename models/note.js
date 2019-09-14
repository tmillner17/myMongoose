const mongoose = require('mongoose');

var schema = mongooose.Schema;

var NoteSchema = new Schema ({
    title: String,
    body: String
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;