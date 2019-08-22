const db = require("./utils/db");
const express = require("express");
const app = (exports.app = express());
const hb = require("express-handlebars");
const bc = require("./utils/bc");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { requireSignature, requireNoLogin } = require("./middleware");

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
});

app.get("/registration", requireNoLogin, function(req, res) {
    res.render("registration", {});
});

app.get("/login", requireNoLogin, function(req, res) {
    res.render("login", {});
});

app.get("/profile", function(req, res) {
    res.render("profile", {});
});

app.get("/profile/edit", function(req, res) {
    db.getUser(req.session.id)
        .then(data => {
            res.render("edit", {
                firstname: data.rows[0].firstname,
                lastname: data.rows[0].lastname,
                email: data.rows[0].email,
                age: data.rows[0].age,
                city: data.rows[0].city,
                homepage: data.rows[0].url
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/petition", function(req, res) {
    db.getSigId(req.session.id)
        .then(data => {
            req.session.sigid = data.rows[0].id;
            res.redirect("/petition/thanks");
        })
        .catch(err => {
            console.log("signature not available yet: ", err);
            res.render("petition", {});
        });
}); //renders sign petition template

app.get("/petition/thanks", requireSignature, function(req, res) {
    db.getSignature(req.session.id)
        .then(data => {
            res.render("thanks", {
                firstname: req.session.firstname,
                signature: data.rows[0].signature
            });
        })
        .catch(err => {
            console.log(err);
        });
}); //renders thanks for signing template

app.get("/petition/signers", requireSignature, function(req, res) {
    db.getSigners()
        .then(data => {
            console.log(data);
            res.render("signers", {
                names: data.rows
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/petition/signers/:city", requireSignature, function(req, res) {
    const city = req.params.city;
    db.getSignersFromCity(city)
        .then(data => {
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
        db.addUser(req.body.firstname, req.body.lastname, req.body.email, hash)
            .then(data => {
                req.session.id = data.rows[0].id;
                req.session.firstname = data.rows[0].firstname;
                res.redirect("/profile");
            })
            .catch(function(err) {
                console.log(err);
                res.render("registration", {
                    error: true
                });
            });
    });
});

app.post("/profile", function(req, res) {
    let url;
    if (!req.body.url) {
        url = null;
    } else if (req.body.url.startsWith("http")) {
        url = req.body.url;
    } else {
        url = "http://" + req.body.url;
    }
    db.addProfile(req.body.age, req.body.city, url, req.session.id)
        .then(function() {
            res.redirect("/petition");
        })
        .catch(function(err) {
            console.log("error when posting profile", err);
            res.render("profile", {
                error: true
            });
        });
});

app.post("/profile/edit", function(req, res) {
    let url;

    if (!req.body.url) {
        url = null;
    } else if (req.body.url.startsWith("http")) {
        url = req.body.url;
    } else {
        url = "http://" + req.body.url;
    }

    if (req.body.password == "") {
        db.editProfile(req.body.age, req.body.city, url, req.session.id)
            .then(
                db
                    .editUser(
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        req.session.id
                    )
                    .then(data => {
                        req.session.firstname = data.rows[0].firstname;
                        res.redirect("/petition");
                    })
                    .catch(err => {
                        console.log(err);
                        res.render("edit", {
                            error: true
                        });
                    })
            )
            .catch(err => {
                console.log("int error", err);
                res.render("edit", {
                    error: true
                });
            });
    } else {
        bc.hash(req.body.password).then(hash => {
            db.editProfile(req.body.age, req.body.city, url, req.session.id)
                .then(
                    db
                        .editUserAndPass(
                            req.body.firstname,
                            req.body.lastname,
                            req.body.email,
                            req.session.id,
                            hash
                        )
                        .then(data => {
                            req.session.firstname = data.rows[0].firstname;
                            res.redirect("/petition");
                        })
                        .catch(err => {
                            console.log(err);
                            res.render("profile/edit", {
                                error: true
                            });
                        })
                )
                .catch(err => {
                    console.log(err);
                    res.render("edit", {
                        error: true
                    });
                });
        });
    }
});

app.post("/petition", function(req, res) {
    db.addSignature(req.session.id, req.body.signature)
        .then(data => {
            req.session.sigid = data.rows[0].id;
            res.redirect("/petition/thanks");
        })
        .catch(function(err) {
            console.log(err);
            res.render("petition", {
                error: true
            });
        });
});

app.post("/petition/thanks", function(req, res) {
    db.deleteSignature(req.session.id)
        .then(function() {
            req.session.sigid = null;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/login", function(req, res) {
    db.getHash(req.body.email)
        .then(data => {
            bc.compare(req.body.password, data.rows[0].password).then(match => {
                if (match) {
                    req.session.id = data.rows[0].id;
                    req.session.firstname = data.rows[0].firstname;
                    res.redirect("/petition");
                } else {
                    res.render("login", {
                        error: true
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.render("login", {
                error: true
            });
        });
});

//for Heroku
app.listen(process.env.PORT || 8080, () => {
    console.log("my petition server is running");
});
