Template.week2.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 4).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 3).format("ddd, MMM DD");
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
