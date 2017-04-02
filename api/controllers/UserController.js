var passport = require('passport');

module.exports = {
  
  login: function (req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        req.addFlash('failed', info.message);    
        return res.redirect('/login');
      }
    req.logIn(user, function(err) {
      if (err) res.send(err);
      info.admin ? req.session.admin = true : req.session.admin = false;
      return res.redirect('/caserecord');
      });
    })(req, res);
  },
  
  logout: function (req, res) {
    req.logout();
    req.addFlash('success', 'Logged out successfully'); 
    return res.redirect('/login');
  },

  find: function(req, res){
    User.find().sort('company_name ASC').exec(function(err, users){
      if (err) return res.serverError(err);
      res.view({users: users, pageTitle: 'Manage Users'});
    })
  },
  
  'new': function(req,res) {
    res.view({pageTitle: 'Create User'});
  },
  
  create: function(req, res){
    var newUserData = req.body.user;
    User.create(newUserData).exec(function(err, users){
      if (err) return res.serverError(err);
      res.redirect('user');
    })
  },
  
  findone: function(req, res){
    if (isNaN(parseInt(req.params.id))) return res.notFound('Could not find user, sorry.');
    User.findOne({id: req.params.id}).exec(function(err, user){
      if (err) return res.serverError(err);
      if (!user) return res.notFound('Could not find user, sorry.');
      res.view('user/findone', {user: user, pageTitle: 'Edit User'});     
    })
  },
  
  editprofile: function(req, res){
    if (req.params.id != req.session.passport.user) return res.forbidden();
    if (isNaN(parseInt(req.params.id))) return res.notFound('Could not find user, sorry.');
    User.findOne({id: req.params.id}).exec(function(err, user){
      if (err) return res.serverError(err);
      if (!user) return res.notFound('Could not find user, sorry.');
      res.view('user/editprofile', {user: user, pageTitle: 'Edit Profile'});     
    })
  },
  
  update: function(req, res){
    var submittedData = req.body.user,
        userData = {};
        
    userData = parseSubmittedData(submittedData);
    updateUser(req.params.id, userData, function(err, done){
      if (err) return res.serverError(err);
      return res.redirect('user');
    });
  },
  
  updateeditprofile: function(req, res){
    var submittedData = req.body.user;
    
    User.findOne({id: req.params.id}).exec(function(err, user){
      if (err) return res.notFound('user not found');
              
      User.verifyPassword(user, submittedData.current_password, function(err, correct){
        if (correct) {
          userData = parseSubmittedData(submittedData);
          updateUser(req.params.id, userData, function(err, done){
            if (err) return res.serverError(err);
            req.addFlash('success', "Update Successfull!!");
            res.redirect('user/editprofile/'+req.params.id);
          });
        }
        else {
          req.addFlash('failed', "Wrong current password!")
          res.redirect('user/editprofile/'+req.params.id);
        }
      });
    });           
  },  
  
  destroy: function(req, res){
    User.findOne({id: req.params.id}).exec(function(err, user){
      if (err) return res.serverError(err);
      if (!user) return res.notFound("No user with that id exists.");
      else {
        User.destroy({id: req.params.id}).exec(function(err){
          if (err) return res.serverError(err);
          res.redirect('user');
        });
      }  
    })
  }
}

function parseSubmittedData (submittedData){
  var parsedData = {};
  for (var k in submittedData){
    if (submittedData[k].trim().length != 0)
    parsedData[k] = submittedData[k].trim();
  }
  return parsedData;
} 

function updateUser(userId, userData, done){
  User.update(userId, userData).exec(function(err, user){
    if (err) return done(err);
    return done(null);
  })
}

