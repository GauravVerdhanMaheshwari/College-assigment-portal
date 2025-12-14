const mongoose = require("mongoose");

let gridFSBucket;

const connectGridFS = () => {
  const db = mongoose.connection.db;
  gridFSBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });
};

const getGridFSBucket = () => gridFSBucket;

module.exports = { connectGridFS, getGridFSBucket };
