Template.week5.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 1).format("ddd, MMM DD");
    var endDate = moment(event.startTime).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week5.events({
  'click #save' : function (event, template) {
    
    var table = template.find("table#sponsor_collateral_table");
    var records = _.rest($(table).find("tr"));
    var save = [];
    $(records).each( function () {
      var sponsor = $(this).find("a.editSponsor").html();
      var received = $(this).find("a.editReceived").html();
      var date = $(this).find("a.editDate").html();
      var receivedBy = $(this).find("a.editReceivedBy").html();
      if(!($(this).find("a.editable-empty.editSponsor").length > 0))
      {
        if(received == "Empty") { received = ""; }
        if(date == "Empty") { date = ""; }
        if(receivedBy == "Empty") { receivedBy = ""; }
        var push = {
          sponsor: sponsor,
          received: received,
          date: date,
          receivedBy: receivedBy
        };
        save.push(push);
      }
    });
    Meteor.call("updateSponsorCollateral",
    {
      sponsorCollateral: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if(error) {
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success('Updated sponsor collaterals info!', 'Week 5')
    })
  }

})