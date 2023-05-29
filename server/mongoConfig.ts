import mongoose from "mongoose";

const mongoDb: any = process.env.MongoDb_uri;
mongoose.connect(mongoDb );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));