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
                  emit('loggedBackIn');
                }
                Meteor.loginWithPassword('test', '123456', switchUserCb);
              }
              Simulations.insert({name:null, projectId:result}, sCb);
            }
            Projects.insert({name:'some_project'}, pCb);              
          }

          Accounts.createUser({username:'someone', password:'testtest'}, otherUserloginCb);
        }).once('loggedBackIn', function(){
          client.eval(function(){
            var pId = Projects.findOne()._id;

            var cb = function(){
              var simCount = Simulations.find().count();
              emit('simCount', simCount);
              var failCb = function(error, result){
                emit('insertFailed', error, result);
              }
              Cases.insert({simId:'aaaaaaaa'}, failCb);

              var mySimId = Simulations.findOne()._id;
              var successCb = function(error, result) {
                emit('insertSuccess', error, result);
              }
              Cases.insert({simId:mySimId}, successCb);
            }

            Meteor.subscribe('simulations', pId, cb);
            
          });
        }).once('simCount', function(count){
          assert.equal(count, 1);
        }).once('insertFailed', function(error, result){
          assert.equal(result, false);
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
    client.eval(function(){

      var failCb = function(error, result) {
        emit('failed', error, result);
      }
      Cases.insert({simId:'aaaaa'}, failCb);
    }).once('failed', function(error, result){
      assert.equal(result, false);
      assert.equal(error.error, 403);
      assert.equal(error.reason, 'Access denied');
      done();
    });
  });

});