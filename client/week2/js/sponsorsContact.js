Template.sponsorsContact.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2sponsors;
  }
}

Template.sponsorsContact.rendered = function () {
  $(this.findAll(".editSponsorContact")).editable({
    unsavedclass: null,
  });
  $(this.findAll(".editSponsorContactStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted", "Followed up", "Approved", "Rejected"]
  });   
  $(this.findAll(".editSponsorDate")).editable({
    type: 'combodate',
    unsavedclass: null
  });
}

Template.sponsorsContact.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#sponsors_contact_table");
    $(table).append('<tr><td><a href="#" class="editSponsorContact"></a></td><td><a href="#" class="editSponsorContactStatus">Not yet contacted</a></td><td><a href="#" class="editSponsorDate"></a></td></tr>');
    $(template.findAll(".editSponsorContact")).editable({
      unsavedclass: null,
    });
    $(template.findAll(".editSponsorContactStatus")).editable({
      unsavedclass: null,
      type: 'select',
      source: ["Not yet contacted", "Contacted", "Followed up", "Approved", "Rejected"]
    });       
    $(template.findAll(".editSponsorDate")).editable({
      type: 'combodate',
      unsavedclass: null
    });    
  }
});
