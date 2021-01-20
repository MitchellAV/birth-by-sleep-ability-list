const express = require("express");
const app = express();

const ejs = require("ejs");

const path = require("path");

app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/json", require("./routes/createJSON"));
app.use("/ability", require("./routes/ability"));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
