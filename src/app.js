const express = require("express");
const {authAdmin} = require("./middlewares/authAdmin");

const app = express();


// middleware to check admin authentication
app.use("/admin", (req, res, next) => {
    console.log("In admin auth check");
    const authenticated = true;
    if(!authenticated) {
        res.status(401).send("Unauthorised request");
    } else {
        console.log("In auth check before next");
        next();
    }
})

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/hello", (req, res) => {
    console.log(req.query);
    res.send("Hello world from hello path route");
});

app.get("/hello/:name/:id", (req, res) => {
    res.send(req.params)
})

// middleware to check admin authentication using utils folder
app.get("/test", authAdmin, (req, res, next) => {
    console.log("in 1");
    next();
}, (req, res) => {
    console.log("in 2");
    res.send("From 2");
})

app.get("/admin/getData", (req, res) => {
    res.send("This is all the data about admin");
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
