require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fileupload = require("express-fileupload");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");

var app = express();
const PORT = process.env.PORT || 4880;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

require("./socket/socket")(io);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/admin", express.static(path.join(__dirname, "public")));

app.use(fileupload());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

const buildpath = path.resolve(__dirname, "../client/build");
app.use(express.static(buildpath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildpath, "index.html"));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
