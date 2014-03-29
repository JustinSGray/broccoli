Meteor.startup(function(){

  Regulate['#sign_up_form'].onSubmit(function(error, data) {
    var username;
    var password;
    console.log("test: ", error, data)
    if(error) {
      //allow people to login from splash form
      if (error.username && error.username[0] === "username is taken! choose another name or enter the correct password") {
      //have to grab the value directly, because data arg is empty when there is an error

        username = $('#sign_up_form input[type="text"]').val().toLowerCase();
        password = $('#sign_up_form input[type="password"]').val();
        Meteor.loginWithPassword({'username':username}, password, function(err){
          if (err) {
            set_form_errors(error);
          }
        });
      }
      else {
        set_form_errors(error);
      }
    }
    else {
      username = data[0].value;
      password = data[1].value;
      Accounts.createUser({username:username, password: password});
    }
  });
});

set_form_errors = function(error) {
    console.log('Form validation failed. These are the errors: ', error);
    var form_errors = {}
    _.each(error, function(errs, key){
        form_errors[key] = errs;
    });
    Session.set('form-errors', form_errors);
};

reset_form_errors = function(error) {
    Session.set('form-errors', undefined);
};


UI.registerHelper(
    "formErrors",
    function (field_name) {
        var errs = Session.get('form-errors');
        var errors = "";
        if (errs){
            var msgs = errs[field_name];
            _.each(msgs, function(m){
                errors = errors + '<li class="form-err-msg">'+m+'</li>';
            });
        }
        return errors;
    }
);

UI.registerHelper(
    "formErrorClass",
    function (field_name) {
        var errs = Session.get('form-errors');
        if (errs && errs[field_name]){
            return 'has-error';
        }
        return '';
    }
);