Template.detailsModule.rendered = function () {
  $("#startTime").datetimepicker({
    pick12HourFormat: true,
    pickSeconds: false
  });
  $("#endTime").datetimepicker({
    pick12HourFormat: true,
    pickSeconds: false
  });
  var event = Events.findOne({_id:Session.get("selected")});
  if(event)
  {
    $("#startTimeField").val(event.startTime);
    $("#endTimeField").val(event.endTime);
  }
  else
  {
    $("#startTimeField").val("");
    $("#endTimeField").val("");
  }
}

Template.detailsModule.events({
  'click #add' : function(event, template) {
    var name = template.find("#name").value;
    var start = template.find("#startTimeField").value;
    var end = template.find("#endTimeField").value;
    if(name.length && start.length && end.length)
    {
        Session.set("loading", true);
        Meteor.call('createEvent', {
        name: name,
        start: start,
        end: end,
        selected: Session.get("selected")
      }, function (error, _id) {
        if (error) {
          Session.set("addEventError", {error: error.reason, details: error.details});
        }
        else {
          if(Session.get("selected") === "addEvent")
          {
            Session.set("addEventSuccess",{
              success: "Event successfully added",
              details: "Go and add more details to your event"
            });
            Session.set("selected", _id);
          }
        }
        Session.set("loading", false);
      });
      Session.set("addEventError", null);
      Session.set("addEventSuccess", null);
    }
    else
    {
      Session.set("addEventError", {error: "Required parameter missing", details: "please check fields"});
    }
  },
  'click #cancel' : function () {
    Session.set("selected", null);
    Session.set("addEventError", null);    
    Session.set("addEventSuccess", null);
  },
});

Template.detailsModule.moduleHeader = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(!event)
    return "Add event...";
  else
    return "1. Setup event details";
}

Template.detailsModule.eventName = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(!event)
    return "";
  else
    return event.name;
}

Template.detailsModule.buttonName = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(!event)
    return "Add event";
  else
    return "Save changes";
} 

Template.detailsModule.updateText = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(!event)
    return "";
  else
  {
    var user = Meteor.users.findOne({_id: event.lastUpdate});
    if(user)
      return "Last updated: " + moment(event.updated).calendar() + " by " + user.profile.name;
  }
}