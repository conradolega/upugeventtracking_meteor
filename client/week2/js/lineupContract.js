Template.lineupContract.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk2lineupContract;
  }
}

Template.lineupContract.rendered = function () {
  $(this.findAll(".editLineupContractStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet signed", "Sent", "Signed"]
  });   
  $(this.findAll(".editLineupContractDate")).editable({
      unsavedclass: null,
      type: 'combodate'
  });     
}
