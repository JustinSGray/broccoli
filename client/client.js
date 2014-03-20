Handlebars.registerHelper('list', function() {
  object = Meteor.user().profile  

  var lis =  _.map(Meteor.user().profile, function(num, key){ return "<h3>"+key+":"+num+"</h3>"; })
  return "<ul>" + lis + "</ul>";
});

Handlebars.registerHelper('getGit', function(string) {
  //object = Meteor.user().profile

  //console.log(eval(object+"."+string))
  return eval("Meteor.user().profile."+string)
});

Handlebars.registerHelper('minimize', function() {
  return Session.get('minimize')? true:false;
});
