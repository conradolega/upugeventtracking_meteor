Template.promotions.events({
  'click #addEntry' : function(event, template) {
    var table = template.find("#promotions_table");
    $(table).append('<tr><td><a href="#" class="editPlatform"></a></td><td><small><a href="#" class="editLink"></a></small> <a href="#" class="goto"><small>[goto]</small></a></td></tr>');
    $(template.findAll(".editPlatform")).editable({
      unsavedclass: null
    });
    $(template.findAll(".editLink")).editable({
      unsavedclass: null,
      validate: function (value) {
        $(".goto").attr("href", value);
      }
    });
  }
});

Template.promotions.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.promotions;
  }
}

Template.promotions.rendered = function () {
  $(this).find(".editPlatform").editable({
    unsavedclass: null
  });
  $(this).find(".editLink").editable({
    unsavedclass: null,
    validate: function (value) {
      $(".goto").attr("href", value);
    }
  });
}
