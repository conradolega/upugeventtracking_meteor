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
          name: work,
        };
      }
      else
      {
        var push = {
          name: work,
          num: num
        };
      }
      save.push(push);
    }
    else if($(this).find("a.editable-empty").length == 0)
    {
      var push = {
        name: work,
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
    var startDate = moment(event.startTime).subtract('weeks', 5).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 4).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}