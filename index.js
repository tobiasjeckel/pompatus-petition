// const db = require("db");
const express = require("express");
const app = express();
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

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
    res.render("welcome", {});
}); //renders welcome template

app.post("/petition", function(req, res) {
    req.body(); // expect first name, last name and signature
    res.send(); // send to database

    //if insert into database fails then
    res.render("welcome", {}); // add class on to error message
    //if insert is successful then redirect to /thanks
    res.redirects("thanks", {});
}); //post user input to database

app.get("/thanks", function(req, res) {
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
