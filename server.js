require('dotenv').config();
const express = require('express');
const mongoose =require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app =express();

app.get('/', (req, res) => res.send('Welcome to the API'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,   
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});