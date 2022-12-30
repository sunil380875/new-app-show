const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const server = http.createServer(app);

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.set("strictQuery", false);
mongoose.connect(DB, () => {
  console.log("db connection successful");
});
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Listening at port number ${port}`);
});
