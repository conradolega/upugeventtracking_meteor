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
