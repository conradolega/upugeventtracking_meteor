Meteor.subscribe("events");
Meteor.subscribe("users");
$('#navbar').affix();

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
    return "Last updated: " + moment(event.updated).calendar() + " by " + user.profile.name;
  }
}

Template.collaboratorsModule.you = function () {
  return this._id === Meteor.userId();
}

Template.collaboratorsModule.help = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
    return Meteor.users.find({_id: {$in: event.collaborators}});
}

Template.collaboratorsModal.others = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
    return Meteor.users.find({_id: {$nin: event.collaborators}});
}

Template.collaboratorsModal.events({
  'click #addCollaborator' : function () {
    var checked = $("#collaboratorModal").find("input[type=checkbox]:checked");
    var ids = [];
    checked.each( function () {
      ids.push($(this).attr('userId'));
    });
    if(ids.length > 0)
    {
      Meteor.call('addCollaborators', 
      {
        ids: ids,
        selected: Session.get("selected")
      },
      function (error, _id) {
        if (error) {
          Session.set("addEventError", {error: error.reason, details: error.details});
        }
        else {
          Session.set("addEventSuccess",{
            success: "Successfully added collaborators",
            details: "Start working on the event"
          });
        }
      });
    }
  }
});

Template.week1.events({
 'click #save' : function(event, template) {
  var table = template.find("#sponsors_table");
  var records = _.rest($(table).find("tr"));
  var save = [];
  $(records).each( function () {
    var sponsor = $(this).find("a.editSponsor").html();
    var person = $(this).find("a.editPerson").html();
    var contact = $(this).find("a.editContact").html();
    if(($(this).find("a.editable-empty").length == 0))
    {
      var push = {
        sponsor: sponsor,
        person: person,
        contact: contact
      };
      save.push(push);
    }
  });
  Session.set("loading", true);
  Meteor.call("updateSponsors",
  {
    sponsors: save,
    selected: Session.get("selected")
  },
  function (error, _id) {
    if (error) {
      Session.set("addEventError", {error: error.reason, details: error.details});
    }
  });

  table = template.find("#lineup_table");
  records = _.rest($(table).find("tr"));
  save = [];
  $(records).each( function () {
    var band = $(this).find("a.editCell").html();
    var startTime = $(this).find("a.editStartTime").html();
    var endTime = $(this).find("a.editEndTime").html();
    if(($(this).find("a.editable-empty").length == 0))
    {
      var push = {
        band: band,
        startTime: startTime,
        endTime: endTime
      };
      save.push(push);
    }
  });

  Meteor.call("updateLineup",
  {
    lineup: save,
    selected: Session.get("selected")
  },
  function (error, _id) {
    if (error) {
      Session.set("addEventError", {error: error.reason, details: error.details});
    }
    else {
      Session.set("addEventSuccess",{
        success: "Update successful",
        details: "Check other modules for completion"
      });
    }
  });
  Session.set("loading", false);          
}  
});

Template.week1.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 4).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 3).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.lineup.rendered = function () {
  $(".editCell").editable({
    unsavedclass: null
  });
  $(".editStartTime").editable({
    type: 'combodate',
    format: 'hh:mm A',
    template: 'hh : mm A',
    unsavedclass: null
  });
  $(".editEndTime").editable({
    type: 'combodate',
    format: 'hh:mm A',
    template: 'hh : mm A',
    unsavedclass: null
  });
}

Template.lineup.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#lineup_table");
    var next = parseInt($(table).find("tr:last > td:first").html()) + 1;
    if(isNaN(next))
      next = 1;
    $(table).append('<tr><td>' + next + '</td><td><a href="#" class="editCell"></a></td><td><a href="#" class="editStartTime"></a></td><td><a href="#" class="editEndTime"></a></td></tr>');
    $(".editCell").editable({
      unsavedclass: null
    });
    $(".editStartTime").editable({
      type: 'combodate',
      format: 'hh:mm A',
      template: 'hh : mm A',
      unsavedclass: null
    });
    $(".editEndTime").editable({
      type: 'combodate',
      format: 'hh:mm A',
      template: 'hh : mm A',
      unsavedclass: null
    });    
  }
});

Template.lineup.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { lineup: 1 });
  if(cursor)
  {
    var num = 1;
    cursor.lineup.forEach(function (entry)
    {
      entry.num = num;
      num++;
    });
    return cursor.lineup;
  }
}

Template.sponsors.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#sponsors_table");
    var next = parseInt($(table).find("tr:last > td:first").html()) + 1;
    if(isNaN(next))
      next = 1;
    $(table).append('<tr><td><a href="#" class="editSponsor"></a></td><td><a href="#" class="editPerson"></a></td><td><a href="#" class="editContact"></a></td></tr>');
    $(".editSponsor").editable({
      unsavedclass: null
    });
    $(".editPerson").editable({
      unsavedclass: null
    });
    $(".editContact").editable({
      unsavedclass: null
    });        
  }
});

Template.sponsors.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { sponsors: 1 });
  if(cursor)
  {
    return cursor.sponsors;
  }
}


Template.sponsors.rendered = function () {
  $(".editSponsor").editable({
    unsavedclass: null
  });
  $(".editPerson").editable({
    unsavedclass: null
  });
  $(".editContact").editable({
    unsavedclass: null
  });  
}

