const db = require("db");

db.getCities().then(function(result) {
    console.log(result);
});
