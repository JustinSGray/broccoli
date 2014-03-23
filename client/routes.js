Router.configure({
  layoutTemplate: 'layout'
});

Router.map( function() {
  this.route('splash', {
    path:"/",
    template: 'splash',
    waitOn: function() {
      Meteor.subscribe('userData');
      var u = Meteor.user();
      if (u) {
        this.redirect(Router.routes['dashboard'].path({username: u.username}))
      }
    }
  });

  this.route('logout', {
    path: "/logout",
    //template: "logout"
    before: function(){
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
      Meteor.subscribe('userProjects');
    }
  });

  this.route('project', {
    path:'/projects/:urlName', 
    template: 'project', 
    waitOn: function(){
      Meteor.subscribe('userProjects');
    }, 
    before: function(){
      var proj = Projects.findOne({urlName:this.params.urlName});
      Session.set('project', proj);
    },
    unload: function(){
      Sesion.set('project', null);
    }
  });

});