Template.week2.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 5).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 4).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week2.events({
  'click #save' : function (event, template) {
    Session.set("loading", true)
    var table = template.find("#lineup_contact_table")
    var records = _.rest($(table).find("tr"));
    var save = [];
    $(records).each( function () {
      var band = $(this).find("a.editBandContact").html();
      var status = $(this).find("a.editBandContactStatus").html();
      var date = $(this).find("a.editBandDate").html();
      if(($(this).find("a.editBandContact.editable-empty").length == 0))
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
    Meteor.call("updateBandContact",
    {
      wk2lineup: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        toastr.error(error.details, error.reason);
      }
      else {
        toastr.success('Performer contact info saved!', 'Week 2')
      } 
    });
    table = template.find("#sponsors_contact_table");
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var sponsor = $(this).find("a.editSponsorContact").html();
      var status = $(this).find("a.editSponsorContactStatus").html();
      var date = $(this).find("a.editSponsorDate").html();      
      if(($(this).find("a.sponsorContact.editable-empty").length == 0))
      {
        if(date == "Empty")
          date = ""
        var push = {
          sponsor: sponsor,
          status: status,
          date: date
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
        toastr.error(error.details, error.reason);
      }
      else {
        toastr.success('Sponsor contact info saved!', 'Week 2')
      } 
    });         
    
    Meteor.call("updateText",
    {
      selected: Session.get("selected")
    })
    Session.set("loading", false)         
  }
});
