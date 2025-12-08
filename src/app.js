const express = require("express");
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const connectDB = require("./middlewares/database");
const { authAdmin } = require("./middlewares/authAdmin");
const User = require("./models/user");

const app = express();

// express middleware to convert JSON to JS object
app.use(express.json());
app.use(cookieParser());

app.get("/hello/:name/:id", (req, res) => {
  res.send(req.params);
});

// User API calls START
app.post('/signup', async (req, res) => {
    // validate - use utils/helpers function
    try {
        // encrypt
        const encryptedPassword = await bcrypt.hash(req.body?.password, 5);
        const payload = {...(req.body ?? {}), password: encryptedPassword};
        const user = new User(payload);
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!validator.isEmail(email)) {
            throw new Error("email is not valid");
        }
        const user = await User.findOne( {email: email} );
        if(!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect) {
            // create a jwt token
            const token = await jwt.sign({ _id: user._id}, "devtinder@123");
            // set token to cookie
            res.cookie("token", token);
            res.send("Login successfull!!!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch(err) {
        res.status(400).send(err.message);
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

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const body = req.body;
    const allowedChanges = ["age", "gender", "description", "skills", "photoUrl"];
    const isUpdateAllowed = Object.keys(body).every(key => allowedChanges.includes(key));
    try {
        if(!isUpdateAllowed) {
            throw new Error("Update is not allowed for few keys");
        }
        const updatedUser = await User.findByIdAndUpdate(userId, body, 
                {returnDocument: 'after', runValidators: true});
        res.send(updatedUser);
    } catch(err) {
        res.status(400).send(err.message);
    }

})

app.get('/profile', authAdmin, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(401).send(err.message);
    }
})

app.post('/sendConnectionRequest', authAdmin, (req, res) => {
    res.send("req sent")
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
