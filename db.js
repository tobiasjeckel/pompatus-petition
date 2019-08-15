const spicedPg = require("spiced-pg");
const db = spicedPG(`postgres:postgres:postgres@localhost:5432/cities`);

exports.getCities = function() {
    return db.query(`SELECT * FROM cities`);
};
