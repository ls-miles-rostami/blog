const GoogleStrategy = require("passport-google-oauth20").Strategy;

const mongoose = require("mongoose");
const keys = require("./keys");
const User = require("../models/User");

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log("accessToken: ", accessToken, "profile: ", profile);
        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf("?")
        );
        const newUser = {
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: image
        };
        //Check for existing user
        User.findOne({ googleId: profile.id })
          .exec()
          .then(user => {
            if (user) {
              //return user
              done(null, user);
            } else {
              // create user
              new User(newUser).save().then(user => done(null, user));
            }
          });
      }
    )
  );

  //passport sends a cookie to the browser containing the user.id
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //when the user comes back to the site, the deserialize method will take this cookie containing the id set by the serialize
  // and look in the the database, if it finds it it will find the user and pass it along.
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
