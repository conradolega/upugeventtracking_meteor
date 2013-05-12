Template.work.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#work_table");
    $(table).append('<tr><td><a href="#" class="editWork"></a></td><td><a href="#" class="editNum"></a></td></tr>');
    $(template.findAll(".editWork")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editNum")).editable({
      unsavedclass: null,
      type: 'number'
    });    
  }
});

Template.work.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { work: 1 });
  if(cursor)
  {
    var num = 1;
    if(cursor.work)
    {
      cursor.work.forEach(function (entry)
      {
        entry.class = (num > 6) ? "editWork" : "";
        num++;
      });
      return cursor.work;
    }
  }
}

Template.work.rendered = function () {
  $(this.findAll(".editWork")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editNum")).editable({
    unsavedclass: null,
    type: 'number'
  });
}
