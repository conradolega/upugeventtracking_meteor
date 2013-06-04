Template.remindPerformers.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.performerRemind;
  }
}

Template.remindPerformers.rendered = function () {
  $(this.findAll(".editPerformerRemindStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted"]
  });   
}
