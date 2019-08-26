// index.test.js
const supertest = require("supertest");
const { app } = require("./index");
const cookieSession = require("cookie-session");

// if (require.main == module) {
//     app.listen(process.env.PORT || 8080);
// }

//test1
test("Users who are logged out are redirected to the registration page when they attempt to go to the petition page", () => {
    return supertest(app)
        .get("/petition")
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/registration");
        });
});

//test2a
test("Users who are logged in are redirected to the petition page when they attempt to go to the registration page", () => {
    cookieSession.mockSessionOnce({
        id: true
    });
    return supertest(app)
        .get("/registration")
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/petition");
        });
});

//test2a
test("Users who are logged in are redirected to the petition page when they attempt to go to the login page", () => {
    cookieSession.mockSessionOnce({
        id: true
    });
    return supertest(app)
        .get("/login")
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/petition");
        });
});

//test3

test("Users who are logged in and have signed the petition are redirected to the thank you page when they attempt to go to the petition page or submit a signature", () => {
    cookieSession.mockSessionOnce({
        id: true,
        sigid: true
    });
    return supertest(app)
        .get("/petition")
        .then(res => {
            // expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/petition/thanks");
        });
});
