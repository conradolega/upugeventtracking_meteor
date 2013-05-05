Meteor.subscribe("events");
Meteor.subscribe("users");

Template.body.rendered = function () {
  $('#sidebar').affix();
}

Template.body.showDetails = function () {
  return Session.get("selected");
}

Template.body.showSteps = function () {
  return Session.get("selected") != "addEvent";
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
    if(user)
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
  });

  table = template.find("#venue_table");
  records = _.rest($(table).find("tr"));
  save = [];
  $(records).each( function () {
    var venue = $(this).find("a.editVenue").html();
    var address = $(this).find("a.editAddress").html();
    if(($(this).find("a.editable-empty").length == 0))
    {
      var push = {
        venue: venue,
        address: address
      };
      save.push(push);
    }
  });

  Meteor.call("updateVenue",
  {
    venue: save,
    selected: Session.get("selected")
  },
  function (error, _id) {
    if (error) {
      Session.set("addEventError", {error: error.reason, details: error.details});
    }
  });

  table = template.find("#work_table");
  records = _.rest($(table).find("tr"));
  save = [];
  $(records).each( function () {
    var work = $($(this).find("a")[0]).html();
    var num = $(this).find("a.editNum").html();
    var editable = $(this).find("a.editWork").html();
    if(!editable)
    {
      if(num == "Empty")
      {
        var push = {
          work: work,
        };
      }
      else
      {
        var push = {
          work: work,
          num: num
        };
      }
      save.push(push);
    }
    else if($(this).find("a.editable-empty").length == 0)
    {
      var push = {
        work: work,
        num: num
      };
      save.push(push);
    }
  });
  Meteor.call("updateWork",
  {
    work: save,
    selected: Session.get("selected")
  },
  function (error, _id) {
    if (error) {
      Session.set("addEventError", {error: error.reason, details: error.details});
    }
    else {
      Session.set("addEventSuccess",{
        success: "Successfully saved changes",
        details: "Check other modules for completion"
      });
    }    
  }); 
  Session.set("loading",false);
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
    if(cursor.lineup)
    {
      cursor.lineup.forEach(function (entry)
      {
        entry.num = num;
        num++;
      });
      return cursor.lineup;
    }
  }
}

Template.sponsors.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#sponsors_table");
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

Template.posterDraft.images = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if (!event) return [];
    else return event.images;
} 

Template.posterDraft.events({
  'click #upload' : function() {
    filepicker.setKey("AwF05MMJuRkGDqKAeQanoz");
    filepicker.pick({
      mimetypes: ['image/*'],
      container: 'modal',
      services: ['COMPUTER', 'FACEBOOK'],
    },
    function(FPFile) {
      console.log(JSON.stringify(FPFile));
      Meteor.call("addImage", {
        id: Session.get("selected"),
        url: FPFile.url
      },
      function(error, _id) {
        if (error) {
          Session.set("addImageError", {error: error.reason, details: error.details});
        }
        else {
          console.log("Successfully uploaded image");
        }        
      });
    },
    function(FPError) {
      console.log(FPError.toString());
    }
  );
  }
});

Template.venue.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#venue_table");
    $(table).append('<tr><td><a href="#" class="editVenue"></a></td><td><a href="#" class="editAddress"></a></td></tr>');
    $(".editVenue").editable({
      unsavedclass: null
    });
    $(".editAddress").editable({
      unsavedclass: null
    });    
  }
});

Template.venue.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { venue: 1 });
  if(cursor)
  {
    return cursor.venue;
  }
}

Template.venue.rendered = function () {
  $(".editVenue").editable({
    unsavedclass: null
  });
  $(".editAddress").editable({
    unsavedclass: null
  });
}

Template.work.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#work_table");
    $(table).append('<tr><td><a href="#" class="editWork"></a></td><td><a href="#" class="editNum"></a></td></tr>');
    $(".editWork").editable({
      unsavedclass: null
    });
    $(".editNum").editable({
      unsavedclass: null,
      type: 'number'
    });    
  }
});

Template.work.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { work: 1 });
  if(cursor)
  {
    var num = 1;
    if(cursor.work)
    {
      cursor.work.forEach(function (entry)
      {
        entry.class = (num > 6) ? "editWork" : "";
        num++;
      });
      return cursor.work;
    }
  }
}

Template.work.rendered = function () {
  $(".editWork").editable({
    unsavedclass: null
  });
  $(".editNum").editable({
    unsavedclass: null,
    type: 'number'
  });
}

