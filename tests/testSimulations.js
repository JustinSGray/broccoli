suite('Simulation publication: ', function(){
  test('User only sees simulations related to the specified project', function(){
    assert.equal(false, true);
  });

  test("User can't see simulations they don't own", function(){
    assert.equal(false, true);
  });
});

suite('Simulation collection behavior', function(){

  // Test that when a simulation is created, it's associated with the correct user
  test('Simulation is associated with current user when created',function(done, server, client){
    
    var test = function(){

      server.eval(function(){
        Simulations.find().observe({
          added: function(doc) {
            emit('simAdded', doc);
          }
        });
      });

      client.eval(function(){
        var cb = function(error, _id){
          Simulations.insert({name:null, projectId:_id});
        }

        Projects.insert({name:'some_project'}, cb);
      });

      server.once('simAdded', function(doc){
        server.eval(function(){ 
          var uId = Meteor.users.findOne({username:'test'})._id;
          emit('userId', uId);
        }).once('userId', function(uId){
          assert.equal(doc.userId, uId);
          assert(doc.created);
          done();
        });
      });
    }

    runTestWithUser(client, test);
  });


  test('Simulation can not be created unless valid project is specified',function(done, server, client){
    var test = function(){
      client.eval(function(){
        var cb = function(error, _id){
          emit('insertDenied', error, _id);
        }
        Simulations.insert({name:null}, cb);
      }).once('insertDenied', function(error, _id){
        assert.equal(error.error, 403);
        assert.equal(error.reason, 'Access denied');
        done();
      });
    };

    runTestWithUser(client, test)
  });
});

suite('Simulation deny rules', function(){
  test('Simulation can not be created unless logged in',function(done, server, client){
    client.eval(function(){
      var loggedOutCB = function(){
        emit('loggedOut');
      }
      Meteor.logout(loggedOutCB);
    }).once('loggedOut', function(){
      client.eval(function(){

        var cb = function(error, _id){
          emit('insertDenied', error, _id);
        }
        Simulations.insert({name:null, projectId:"aaaaaaaaa"}, cb);

      }).once('insertDenied', function(error, _id){
        assert.notEqual(error, null)
        assert.equal(error.error, 403);
        assert.equal(error.reason, 'Access denied');
        done();
      });
    }); 
  }); 
});