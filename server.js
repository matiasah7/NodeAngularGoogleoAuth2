var express = require("express"),
    googleapis = require("googleapis");

var app = express();

app.use(express.static("static"));

app.listen(8080);

console.log("Server running on port: 8080");


var OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(
    "625535433692-5fgd8odefejh8c4s191pdikdt0qkr8cp.apps.googleusercontent.com",
    "hLfK8oJOGE1zBOvPPOCCBBxa",
    "http://localhost:8080/oauthcallback");

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/youtube'
];

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
});

app.get("/url", function(req, res) {
    res.send(url);
});

app.get("/tokens", function(req, res) {
    var code = req.query.code;
    console.log(code);
    oauth2Client.getToken(code, function(err, tokens) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        console.log(tokens);
        oauth2Client.setCredentials(tokens);
        res.send("check node console for access tokens");
    });
});
