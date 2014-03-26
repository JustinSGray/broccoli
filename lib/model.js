
Projects = new Meteor.Collection('projects');

Projects.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    },
});


Projects.deny({
    insert: function(userId, doc) {
        if(userId===undefined){
          return true;
        }
        return false;
    },
    update: function(userId, doc) {
        if(userId!=doc.userId){
          return true;
        }
        return false;
    },
    remove: function(userId, doc) {
        if(userId!=doc.userId){
          return true;
        }
        return false;
    },
});



Projects.before.insert(function(userId, doc){
  doc.userId = userId;
  doc.urlName = urlSafe(doc.name);
});