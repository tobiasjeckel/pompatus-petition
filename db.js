const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.testFunction = function() {
    console.log("db is working");
};

exports.getSignatures = function() {
    return db
        .query(`SELECT firstname, lastname FROM signatures`)
        .catch(function(err) {
            console.log(err);
        });
};

exports.addSignature = function(firstname, lastname, signature) {
    return db.query(
        `INSERT INTO signatures (firstname, lastname, signature)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [firstname, lastname, signature]
    );
};

exports.getNameAndSignature = function(id) {
    return db
        .query(
            `SELECT firstname, signature
        FROM signatures WHERE id = $1`,
            [id]
        )
        .catch(err => {
            console.log(err);
        });
};
