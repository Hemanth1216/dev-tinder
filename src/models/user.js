const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(email) {
            if(!validator.isEmail(email)) {
                throw new Error("email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 12
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("gender is not valid");
            }
        }
    },
    description: {
        type: String,
        default: "This is the default about the user",
        maxlength: "200"
    },
    skills: {
        type: [String],
        validate(skills) {
            if(skills.length > 3) {
                throw new Error("More than 3 skills are not allowed");
            }
        }
    },
    photoUrl: {
        type: String,
        validate(url) {
            if(!validator.isURL(url)) {
                throw new Error("photo url is not valid")
            }
        }
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);
module.exports = User;