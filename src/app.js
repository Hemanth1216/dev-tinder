const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/hello", (req, res) => {
    res.send("Hello world from hello path route");
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
