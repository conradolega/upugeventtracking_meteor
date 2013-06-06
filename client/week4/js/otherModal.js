Template.otherModal.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#other_table");
    $(table).append('<tr><td><a href="#" class="editPromotion"></a></td><td><a href="#" class="editStatus">Not yet completed</a></td></tr>');
    $(template.findAll(".editPromotion")).editable({
      unsavedclass: null,
      mode: 'inline'
    });
    $(template.findAll(".editStatus")).editable({
      unsavedclass: null,
      type: 'select',
      source: ['Not yet completed', 'Completed'],
      mode: 'inline'
    });
  }
})

Template.otherModal.rendered = function () {
  $(this.findAll(".editPromotion")).editable({
    unsavedclass: null,
    mode: 'inline'
  });
  $(this.findAll(".editStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ['Not yet completed', 'Completed'],
    mode: 'inline'
  });  
}

Template.otherModal.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.otherPromotions;
  }
}