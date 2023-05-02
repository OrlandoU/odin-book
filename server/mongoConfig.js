const mongoose = require("mongoose");

const mongoDb = 'mongodb+srv://orlando:Adeus2003@cluster0.xzhigzf.mongodb.net/odin-book?retryWrites=true&w=majority';

mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));