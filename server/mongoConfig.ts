import mongoose, { Connection } from "mongoose";

const mongoDb: any = process.env.MongoDb_uri;
mongoose.connect(mongoDb );
const db: Connection = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
