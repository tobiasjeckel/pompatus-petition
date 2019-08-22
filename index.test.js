// index.test.js
const supertest = require("supertest");
const { app } = require("./index");

test("GET /petition returns 200 status code", () => {
    return supertest(app)
        .get("/petition")
        .then(res => {
            console.log("res: ", res);
        });
});
