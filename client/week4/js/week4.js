Template.week4.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 3).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 2).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week4.events({
  'click #save' : function (event, template) {
    Session.set("loading", true)

    var table = template.find("#lineup_contract_table")
    var records = _.rest($(table).find("tr"));
    var save = [];
    $(records).each( function () {
      var band = $(this).find("a.lineupContract").html();
      var status = $(this).find("a.editLineupContractStatus").html();
      var date = $(this).find("a.editLineupContractDate").html();
      if(($(this).find("a.lineupContract.editable-empty").length == 0))
      {
        if(date == "Empty")
          date = ""
        var push = {
          band: band,
          status: status,
          date: date
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
          toastr.error(error.details, error.reason);
        }
        else {
          toastr.success('Band contract info saved!', 'Week 4')
        } 
      });      
    } 

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
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success('Online promotions info saved!', 'Week 3')
    });


    Meteor.call("updateText",
    {
      selected: Session.get("selected")
    })  
    Session.set("loading", false)    
  }
});
