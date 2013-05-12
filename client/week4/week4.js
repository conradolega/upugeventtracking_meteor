Template.week4.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 2).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 1).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week4.events({
  'click #save' : function (event, template) {

    table = template.find("#remind_performers_table");
    records = _.rest($(table).find("tr"));
    save = [];
    $(records).each( function () {
      var band = $(this).find("a.editPerformerRemind").html();
      var status = $(this).find("a.editPerformerRemindStatus").html();
      if(($(this).find("a.editable-empty").length == 0))
      {
        var push = {
          band: band,
          status: status
        };
        save.push(push);
      }
    });
    Meteor.call("updatePerformerRemind",
    {
      performerRemind: save,
      selected: Session.get("selected")
    },
    function (error, _id) {
      if (error) {
        toastr.error(error.details, error.success)
      }
      else
        toastr.success("Remind performers info saved!", "Week 4")
    }); 
  } 
});