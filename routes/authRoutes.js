const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router =express.Router();

router.post('/register', async (req, res) => {
    try{
        const{ name, email, phone, password, confirmPassword, agreeTerms } = req.body;

        if(!name || !email || !phone || !password || !confirmPassword){
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(password !== confirmPassword){
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if(!agreeTerms){
            return res.status(400).json({ message: 'You must agree to the terms and conditions' });
        }
        if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone number must be 10 digits' });
    }

    // Validate email (simple check)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }
     const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      // Respond with a friendly message which field is duplicate
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      } else {
        return res.status(400).json({ success: false, message: 'Phone number is already registered' });
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }

});
module.exports = router;