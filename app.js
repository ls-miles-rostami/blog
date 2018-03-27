const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exphbs = require('express-handlebars');

//passport config
require("./config/passport")(passport);

//load routes
const auth = require("./routes/auth");
const index = require('./routes/index');
//map global promises for mongoose
mongoose.Promise = global.Promise;
//mongoose connect
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//express static path
app.use('/static', express.static(path.join(__dirname, 'public')))


//cookie parser middleware
app.use(cookieParser());
app.use(
  session({
    secret: "forrest",
    resave: false,
    saveUninitialized: false
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//load routes
app.use('/', index)
app.use("/auth", auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
