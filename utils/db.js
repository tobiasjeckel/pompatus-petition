const spicedPg = require("spiced-pg");
// const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

exports.testFunction = function() {
    console.log("db is working");
};

exports.addUser = function(firstname, lastname, email, hash) {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, firstname
        `,
        [firstname, lastname, email, hash]
    );
};

exports.addSignature = function(user_id, signature) {
    return db.query(
        `INSERT INTO signatures (user_id, signature)
        VALUES ($1, $2)
        RETURNING user_id`,
        [user_id, signature]
    );
};

exports.getSignature = function(user_id) {
    return db.query(
        `SELECT signature, user_id
        FROM signatures WHERE user_id = $1`,
        [user_id]
    );
};

exports.getHash = function(email) {
    return db.query(
        `SELECT password, id, firstname FROM users WHERE email = $1`,
        [email]
    );
};

exports.addProfile = function(age, city, url, user_id) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id
    `,
        [age, city, url, user_id]
    );
};

exports.getSigners = function() {
    return db.query(
        `SELECT firstname, lastname, age, city, url
        FROM users
        JOIN signatures
        ON users.id = signatures.user_id
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        `
    );
};
