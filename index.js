const db = require("./db");
const express = require("express");
const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//middleware
app.use(
    cookieSession({
        secret: `supersecret`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("X-frame-Options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static("./public")); //for css

//middleware end

app.get("/", function(req, res) {
    res.redirect("/petition");
}); //redirect route

app.get("/petition", function(req, res) {
    if (req.session.id) {
        res.redirect("/petition/signers");
    } else {
        res.render("petition", {});
    }
}); //renders welcome template

app.post("/petition", function(req, res) {
    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(data => {
            console.log(data);
            req.session.id = data.rows[0].id;
            res.redirect("/petition/thanks");
        })
        //if insert is successful then set session cookie and redirect to /thanks
        .catch(function(err) {
            console.log(err);
            res.render("petition", {
                csrfToken: req.csrfToken(),
                error: true
            }); // add class on to error message
        });
}); //post user input to database

app.get("/petition/thanks", function(req, res) {
    if (req.session.id) {
        db.getNameAndSignature(req.session.id).then(data => {
            console.log(data);
            res.render("thanks", {
                firstname: data.rows[0].firstname,
                signature: data.rows[0].signature
            });
        });
    } else {
        res.redirect("/petition");
    }
}); //renders thanks for signing template

app.get("/petition/signers", function(req, res) {
    if (req.session.id) {
        db.getSignatures().then(data => {
            res.render("signers", {
                names: data.rows
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.listen(8080, () => {
    console.log("my petition server is running");
});
