const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//passport config
require('./config/passport')(passport)

//load routes
const auth = require('./routes/auth');


const app = express();






app.get('/', (req,res) => {
  res.send('Welcome to StoryBooks');
})


app.use('/auth', auth)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})