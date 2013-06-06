Template.venueContact.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#venue_contact_table");
    $(table).append('<tr><td><a href="#" class="editVenueContact"></a></td><td><a href="#" class="editVenueStatus">Not yet contacted</a></td></tr>');
    $(template.findAll(".editVenueContact")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editVenueStatus")).editable({
      unsavedclass: null,
      type: 'select',
      source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
    });
  }
});

Template.venueContact.rendered = function () {
  $(this.findAll(".editVenueContact")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editVenueStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
  });
}

Template.venueContact.rows = function () {
  var cursor = Events.findOne({_id: Session.get("selected")}, { venueContact: 1 });
  if(cursor){
    return cursor.venueContact
  }
}
