var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id } , function (err, user) {
    done(err, user);
  });
});
  

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({email: email }, function(err, user){
      if (err) return done(err);
      if (!user){
        return done(null, false, {message: 'Incorrect email.'});
      }
      
      User.verifyPassword(user, password, function(err, correct){
        if (correct && User.checkAdmin(user)) {
          return done(null, user, {admin: true});
        } else if (correct) {
          return done(null, user, {admin: false});
        } else { 
          return done(null, false, {message: 'Incorrect password.'});
        }
      });
    });
  }
));