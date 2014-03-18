Router.configure({
  layoutTemplate: 'layout'
});

Router.map( function() {
  this.route('splash', {
    path:"/",
    template: 'splash',
    waitOn: function() {
      Meteor.subscribe('Users');
      var u = Meteor.user();
      if (u) {
        this.redirect(Router.routes['dashboard'].path({username: u.username}))
      }

      Meteor.subscribe('Projects')
    }
  });

  this.route('logout', {
    path: "/logout",
    template: "logout"
  });

  this.route('dashboard', {
    path: '/:username',
    template: 'dashboard'
  });

});