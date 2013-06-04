Template.rtrModal2.rendered = function () {
  $(this.findAll(".editPerson")).editable({
    unsavedclass: null,
    mode: 'inline'
  })
}

Template.rtrModal2.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
      return event.rtr2
  }
}