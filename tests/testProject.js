suite('Project collection behavior', function() {
  test('inserts get a correct url-safe name', function(done, server, client) {

    var test = function() {
      server.eval(function(){
        Projects.find().observe({
          added: function(proj){
            emit(proj.name, proj);
          }
        });
      }).once('name with spaces', function(proj){
        console.
        assert(proj.urlName, 'name-with-spaces');
      }).once('name with "', function(proj){
        assert(proj.urlName, 'name-with');
      }).once('name with 123', function(proj){
        assert(proj.urlName, 'name-with-123');
      }).once('Name With CAPS', function(proj){
        assert(proj.urlName, 'name-with-caps');
        done();
      });

      client.eval(function(){
        Projects.insert({name:'name with spaces'});
        Projects.insert({name:'name with "'});
        Projects.insert({name:'name with 123'});
        Projects.insert({name:'Name With CAPS'});
      });

    };

    runTestWithUser(client, test);
  });


  test('read and write permissions', function(done, server, client){

    var test = function() {
      client.eval(function(){
        Accounts.createUser({username:'other-person', password: '123456'});

        var pId;
        var cb = function(){
          pId = Projects.findOne()._id;
          emit('ready');
        }
        Projects.insert({name:"some project"}, cb); 

      }).once('ready', function(){
        client.eval(function(){
          var pId = Projects.findOne()._id; // get the pId from the other users project
          var cb1 = function(error, _id) {
            emit('updateDenied', error);
          }

          var cb2 = function(error, _id) {
            emit('updateAllowed', error, _id);
          }
          var loggedIn = function(){
            // illegal update
            Projects.update({_id:pId}, {$set:{name:"foobar"}}, cb1);
            Projects.insert({name:"some project"}, cb2); 
          }
          Meteor.loginWithPassword('test', '123456', loggedIn)
        }).once('updateDenied', function(error){
          assert.equal(error.error, 403);
          assert.equal(error.reason, 'Access denied');
        }).once('updateAllowed', function(error, _id) {
          assert.equal(error, null);
          assert.equal(typeof(_id), "string");
          done();
        });
      });

    }
    
    runTestWithUser(client, test);
  });
});

suite('Project creation behavior', function(){
  test('for name availability', function(done, server, client) {

    var test = function() {
      client.eval(function(){
        emit('goodName', Regulate.Rules.projectNameAvail('test test'));

        function false_emit_maker(num, name){ // makes emits for bad names
          var cb = function() {
            emit('badName'+num, Regulate.Rules.projectNameAvail(name));
          }

          return cb;
        }

        Projects.insert({name:'test test', userId:Meteor.userId()}, false_emit_maker(1, 'test test'));

        // should strip leading and trailing white space
        false_emit_maker(2, 'test test ')();
        false_emit_maker(3, ' test test ')();
        false_emit_maker(4, 'test-test')();

      }).once('goodName', function(isAvail){
        assert.equal(isAvail, true);
      }).once('badName1', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName2', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName3', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName4', function(isAvail){
        assert.equal(isAvail, false);
        done();
      });
    };

    runTestWithUser(client, test);
  });
});

// Cant get this to run reliably anymore!
// suite('Project Page', function(){
//   test('loading', function(done, server, client){

//     var test = function() {
//       client.eval(function(){

//         var cb = function(error, result){
//           var simCb = function(error, result){
//             emit('projectCreated');
//           }
//           Simulations.insert({name:null, projectId:result}, simCb);
//         }
//         Projects.insert({name:'test test', userId:Meteor.userId()}, cb);
      
//       }).once('projectCreated', function(){

//         client.eval(function() {
//           // react on route change
//           var path = '/projects/test-test';
//           Deps.autorun(function() {
//             if (Session.get('project')) {
//               emit('projName', Template.project.proj().name);
//             }
//           });
//           Router.go(path);
//         });
//       }).once('projName', function(name){
//         assert.equal(name, 'test test');
//         done();
//       });
//     }

//     runTestWithUser(client, test);
//   });
// });