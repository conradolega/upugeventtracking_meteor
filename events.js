Events = new Meteor.Collection("events");

if (Meteor.isClient) {

  Template.page.showAddEventModule = function () {
    return Session.get("addEvent");
  }

  Template.event.events({
    'click #event' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.eventSidebar.eventBlock = function () {
    return Events.find({}, {});
  };

  Template.eventSidebar.events({
    'click #addevent' : function(event) {
      Session.set("addEvent", true);
    }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
