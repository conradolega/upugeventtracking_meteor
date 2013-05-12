Template.sponsors.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#sponsors_table");
    $(table).append('<tr><td><a href="#" class="editSponsor"></a></td><td><a href="#" class="editPerson"></a></td><td><a href="#" class="editContact"></a></td></tr>');
    $(template.findAll(".editSponsor")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editPerson")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editContact")).editable({
      unsavedclass: null
    });        
  }
});

Template.sponsors.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { sponsors: 1 });
  if(cursor)
  {
    return cursor.sponsors;
  }
}

Template.sponsors.rendered = function () {
  $(this.findAll(".editSponsor")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editPerson")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editContact")).editable({
    unsavedclass: null
  });  
}

