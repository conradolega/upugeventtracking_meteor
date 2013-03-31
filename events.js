if (Meteor.isClient) {

  Session.setDefault("addEvent", false);

  Template.body.showAddEventModule = function () {
    return Session.get("addEvent");
  }

  Template.body.showError = function () {
    return Session.get("addEventError");
  }

  Template.body.events({
    'click .close' : function () {
      Session.set("addEventError", null);
    }
  });

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

  Template.eventSidebar.addEventClass = function () {
    return Session.get("addEvent") ? "active" : "inactive";
  };

  Template.eventSidebar.events({
    'click #addevent' : function(event) {
      Session.set("addEvent", true);
      Session.set("addEventError", null);
    }
  });

  Template.addEventModule.rendered = function () {
    $("#startTime").datetimepicker({
      pick12HourFormat: true,
      pickSeconds: false
    });
    $("#endTime").datetimepicker({
      pick12HourFormat: true,
      pickSeconds: false
    });    
  }

  Template.addEventModule.events({
    'click #add' : function(event, template) {
      var name = template.find("#name").value;
      var start = template.find("#startTimeField").value;
      var end = template.find("#endTimeField").value;
      if(name.length && start.length && end.length)
      {
          Meteor.call('createEvent', {
          name: name,
          start: start,
          end: end
        }, function (error) {
        if (error) {
          Session.set("addEventError", {error: error.reason, details: error.details});
        }
        });
        Session.set("addEventError", null);
      }
      else
      {
        Session.set("addEventError", {error: "Required parameter missing", details: "please check fields"});
      }
    }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
