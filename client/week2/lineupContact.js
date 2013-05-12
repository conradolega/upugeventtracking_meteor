Template.lineupContact.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2lineup;
  }
}

Template.lineupContact.rendered = function () {
  $(this).find(".editBandContact").editable({
    unsavedclass: null,
  });
  $(this).find(".editBandContactStatus").editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
  });
}

Template.lineupContact.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#lineup_table");
    $(table).append('<tr><td><a href="#" class="editBandContact"></a></td><td><a href="#" class="editBandContactStatus">Not yet contacted</a></td></tr>');
    $(template.findAll(".editBandContact")).editable({
      unsavedclass: null,
    });
    $(template.findAll(".editBandContactStatus")).editable({
      unsavedclass: null,
      type: 'select',
      source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
    });       
  }
});
