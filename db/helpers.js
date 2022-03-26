import mongoose from "mongoose";
export async function connectToDb() {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const connectToDb = process.env.MONGODB_URL
    ? process.env.MONGODB_URL
    : "mongodb://127.0.0.1:27017/findMeADoc";
  return mongoose.connect(connectToDb, opts);
  //   return mongoose.connect("mongodb://127.0.0.1:27017/findADoc", opts);
}

export async function disconnectDb() {
  if (mongoose.connection !== 0) {
    return mongoose.disconnect();
  }
}
export async function dropDatabase() {
  mongoose.connection.db.dropDatabase();
}
