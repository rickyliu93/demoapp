$().ready(function(){
 // validate signup form on keyup and submit
  $("#new_user").validate({
    rules: {
      "user[email]": {
        required: true,
        email: true
      },
      'user[raw_password]': {
        required: true,
        minlength: 5
      },
      "user[password_confirmation]": {
        required: true,
        equalTo: "#user_password"
      },
      "user[phone_no]": {
        number: true
      }
    },
    messages: {
      "user[email]": "Please enter a valid email address",
      "user[raw_password]": {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      "user[password_confirmation]": {
        required: "Please provide a password",
        equalTo: "Please enter the same password as above"
      },
      "user[phone_no]": {
        number: "Please enter a valid tel no"
      }
    }
  });
  
  $("#edit_user").validate({
    rules: {
      "user[email]": {
        required: true,
        email: true
      },
      'user[raw_password]': {
        required: false,
        minlength: 5
      },
      "user[password_confirmation]": {
        required: false,
        equalTo: "#user_password"
      },
      "user[phone_no]": {
        number: true
      }
    },
    messages: {
      "user[email]": "Please enter a valid email address",
      "user[raw_password]": {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      "user[password_confirmation]": {
        required: "Please provide a password",
        equalTo: "Please enter the same password as above"
      },
      "user[phone_no]": {
        number: "Please enter a valid tel no"
      }
    }
  });
  
});
