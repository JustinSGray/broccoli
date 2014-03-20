Meteor.publish('userProjects', function(){
  //return Projects.find();
  if (this.userId) {
     return Projects.find({userId: this.userId});
  } else {
    this.ready();
  }
});


Meteor.publish('userData', function(){
  return Meteor.users.find({},{fields: {'username': 1}});
});