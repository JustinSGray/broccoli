
var getUser = function() {
  var currentUser; 
  if (Meteor.isServer) {
    var currentUser = Meteor.users.findOne({_id:this.userId});
  }
  else {
    var currentUser = Meteor.user();
  }

  return currentUser
}


Regulate.registerRule('nameAvail', function (fieldValue, fieldReqs, fields) {
  fieldValue = fieldValue.toLowerCase();
  var isUnique = Meteor.users.findOne({username:fieldValue});
  var currentUser = getUser();
  if (currentUser && currentUser.username==fieldValue) {
    return true;
  }
  
  return (isUnique==undefined); // true or false.
});

Regulate.registerMessage('nameAvail', function (fieldName, fieldReqs) {
  return fieldName + " is taken! choose another name or enter the correct password";
});

Regulate('#sign_up_form', [
    {
        name: 'username', 
        min_length: 4, 
        nameAvail: true,
    },
    {
        name: 'password', 
        min_length: 4,
    }
]);


Regulate.registerRule('projectNameAvail', function (fieldValue, fieldReqs, fields) {
  var currentUser = getUser();
  if (currentUser) {
    var exists = Projects.findOne({urlName:urlSafe(fieldValue)});
    console.log(fieldValue, fieldValue.toLowerCase().trim());
    if (exists === undefined) {
      return true;
    }
  }
  return false;
});

Regulate('#new-project-form', [
  {
    name:'project-name', 
    min_length: 4, 
    projectNameAvail: true, 
    error: {
      required: 'You must give your project a name', 
      min_length: 'The name must be at least 4 characters long', 
      projectNameAvail: 'You already have a project with that name'
    }
  }

]);


