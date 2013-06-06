Template.finalSponsors.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.finalSponsors;
  }
}

Template.finalSponsors.rendered = function () {
  $(this.findAll(".editSponsor")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editCollaterals")).editable({
    unsavedclass: null
  });   
}

Template.finalSponsors.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#final_sponsors_table");
    $(table).append('<tr><td><a href="#" class="editSponsor"></a></td><td><a href="#" class="editCollaterals"></a></td></tr>');
    $(template.findAll(".editSponsor")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editCollaterals")).editable({
      unsavedclass: null
    });       
  }
});
