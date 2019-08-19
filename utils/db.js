const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.testFunction = function() {
    console.log("db is working");
};

exports.addUser = function(firstname, lastname, email, hash) {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [firstname, lastname, email, hash]
    );
};

exports.getSignatures = function() {
    return db
        .query(`SELECT firstname, lastname FROM signatures`)
        .catch(function(err) {
            console.log(err);
        });
};

exports.addSignature = function(user_id, signature) {
    return db.query(
        `INSERT INTO signatures (user_id, signature)
        VALUES ($1, $2)
        RETURNING id`,
        [user_id, signature]
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
