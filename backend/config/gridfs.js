const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs;

mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

module.exports = {
  getGfs: () => gfs,
};
