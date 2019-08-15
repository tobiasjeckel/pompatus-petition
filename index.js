// const db = require("db");
const express = require("express");
const app = express();
const hb = require("express-handlebars");

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.static("./public")); //for css

app.get("/", function(req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
            <head>
                <meta charset="utf-8">
                <link rel="stylesheet" href="styles.css">
                <title>Petition Landing Page</title>
            </head>
            <body>
                <h1>Petition to allow triple and sidewalk parking on all roads in Berlin!</h1>
                <p> Don't you hate it when you are driving your SUV in Berlin and can't find parking because the first and second row are already full? Make triple parking and sidewalk parking legal! Screw those pesky pedestrians! Walking is for commies!</p>
                <input type="text" name="first-name">
                <input type="text" name="last-name">
                <button id="submit-button" value="submit">Submit</button>
                <canvas id="sig" width="300" height="150"></canvas>
                <img src="https://www.notyourtypicaltourist.com/wp-content/uploads/2016/03/img_1465-800x445.jpg">
                <img src="https://www.berliner-zeitung.de/image/26920390/2x1/940/470/2af22b396fb1499c6e94956cc2df9783/oP/gehwehparken.jpg">
                <script src="/script.js" charset="utf-8"></script>
            </body>
        </html>


        `);
}); //welcome route

// db.getCities().then(function(result) {
//     console.log(result);
// });

app.listen(8080, () => {
    console.log("my express class server is running");
});
