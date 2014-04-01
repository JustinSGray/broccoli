suite('Cases collection behavior', function(){
  
  test('Case can not be created without parent simulation owned by current user', function(done, server, client){
    
    var test = function(){
        client.eval(function(){

          // create project owned by current user
          var pId = Projects.insert({name:'some_project'});
          Simulations.insert({name:null, projectId:pId});


          // create projects owned by other user
          var otherUserloginCb = function(){
            var pCb = function(error, result) {
              var sCb = function(error, result){
                var switchUserCb = function(){
                  emit('loggedBackIn', result);
                }
                Meteor.loginWithPassword('test', '123456', switchUserCb);
              }
              Simulations.insert({name:null, projectId:result}, sCb);
            }
            Projects.insert({name:'some_project'}, pCb);              
          }

          Accounts.createUser({username:'someone', password:'testtest'}, otherUserloginCb);
        }).once('loggedBackIn', function(sId){
          var failCb = function(error, result){
            emit('insertFailed', error, result);
          }
          Cases.insert({simId:sId}, failCb);

          var mySimId = Simulations.findOne()._id;
          var successCb = function(error, result) {
            emit('insertSuccess', error, result);
          }
          Cases.insert({simId:sId}, successCb);
        }).once('insertFailed', function(error, result){
          assert.equal(result, undefined);
          assert.equal(error.error, 403);
          assert.equal(error.reason, 'Access denied');
        }).once('insertSuccess', function(error, result){
          assert.equal(error, undefined);
          assert.equal(typeof(result),"string");
          done();
        });
    }
    runTestWithUser(client, test);
  });

  test('Case can not be created unless logged in', function(done, server, client){
    assert.equal(false,true);
  });

});