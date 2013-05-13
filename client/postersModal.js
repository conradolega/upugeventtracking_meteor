Template.postersModal.rendered = function () {  
  $(this.findAll('.editPerson')).editable({
    unsavedclass: null,
    mode: 'inline'
  })
}

Template.postersModal.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
    return event.postingAssignments
}