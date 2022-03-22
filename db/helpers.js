import mongoose from "mongoose";
export async function connectToDb() {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const connectToDb = process.env.CONNECTION_STRING
    ? process.env.CONNECTION_STRING
    : "mongodb://127.0.0.1:27017/findADoc";
  // return mongoose.connect(connectToDb, opts);
    return mongoose.connect("mongodb://127.0.0.1:27017/FindMeADoc", opts);
}

export async function disconnectDb() {
  if (mongoose.connection !== 0) {
    return mongoose.disconnect();
  }
}
export async function dropDatabase() {
  mongoose.connection.db.dropDatabase();
}
