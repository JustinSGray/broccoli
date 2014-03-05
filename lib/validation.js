
Regulate.registerRule('nameAvail', function (fieldValue, fieldReqs, fields) {
  fieldValue = fieldValue.toLowerCase();
  var isUnique = Meteor.users.findOne({username:fieldValue});
  if (Meteor.isServer) {
    var current_user = Meteor.users.findOne({_id:this.userId});
  }
  else {
    var current_user = Meteor.user();
  }
  if (current_user && current_user.username==fieldValue) {
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


