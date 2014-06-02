Router.configure({
  layoutTemplate: 'layout'
});


function loading(){
  if (this.ready())
    this.render();
  else
    this.render('loadingWait');
}

Router.map( function() {

  this.route('tests',{
    path:"/tests", 
    template: "tests",
    waitOn: function() {
      return Meteor.subscribe('userData');
    }, 
    action: loading
  });

  this.route('logout', {
    path: "/logout",
    //template: "logout"
    onBeforeAction: function(){
      Meteor.logout(function(err){
        if (err) {
          Meteor._debug(err);
        }
        else{
          Router.go("/");
        }
      });
    }
  });

  this.route('dashboard', {
    path: '/:username',
    template: 'dashboard', 
    waitOn: function() {
      return Meteor.subscribe('userProjects');
    }, 
    action: loading
  });

  this.route('project', {
    path:'/projects/:urlName', 
    template: 'project', 
    waitOn: function(){
      var that = this;

      var cb = function(){
        var proj = Projects.findOne({urlName:that.params.urlName});
        Session.set('project', proj);
        Meteor.subscribe('simulations',proj._id);
      }

      Deps.autorun(function(){

        Meteor.subscribe('cases', Session.get('simulationId'));
      });

      return Meteor.subscribe('userProjects', cb);
    },
      
    action: loading, 

    onStop: function(){
      Session.set('project', null);
      Session.set('simulation', null);
    }
  });

  this.route('splash', {
    path:"/",
    template: 'splash',
    waitOn: function() {
      return Meteor.subscribe('userData');
    }, 
    onBeforeAction: function(){
      var u = Meteor.user();
      if (u) {
        this.redirect(Router.routes['dashboard'].path({username: u.username}))
      }
    }, 
    action: loading
  });

});