Meteor.publish('user_projects', function(){
  //return Projects.find();
  if (this.userId) {
     return Projects.find({userId: this.userId});
  } else {
    this.ready();
  }
});


