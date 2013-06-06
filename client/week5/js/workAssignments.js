Template.workAssignments.events({
  'click #addShift' : function(event, template) {
    var table = template.find("#work_assignments_table");
    $(table).find("tr:first").append('<th><small><a href="#" class="editShiftStartTime"></a> - <a href="#" class="editShiftEndTime"></a></small></th>');
    $(table).find("tr:gt(0)").append('<td><a href="#" class="editWorkers" /></td>');

    $(template.findAll(".editShiftStartTime")).editable({
      type: 'combodate',
      format: 'hh:mm A',
      template: 'hh : mm A',
      unsavedclass: null
    });
    $(template.findAll(".editShiftEndTime")).editable({
      type: 'combodate',
      format: 'hh:mm A',
      template: 'hh : mm A',
      unsavedclass: null
    });
    $(template.findAll(".editWorkAssignments")).editable({
      unsavedclass: null
    });    
    $(template.findAll(".editWorkers")).editable({
      unsavedclass: null
    });        
  },
  'click #addEntry': function(event, template) {
    var table = template.find("#work_assignments_table");
    var c = $(table).find("tr:first").children().length;
    var tr = $("<tr>");
    for(var i = 0; i < c; i++)
    {
      if(i == 0)
        tr.append('<td><a href="#" class="editWorkAssignments" /></td>');
      else
        tr.append('<td><a href="#" class="editWorkers" /></td>');
    }
    $(table).append(tr);
    $(".editWorkAssignments").editable({
      unsavedclass: null
    });
    $(".editWorkers").editable({
      unsavedclass: null
    });    
  }
});

Template.workAssignments.rendered = function () {
  $(this.findAll(".editWorkAssignments")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editWorkers")).editable({
    unsavedclass: null
  });    
  $(this.findAll(".editShiftStartTime")).editable({
    type: 'combodate',
    format: 'hh:mm A',
    template: 'hh : mm A',
    unsavedclass: null
  });
  $(this.findAll(".editShiftEndTime")).editable({
    type: 'combodate',
    format: 'hh:mm A',
    template: 'hh : mm A',
    unsavedclass: null
  });  
}

Template.workAssignments.headers = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.workAssignmentsHeader;
  }
}

Template.workAssignments.work = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.workAssignments;
  }
}
