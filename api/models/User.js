var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    company_name: {
      type: 'text'     
    },
    address: {
      type: 'text'
    },
    phone_no: {
      type: 'string'
    },
    email: {
      type: 'string',
      unique: true
    },
    encrypted_password: {
      type: 'string'
    },
    reset_password_token: {
      type: 'string'
    },
    reset_password_sent_at: {
      type: 'datetime'  
    },
    remember_created_at: {
      type: 'datetime'
    },
    sign_in_count: {
      type: 'integer',
      defaultsTo: "0"
    },
    current_sign_in_at: {
      type: 'datetime'
    },
    last_sign_in_at: {
      type: 'datetime'
    },
    current_sign_in_ip: {
      type: 'string'
    },
    last_sign_in_ip: {
      type: 'string'
    },
    createdAt: {
      type: 'datetime',
      notNull: true
    },
    updatedAt: {
      type: 'datetime',
      notNull: true
    },
    admin: {
      type: 'boolean',
      notNull: true,
      defaultsTo: false
    },
  },  
  tableName: 'users',
  verifyPassword: function (user, password, callback) {
    return bcrypt.compare(password, user.encrypted_password, function(err, res){
      if (res) return callback(null, res);
      else {
        return callback(err);
      }
    });
  },
  checkAdmin: function (user) {
    if(user.admin === true) return true; 
    else return false;
  },
  beforeCreate: function (newUser, cb) {
    if (newUser.raw_password != newUser.password_confirmation) {
       return cb({err:["Password confirmation doesn't match Password"]});
    }
    if (! newUser.phone_no){
      newUser.phone_no = "0";
    } 
    newUser.email = newUser.email.toLowerCase(); 
    bcrypt.hash(newUser.raw_password, saltRounds, function (err, hash) {
      if(err) return cb(err);
      newUser.encrypted_password = hash;
      cb(null, newUser);    
    });
  },
  beforeUpdate: function (user, cb) {
    if (user.raw_password){
      if (user.raw_password != user.password_confirmation) {
       return cb({err:["Password confirmation doesn't match Password"]});
      }
      bcrypt.hash(user.raw_password, saltRounds, function (err, hash) {
        if(err) return cb(err);
          user.encrypted_password = hash;
          return cb();
      });
    } else {
      return cb();
    } 
  }
}

