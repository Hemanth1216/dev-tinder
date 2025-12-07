const express = require("express");
const connectDB = require("./middlewares/database");
const { authAdmin } = require("./middlewares/authAdmin");
const User = require("./models/user");

const app = express();

// express middleware to convert JSON to JS object
app.use(express.json());

// middleware to check admin authentication
app.use("/admin", (req, res, next) => {
  console.log("In admin auth check");
  const authenticated = true;
  if (!authenticated) {
    res.status(401).send("Unauthorised request");
  } else {
    console.log("In auth check before next");
    next();
  }
});

app.get("/hello/:name/:id", (req, res) => {
  res.send(req.params);
});

// middleware to check admin authentication using utils folder
app.get(
  "/test",
  authAdmin,
  (req, res, next) => {
    console.log("in 1");
    next();
  },
  (req, res) => {
    console.log("in 2");
    res.send("From 2");
  }
);

app.get("/admin/getData", (req, res) => {
  res.send("This is all the data about admin");
});

// User API calls START
app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User created successfully");
    } catch {
        res.status(400).send("unable to create user due to bad details");
    }
})

app.post('/user', async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({email: email}); 
        if(!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch {
        res.status(500).send("something went wrong");
    }
}) ;

app.get('/users', async(req, res) => {
    try{
        const users = await User.find({});
        if(users.length > 0) {
            res.send(users);
        } else {
            res.status(404).send("Users not found");
        }
    } catch {
        es.status(500).send("something went wrong");
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        if(userId) {
            await User.findByIdAndDelete(userId);
            res.send("user deleted");
        } else {
            res.status(400).send("No userid");
        }
    } catch {
        res.status(500).send("something went wrong");
    }
})

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const body = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, body, {returnDocument: 'after'});
        res.send(updatedUser);
    } catch {
        res.status(500).send("something went wrong");
    }

})

// User API calls END

connectDB()
  .then(() => {
    console.log("DB connection is succcessful");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);

    console.error("DB connection failure");
  });
