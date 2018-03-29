const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//passport config
require("./config/passport")(passport);

//load routes
const auth = require("./routes/auth");
const index = require('./routes/index');
const stories = require('./routes/stories');


//handlebars helpers
const {truncate, stripTags, formatDate, select, editIcon} = require('./helpers/hbs')

//map global promises for mongoose
mongoose.Promise = global.Promise;
//mongoose connect
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({
  helpers:{
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
  defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//express static path
app.use(express.static(path.join(__dirname, 'public')))


//cookie parser middleware
app.use(cookieParser());
app.use(
  session({
    secret: "forrest",
    resave: false,
    saveUninitialized: false
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//method-override middleware
app.use(methodOverride('_method'))

//set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//load routes
app.use('/', index)
app.use("/auth", auth);
app.use("/stories", stories);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
