Template.week3.dates = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    var startDate = moment(event.startTime).subtract('weeks', 4).format("ddd, MMM DD");
    var endDate = moment(event.startTime).subtract('weeks', 3).format("ddd, MMM DD");
    return startDate + " - " + endDate;
  }
}

Template.week3.events({
  'click #save' : function (event, template) {
    Session.set("loading", true)   

    var table = template.find("#work_table");
    var records = _.rest($(table).find("tr"));
    var save = [];
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
        toastr.error(error.details, error.reason);
      }
      else {
        toastr.success('Work logistics info saved!', 'Week 3');
      }    
    });  

    Meteor.call("updateText",
    {
      selected: Session.get("selected")
    })      
    Session.set("loading", false)    
  }
});
