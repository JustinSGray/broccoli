Router.configure({
  layoutTemplate: 'layout'
});

Router.map( function() {
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
    }
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
    }
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
      
    onStop: function(){
      Session.set('project', null);
      Session.set('simulation', null);
    }
  });

});