Template.week2.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 3).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 2).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week2.events({
  'click #save' : function (event, template) {
    var finalVenue = $(template.find(".editFinalVenue"));
    var deal = $(template.find(".editDeal"));
    var paid = $(template.find(".editPaid"));
    var save = [finalVenue.html(), deal.html(), paid.html()];
    if(_.contains(save,"Empty"))
    {
      save[0]=save[1]=save[2] = "";
    }
    Session.set("loading",true);
    Meteor.call("updateFinalVenue", {
      selected: Session.get("selected"),
      finalVenue: {venue: save[0], deal: save[1], paid: save[2]}
    }, function (error, _id) {
      if (error) {
        Session.set("addEventError", {error: error.reason, details: error.details});
      }
      else {
        Session.set("addEventSuccess",{
          success: "Successfully saved changes",
          details: "Check other modules for completion"
        });
      }    
    }); 
    table = template.findAll("table")[1];
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var band = $(this).find("a.editBandContact").html();
      var status = $(this).find("a.editBandContactStatus").html();
      if(($(this).find("a.editable-empty").length == 0))
      {
        var push = {
          band: band,
          status: status
        };
        save.push(push);
      }
    });
    Meteor.call("updateBandContact",
    {
      wk2lineup: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        Session.set("addEventError", {error: error.reason, details: error.details});
      }
      else {
        Session.set("addEventSuccess",{
          success: "Successfully saved changes",
          details: "Check other modules for completion"
        });
      } 
    });
    table = template.findAll("table")[2];
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var sponsor = $(this).find("a.editSponsorContact").html();
      var status = $(this).find("a.editSponsorContactStatus").html();
      if(($(this).find("a.editable-empty").length == 0))
      {
        var push = {
          sponsor: sponsor,
          status: status
        };
        save.push(push);
      }
    });
    Meteor.call("updateSponsorsContact",
    {
      wk2sponsors: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        Session.set("addEventError", {error: error.reason, details: error.details});
      }
      else {
        Session.set("addEventSuccess",{
          success: "Successfully saved changes",
          details: "Check other modules for completion"
        });
      } 
    });      
    table = template.findAll("table")[3];
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var band = $(this).find("a.lineupContract").html();
      var status = $(this).find("a.editLineupContractStatus").html();
      if(($(this).find("a.editable-empty").length == 0))
      {
        var push = {
          band: band,
          status: status
        };
        save.push(push);
      }
    });
    if(save.length > 0)
    {
      Meteor.call("updateLineupContract",
      {
        wk2lineupContract: save,
        selected: Session.get("selected")
      },
      function (error, _id) {
        if (error) {
          Session.set("addEventError", {error: error.reason, details: error.details});
        }
        else {
          Session.set("addEventSuccess",{
            success: "Successfully saved changes",
            details: "Check other modules for completion"
          });
        } 
      });      
    }   
    Session.set("loading",false);
  }
});

Template.finalVenue.rendered = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  var venues = [];
  if(event)
  {
    $(event.venue).each( function () {
      venues.push($(this).attr("venue"));
    });
    $(".editFinalVenue").editable({
      unsavedclass: null,
      type: 'typeahead',
      source: venues
    });
    $(".editDeal").editable({
      unsavedclass: null,
      type: 'textarea'
    });  
    $(".editPaid").editable({
        unsavedclass: null,
        type: 'number'
    });      
  }
}

Template.finalVenue.venue = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.finalVenue;
  }
}

Template.lineupContact.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2lineup;
  }
}

Template.lineupContact.rendered = function () {
  $(".editBandContact").editable({
    unsavedclass: null,
  });
  $(".editBandContactStatus").editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
  });
}

Template.lineupContact.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#lineup_table");
    $(table).append('<tr><td><a href="#" class="editBandContact"></a></td><td><a href="#" class="editBandContactStatus">Not yet contacted</a></td></tr>');
    $(".editBandContact").editable({
      unsavedclass: null,
    });
    $(".editBandContactStatus").editable({
      unsavedclass: null,
      type: 'select',
      source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
    });       
  }
});

Template.sponsorsContact.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2sponsors;
  }
}

Template.sponsorsContact.rendered = function () {
  $(".editSponsorContact").editable({
    unsavedclass: null,
  });
  $(".editSponsorContactStatus").editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted", "Followed up", "Approved", "Rejected"]
  });   
}

Template.sponsorsContact.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#sponsors_contact_table");
    $(table).append('<tr><td><a href="#" class="editSponsorContact"></a></td><td><a href="#" class="editSponsorContactStatus">Not yet contacted</a></td></tr>');
    $(".editSponsorContact").editable({
      unsavedclass: null,
    });
    $(".editSponsorContactStatus").editable({
      unsavedclass: null,
      type: 'select',
      source: ["Not yet contacted", "Contacted", "Followed up", "Approved", "Rejected"]
    });       
  }
});

