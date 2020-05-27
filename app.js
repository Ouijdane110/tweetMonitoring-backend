// Libs
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Functions
const Twitter = require('./functions/twitterFunctions');

// Environnements variables
dotenv.config();

// Database connexion
mongoose.connect(
    process.env.DB_CONNECT,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('Connected to DB')
)

// Twiter fetch data :
Twitter.twitterFetchDataByCountry(615702);

// Create app Express :
const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

// Routes
app.use('/api/auth/user', require('./routes/userRoute'))
app.use('/api/keyword', require('./routes/keywordRoute'))

// Start the server
const port = process.env.PORT || 5000
app.listen(port);

console.log(`Server listening at ${port}, ${process.env.DB_CONNECT}`)
