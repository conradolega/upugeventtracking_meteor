Template.finalVenue.rendered = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  var venues = [];
  if(event)
  {
    $(event.venue).each( function () {
      venues.push($(this).attr("venue"));
    });
    $(this).find(".editFinalVenue").editable({
      unsavedclass: null,
      type: 'typeahead',
      source: venues
    });
    $(this).find(".editDeal").editable({
      unsavedclass: null,
      type: 'textarea'
    });  
    $(this).find(".editPaid").editable({
        unsavedclass: null,
        type: 'number'
    });      
  }
}

Template.finalVenue.venue = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.finalVenue;
  }
}