Template.lineupContract.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2lineupContract;
  }
}

Template.lineupContract.rendered = function () {
  $(".editLineupContractStatus").editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet signed", "Sent", "Signed"]
  });   
}

Template.posterFinal.events({
  'click #upload' : function() {
    filepicker.setKey("AwF05MMJuRkGDqKAeQanoz");
    filepicker.pick({
      mimetypes: ['image/*'],
      container: 'modal',
      services: ['COMPUTER', 'FACEBOOK'],
    },
    function(FPFile) {
      console.log(JSON.stringify(FPFile));
      Meteor.call("addFinalPoster", {
        id: Session.get("selected"),
        url: FPFile.url
      },
      function(error, _id) {
        if (error) {
          Session.set("addImageError", {error: error.reason, details: error.details});
        }
        else {
          console.log("Successfully uploaded image");
        }        
      });
    },
    function(FPError) {
      console.log(FPError.toString());
    }
  );
  }
});

Template.posterFinal.url = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
   return event.finalPoster;
}

Template.week3.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 2).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 1).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week3.events({
  'click #save' : function (event, template) {
    var table = template.find("#finalLineup");
    var records = _.rest($(table).find("tr"));
    var save = [];
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

    Meteor.call("updateFinalLineup",
    {
      lineup: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        Session.set("addEventError", {error: error.reason, details: error.details});
      }
    });

    table = template.find("#final_sponsors_table");
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var sponsor = $(this).find("a.editSponsor").html();
      var collaterals = $(this).find("a.editCollaterals").html();
      if(($(this).find("a.editable-empty").length == 0))
      {
        var push = {
          sponsor: sponsor,
          collaterals: collaterals
        };
        save.push(push);
      }
    });

    Meteor.call("updateFinalSponsors",
    {
      finalSponsors: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        Session.set("addEventError", {error: error.reason, details: error.details});
      }
    });

    table = template.find("#promotions_table");
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var platform = $(this).find("a.editPlatform").html();
      var link = $(this).find("a.editLink").html();
      if(($(this).find("a.editable-empty").length == 0))
      {
        var push = {
          platform: platform,
          link: link
        };
        save.push(push);
      }
    });

   Meteor.call("updatePromotions",
    {
      promotions: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        Session.set("addEventError", {error: error.reason, details: error.details});
      }
    });

  }
});

Template.finalLineup.rendered = function () {
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

Template.finalLineup.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#finalLineup");
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

Template.finalLineup.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { finalLineup: 1 });
  if(cursor)
  {
    var num = 1;
    if(cursor.finalLineup)
    {
      cursor.finalLineup.forEach(function (entry)
      {
        entry.num = num;
        num++;
      });
    }
    return cursor.finalLineup;
  }
}

Template.finalSponsors.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.finalSponsors;
  }
}

Template.finalSponsors.rendered = function () {
  $(".editSponsor").editable({
    unsavedclass: null
  });
  $(".editCollaterals").editable({
    unsavedclass: null
  });   
}

Template.finalSponsors.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#final_sponsors_table");
    $(table).append('<tr><td><a href="#" class="editSponsor"></a></td><td><a href="#" class="editCollaterals"></a></td></tr>');
    $(template.findAll(".editSponsor")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editCollaterals")).editable({
      unsavedclass: null
    });       
  }
});

Template.promotions.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#promotions_table");
    $(table).append('<tr><td><a href="#" class="editPlatform"></a></td><td><small><a href="#" class="editLink"></a></small> <a href="#" class="goto"><small>[goto]</small></a></td></tr>');
    $(".editPlatform").editable({
      unsavedclass: null
    });
    $(".editLink").editable({
      unsavedclass: null,
      validate: function (value) {
        $(".goto").attr("href", value);
      }
    });
  }
});

Template.promotions.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.promotions;
  }
}

Template.promotions.rendered = function () {
  $(".editPlatform").editable({
    unsavedclass: null
  });
  $(".editLink").editable({
    unsavedclass: null,
    validate: function (value) {
      $(".goto").attr("href", value);
    }
  });
}

Template.workAssignments.events({
  'click #addShift' : function(event, template) {
    var table = template.find("#work_assignments_table");
    var c = $(table).find("tr:first").children().length;
    $(table).find("tr:first").append("<th>Shift " + c + "</th>");
    $(table).find("tr:gt(0)").append("<td>Col</td>");
  },
  'click #addEntry': function(event, template) {
    var table = template.find("#work_assignments_table");
    var c = $(table).find("tr:first").children().length;
    var tr = $("<tr>");
    for(var i = 0; i < c; i++)
    {
      tr.append("<td>a</td>");
    }
    $(table).append(tr);
  }
});