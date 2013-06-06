Template.venue.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#venue_table");
    $(table).append('<tr><td><a href="#" class="editVenue"></a></td><td><a href="#" class="editAddress"></a></td></tr>');
    $(template.findAll(".editVenue")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editAddress")).editable({
      unsavedclass: null
    });    
  }
});

Template.venue.rows = function() {
  var cursor = Events.findOne({_id: Session.get("selected")}, { venue: 1 });
  if(cursor)
  {
    return cursor.venue;
  }
}

Template.venue.rendered = function () {
  $(this.findAll(".editVenue")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editAddress")).editable({
    unsavedclass: null
  });
}