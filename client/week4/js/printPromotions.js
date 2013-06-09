Template.printPromotions.events({
  'click #addEntry' : function (event, template){
    var table = template.find("#printPromotions");
    $(table).append('<tr><td><a href="#" class="editTask"></a></td><td><a href="#" class="editStatus">Not yet started</a></td></tr>');
    $(template.findAll(".editTask")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editStatus")).editable({
      type: 'select',
      source: ["Not yet started", "Started", "Completed"],
      unsavedclass: null
    });
  }
})

Template.printPromotions.rendered = function () {
  $(this.findAll(".editTask")).editable({
    unsavedclass: null
  });
  $(this.findAll(".editStatus")).editable({
    type: 'select',
    source: ["Not yet started", "Started", "Completed"],
    unsavedclass: null
  });
}

Template.printPromotions.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")})
  if(event){
    return event.printPromotions
  }
}
