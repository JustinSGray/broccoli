assert = chai.assert

describe("Regulate rule for name availability ", function(){
  it("should return true when name is available", function(){
    var is_avail = Regulate.Rules.nameAvail('testnotsignedup'); 
    assert.isTrue(is_avail, 'The name "testnotsignedup" should be available');
  });

  it("should return false when name is already in the database", function(){

    //make sure username exists first
    var user = Meteor.users.findOne({username:'testsignedup'});
    assert.ok(user, 'Something is wrong with the test fixtures. User "testsignedup", does not exist'); 
    
    var is_avail = Regulate.Rules.nameAvail('testsignedup'); 
    assert.isFalse(is_avail, 'The name "testsignedup" should not be available');

    var is_avail = Regulate.Rules.nameAvail('testSignedUp'); 
    assert.isFalse(is_avail, 'Capital letters should not affect name availability');
  });

});