Template.remindPerformers2.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.performerRemind2;
  }
}

Template.remindPerformers2.rendered = function () {
  $(this.findAll(".editPerformerRemindStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet contacted", "Contacted"]
  });   
}
