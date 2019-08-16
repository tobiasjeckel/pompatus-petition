const db = require("./db");
const express = require("express");
const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    cookieSession({
        secret: `secretPorsche`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.static("./public")); //for css

app.get("/", function(req, res) {
    res.redirect("/petition");
}); //redirect route

app.get("/petition", function(req, res) {
    res.render("petition", {});
}); //renders welcome template

app.post("/petition", function(req, res) {
    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(id => {
            console.log(id);
            req.session.id = id;
        })
        //if insert is successful then set session cookie and redirect to /thanks
        .then(function() {
            res.redirect("/petition/thanks");
        })
        .catch(function(err) {
            console.log(err);
            res.render("welcome", {}); // add class on to error message
        });
}); //post user input to database

app.get("/petition/thanks", function(req, res) {
    res.render("thanks", {});
}); //renders thanks for signing template, set cookie to remember that user signed

app.get("/signers", function(req, res) {
    res.render("signers", {});
}); //renders thanks for signing template, set cookie to remember that user signed

app.listen(8080, () => {
    console.log("my petition server is running");
});

// db.getCities().then(function(result) {
//     console.log(result);
// });
