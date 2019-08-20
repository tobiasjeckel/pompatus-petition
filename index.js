const db = require("./utils/db");
const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bc = require("./utils/bc");
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
app.use(express.static("./public")); //for css

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("X-frame-Options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(function(req, res, next) {
    if (!req.session.id && req.url != "/registration" && req.url != "/login") {
        res.redirect("/registration");
    } else {
        next();
    }
});
//middleware end

app.get("/", function(req, res) {
    res.redirect("/registration");
}); //redirect route

app.get("/registration", function(req, res) {
    res.render("registration", {});
});

app.get("/login", function(req, res) {
    res.render("login", {});
});

app.get("/profile", function(req, res) {
    res.render("profile", {});
});

app.get("/petition", function(req, res) {
    console.log(
        "at petition site the user id and name is: ",
        req.session.id,
        req.session.firstname
    );
    db.getSignature(req.session.id)
        .then(data => {
            console.log(data);
            if (data.rows[0].user_id == undefined) {
                res.render("petition");
                console.log("signature not available yet");
            } else {
                console.log("this user has signed the petition ", data.user_id);
                res.redirect("/petition/thanks");
            }
        })
        .catch(err => {
            console.log("signature not available yet: ", err);
            res.render("petition", {});
        });
}); //renders sign petition template

app.get("/petition/thanks", function(req, res) {
    db.getSignature(req.session.id)
        .then(data => {
            res.render("thanks", {
                firstname: req.session.firstname,
                signature: data.rows[0].signature
            });
        })
        .catch(err => {
            console.log(err);
            // res.redirect("/login");
        });
}); //renders thanks for signing template

app.get("/petition/signers", function(req, res) {
    db.getSigners()
        .then(data => {
            console.log(data.rows);
            res.render("signers", {
                names: data.rows
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/petition/signers/:city", function(req, res) {
    const city = req.params.city;
    db.getSignersFromCity(city)
        .then(data => {
            console.log(data.rows);
            res.render("cities", {
                names: data.rows,
                city: req.params.city
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/logout", function(req, res) {
    if (req.session) {
        req.session = null;
        res.redirect("/login");
    } else {
        res.redirect("/login");
    }
});

app.post("/registration", function(req, res) {
    bc.hash(req.body.password).then(hash => {
        // console.log("hash: ", hash);
        db.addUser(req.body.firstname, req.body.lastname, req.body.email, hash)
            .then(data => {
                // console.log(data);
                req.session.id = data.rows[0].id;
                req.session.firstname = data.rows[0].firstname;
                res.redirect("/profile");
            })
            .catch(function(err) {
                console.log(err);
                res.render("registration", {
                    // csrfToken: req.csrfToken(),
                    error: true
                });
            });
    });
});

app.post("/profile", function(req, res) {
    let url;
    if (req.body.url.startsWith("http")) {
        url = req.body.url;
    } else {
        url = "http://" + req.body.url;
    }
    db.addProfile(req.body.age, req.body.city, url, req.session.id)
        .then(data => {
            console.log("successful enter of profile data: ", data);
            res.redirect("/petition");
        })
        .catch(function(err) {
            console.log("error when posting profile", err);
            res.render("profile", {
                error: true
            });
        });
});

app.post("/petition", function(req, res) {
    db.addSignature(req.session.id, req.body.signature)
        .then(data => {
            console.log(data);
            res.redirect("/petition/thanks");
        })
        //if insert is successful then set session cookie and redirect to /thanks
        .catch(function(err) {
            console.log(err);
            res.render("petition", {
                // csrfToken: req.csrfToken(),
                error: true
            }); // add class on to error message
        });
}); //post user input to database

app.post("/login", function(req, res) {
    db.getHash(req.body.email)
        .then(data => {
            console.log(data);
            bc.compare(req.body.password, data.rows[0].password).then(match => {
                console.log("match: ", match);
                if (match) {
                    req.session.id = data.rows[0].id;
                    req.session.firstname = data.rows[0].firstname;
                    res.redirect("/petition");
                } else {
                    res.render("login", {
                        // csrfToken: req.csrfToken(),
                        error: true
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.render("login", {
                // csrfToken: req.csrfToken(),
                error: true
            });
        });
});

// app.listen(8080, () => {
//     console.log("my petition server is running");
// });

//for Heroku
app.listen(process.env.PORT || 8080, () => {
    console.log("my petition server is running");
});
