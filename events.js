Events = new Meteor.Collection("events");

if (Meteor.isClient) {
    Template.page.events = function () {
    return Events.find({}, {});
  };

  Template.event.events({
    'click #event' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
