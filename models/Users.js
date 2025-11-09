const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique:true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    phone:{
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        unique: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'],
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;