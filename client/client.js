Meteor.subscribe("events");
Meteor.subscribe("users");

Template.body.showDetails = function () {
  return Session.get("selected");
}

Template.body.showSteps = function () {
  return Session.get("selected") !== "addEvent";
}

Template.page.loading = function () {
  return Session.get("loading");
}

Template.body.showLoader = function () {
  return Session.get("eventsLoaded");
}

Template.body.showError = function () {
  return Session.get("addEventError");
}

Template.body.showSuccess = function () {
  return Session.get("addEventSuccess");
}

Template.body.events({
  'click .close' : function () {
    Session.set("addEventError", null);
    Session.set("addEventSuccess", null);
  }
});

Template.event.events({
  'click #event' : function (event) {
    Session.set("addEventError", null);
    Session.set("addEventSuccess", null);
    Session.set("selected", this._id);
  }
});

Template.event.listItemClass = function () {
  return Session.equals("selected", this._id) ? "active" : "inactive";
};

Template.eventSidebar.eventBlock = function () {
  return Events.find();
};

Template.eventSidebar.addEventClass = function () {
  return Session.get("selected") === "addEvent" ? "active" : "inactive";
};

Template.event.startTimeDisp = function () {
  var startTime = this.startTime;
  return moment(this.startTime).format("ddd, MMM DD h:mmA");
}

Template.event.endTimeDisp = function () {
  var endTime = this.endTime;
  return moment(this.endTime).format("ddd, MMM DD h:mmA");
}


Template.eventSidebar.events({
  'click #addEvent' : function(event) {
    Session.set("selected", "addEvent");
    Session.set("addEventError", null);
    Session.set("addEventSuccess", null);
  }
});

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
            Session.set("selected", _id);
            Session.set("addEventSuccess",{
              success: "Event successfully added",
              details: "Go and add more details to your event"
            });
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
    var user = Meteor.users.findOne({_id: event.owner});
    return "Updated " + moment(event.created).fromNow() + " by " + user.profile.name;
  }
}

Template.collaboratorsModule.you = function () {
  return Meteor.user().profile.name;
}

Template.collaboratorsModal.others = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
    return Meteor.users.find({$and: [{_id: {$not: {$in: event.collaborators}}}, {_id: {$ne: Meteor.userId()}}]});
}

Template.collaboratorsModal.events({
  'click #addCollaborator' : function () {

  }
})