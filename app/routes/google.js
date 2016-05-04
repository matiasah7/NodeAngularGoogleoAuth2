var googleapis = require("googleapis"),
    OAuth2 = googleapis.auth.OAuth2;

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


module.exports = function(app, express) {

    var googleRouter = express.Router();

    googleRouter.get("/url", function(req, res) {
        res.send(url);
    });

    googleRouter.get("/tokens", function(req, res) {
        var code = req.query.code;
        var plus = googleapis.plus('v1');
        // console.log(code);
        oauth2Client.getToken(code, function(err, tokens) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            // console.log(tokens);

// EJEMPLO DE OBTENER LOS DATOS DE GOOGLE + DEL USUARIO QUE HA HECHO LOGIN.

            oauth2Client.setCredentials(tokens);
            googleapis.options({
                auth: oauth2Client
            });
            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function(err, response) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                console.log(" ------------- Detalles de usuario ---------------");
                console.log("id: " + response.id);
                console.log("Name: " + response.displayName);
                console.log("Image url: " + response.image.url);
            });


// EJEMPLO DE BÚSQUEDA DE UN VIDEO EN YOUTUBE.

            var youtube = googleapis.youtube({
                version: 'v3',
                auth: oauth2Client
            });

            youtube.search.list({
                part: 'snippet',
                q: 'rubius',
                maxResults: 1
            }, function(err, response) {
                console.log("----------- Test buscar video ------------");
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                console.log(response.items);
            });


            res.send("check node console for access tokens and personal information");
        });
    });
    return googleRouter;
};
