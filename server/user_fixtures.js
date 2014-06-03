Meteor.startup(function () {

  //if not running tests, then bail so we don't stomp all over our data
  if (process.env.METEOR_MOCHA_TEST_DIR===undefined) {
    return
  }

  Meteor.users.remove({}); // empty the users collection

  //create some users for testing
  var options = {
    username: 'testsignedup', 
    password: '12345', 
    //email: 'admin@example.com'
  };
  Accounts.createUser(options);
});