
var assert = require('assert');
var _ = require('underscore');

function setup(client, cb) {
  client.eval(function() {

    function cb() {
      emit('userCreated');
    }

    Accounts.createUser({username:'test', password: '123456'}, cb);
  });
}

suite('Project functionality', function() {

  test('Project name availability', function(done, server, client) {

    setup(client);

    client.once('userCreated', function() {
      var isAvail = client.eval(function(){
        emit('goodName', Regulate.Rules.projectNameAvail('test'));

        function cb() {
          emit('badName', Regulate.Rules.projectNameAvail('test'));
        }
        Projects.insert({name:'test', userId:Meteor.userId()}, cb);

      }).once('goodName', function(isAvail){
        assert.equal(isAvail, true);
      }).once('badName', function(isAvail){
        assert.equal(isAvail, false);
        done();
      });
    });
  });

  test('Error msg for no name', function(done, server, client) {

    setup(client);

    client.once('userCreated', function(){ 
      client.eval(function(){
        waitForDOM('#new-project-form', function(){

          var form = $('#new-project-form');
          var formGroup = form.find('.form-group'); 
          // starts without error class, no error msg
          emit('before-hasClass',formGroup.hasClass('has-error'));
          emit('before-helpText', _.toArray(form.find('.help-block ul li')));

          form.find('button').click(); //empty form
          //console.log($(form.find('.form-err-msg')));

          waitForDOM('.form-err-msg', function(){
            // gets  error class with error msg
            var errors = formGroup.find('.help-block ul li').toArray();
            errors = _.map(errors, function(elem){return $(elem).text();});
            console.log(errors);
            emit('after-hasClass',formGroup.hasClass('has-error'));
            emit('after-helpText', errors);
            emit('return');
          });
          emit('return'); 
        });
      }).once('before-hasClass', function(hasClass){
        assert.equal(hasClass, false);
      }).once('before-helpText', function(helpText){
        assert.equal(helpText.length, 0);
      }).once('after-hasClass', function(hasClass){
        assert.equal(hasClass, true);
      }).once('after-helpText', function(helpText){
        assert.equal(helpText.length, 1);
        assert.equal(helpText[0], 'You must give your project a name');
      });
    });
  });

  test('Valid name creates a project', function(done, server, client) {

    setup(client);

    client.once('userCreated', function(){
      server.eval(function(){
        Projects.find().observe({
          added: function(doc) {
            emit('projectAdded', doc);
          }
        });
      });

      client.eval(function(){
        waitForDOM('#new-project-form', function(){
          var form = $('#new-project-form');
          var formGroup = form.find('.form-group');

          form.find('button').click(); //empty form just to create an error, so I can make sure it's not still there after I put something in there
          form.find('input[name="project-name"]').val('foobar');
          form.find('button').click(); 
          
          emit('return');
        });
      });
    });

    server.once('projectAdded', function(doc){
      //this is a roundabout, but unfortunately necessary way of getting the given userId... 
      server.eval(function(){ 
        var uId = Meteor.users.findOne({username:'test'})._id;
        emit('userId', uId);
      });
      server.once('userId', function(userId){
        assert.equal(doc.name, 'foobar'); 
        assert.equal(doc.userId, userId);
        done();
      });
    });

  });
});

