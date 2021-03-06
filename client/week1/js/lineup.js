Template.lineup.rendered = function () {
  $(this.findAll(".editCell")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editStartTime")).editable({
    type: 'combodate',
    format: 'hh:mm A',
    template: 'hh : mm A',
    unsavedclass: null
  });
  $(this.findAll(".editEndTime")).editable({
    type: 'combodate',
    format: 'hh:mm A',
    template: 'hh : mm A',
    unsavedclass: null
  });
}

Template.lineup.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#lineup_table");
    var next = parseInt($(table).find("tr:last > td:first").html()) + 1;
    if(isNaN(next))
      next = 1;
    $(table).append('<tr><td>' + next + '</td><td><a href="#" class="editCell"></a></td><td><a href="#" class="editStartTime"></a></td><td><a href="#" class="editEndTime"></a></td></tr>');
    $(template.findAll(".editCell")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editStartTime")).editable({
      type: 'combodate',
      format: 'hh:mm A',
      template: 'hh : mm A',
      unsavedclass: null
    });
    $(template.findAll(".editEndTime")).editable({
      type: 'combodate',
      format: 'hh:mm A',
      template: 'hh : mm A',
      unsavedclass: null
    });    
  }
});

Template.lineup.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { lineup: 1 });
  if(cursor)
  {
    var num = 1;
    if(cursor.lineup)
    {
      cursor.lineup.forEach(function (entry)
      {
        entry.num = num;
        num++;
      });
      return cursor.lineup;
    }
  }
}

