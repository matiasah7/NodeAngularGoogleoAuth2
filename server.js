var express = require("express"),
    path = require("path");

var app = express();

app.use(express.static("public"));


var googleRoutes = require("./app/routes/google.js")(app, express);
app.use("/google", googleRoutes);

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
});

app.listen(8080);

console.log("Server running on port: 8080");
