Template.wk4promotions.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.wk4promotions;
  }
}

Template.wk4promotions.rendered = function () {
  $(this.findAll(".editPromotionStatus")).editable({
    unsavedclass: null,
    type: 'select',
    source: ["Not yet shared", "Shared"]
  })
}