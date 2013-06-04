Template.lineupContact.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2lineup;
  }
}

Template.lineupContact.rendered = function () {
  $(this.findAll(".editBandContact")).editable({
    unsavedclass: null,
  });
  $(this.findAll(".editBandContactStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
  });
  $(this.findAll(".editBandDate")).editable({
    type: 'combodate',
    unsavedclass: null
  });  
}

Template.lineupContact.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#lineup_contact_table");
    $(table).append('<tr><td><a href="#" class="editBandContact"></a></td><td><a href="#" class="editBandContactStatus">Not yet contacted</a></td><td><a href="#" class="editBandDate"</a></td></tr>');
    $(template.findAll(".editBandContact")).editable({
      unsavedclass: null,
    });
    $(template.findAll(".editBandContactStatus")).editable({
      unsavedclass: null,
      type: 'select',
      source: ["Not yet contacted", "Contacted", "Approved", "Rejected"]
    });
    $(template.findAll(".editBandDate")).editable({
      type: 'combodate',
      unsavedclass: null
    });      
  }
});
