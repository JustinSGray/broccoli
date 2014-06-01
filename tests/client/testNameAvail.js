assert = chai.assert

describe("Regulate rule for name availability ", function(){
  it("should return true when name is available", function(){
    var is_avail = Regulate.Rules.nameAvail('testnotsignedup'); 
    assert.isTrue(is_avail, 'The name "testnotsignedup" should be available')
  });

  it("should return false when name is already in the database", function(){
    //Accounts.createUser({username: 'testsignedup', password: '123456'});

    var is_avail = Regulate.Rules.nameAvail('testsignedup'); 
    //console.log("here", is_avail, Meteor.isServer, Meteor.users.find().fetch())

    assert.isFalse(is_avail, 'The name "testsignedup" should not be available')
  });

});