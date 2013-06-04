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
    Session.set("loading", true)    
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
    table = template.find("table#remind_performers_table");
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
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success("Remind performers info saved!", "Week 5")
    });

    var saveHeader = [];
    table = template.find("#work_assignments_table");
    records = _.first($(table).find("tr"));
    $(_.rest($(records).children())).each( function () {
      if($(this).find('a.editable-empty').length == 0)
        {
          var push = {
            start: $(this).find('a.editShiftStartTime').html(),
            end: $(this).find('a.editShiftEndTime').html()
          };
          saveHeader.push(push); 
        }
    });

    var saveWork = [];
    records = _.rest($(table).find("tr"));      
    $(records).each( function () {
      var work = $(this).find("a.editWorkAssignments").html();
      var count = 0;
      if($(this).find("a.editable-empty.editWorkAssignments").length == 0)
        {
          var push = {name: work, workers: []};
          $(_.rest($(this).children())).each( function () {
            if(count != saveHeader.length)
              {
                if($(this).find("a.editable-empty").length > 0)
                  push.workers.push("");
                else
                  push.workers.push($(this).find("a.editWorkers").html());
                count++;
              }
          });
          saveWork.push(push);
        }
    });

    Meteor.call("updateWorkAssignments",
    {
      workAssignments: saveWork,
      workAssignmentsHeader: saveHeader,
      selected: Session.get("selected"),
    },
    function (error, _id) {
      if (error) {
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success('Work assignments saved!', 'Week 5')
    });

    Meteor.call("updateText",
    {
      selected: Session.get("selected")
    })    
    Session.set("loading", false);
  }
})
