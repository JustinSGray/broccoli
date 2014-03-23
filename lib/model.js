
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

Projects.before.insert(function(userId, doc){
  doc.userId = userId;
  doc.urlName = urlSafe(doc.name);
});