Template.week3.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 3).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 2).format("ddd, MMM DD");
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
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success('Final lineup saved!', 'Week 3')
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
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success('Final sponsors saved!', 'Week 3')
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
        toastr.error(error.details, error.reason)
      }
      else
        toastr.success('Online promotions info saved!', 'Week 3')
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
        toastr.success('Work assignments saved!', 'Week 3')
    });
    Meteor.call("updateText",
    {
      selected: Session.get("selected")
    })      
  }
});
