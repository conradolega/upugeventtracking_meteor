Template.sponsorCollateral.rows = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
  {
    return event.sponsorCollateral;
  }
}

Template.sponsorCollateral.rendered = function () {
  $(this.findAll(".editSponsor")).editable({
    unsavedclass: null
  })
  $(this.findAll(".editReceived")).editable({
    unsavedclass: null
  })
  $(this.findAll(".editDate")).editable({
    type: 'combodate',
    unsavedclass: null
  })
  $(this.findAll(".editReceivedBy")).editable({
    unsavedclass: null
  })
}

Template.sponsorCollateral.events({
  'click #addEntry' : function (event, template) {
    var table = template.find("#sponsor_collateral_table");
    $(table).append("<tr><td><a href='#' class='editSponsor'></a></td><td><a href='#' class='editReceived'></a></td><td><a href='#' class='editDate'></a></td><td><a href='#' class='editReceivedBy'></a></td></tr>");
    $(template.findAll(".editSponsor")).editable({
      unsavedclass: null
    })
    $(template.findAll(".editReceived")).editable({
      unsavedclass: null
    })
    $(template.findAll(".editDate")).editable({
      type: 'combodate',
      unsavedclass: null
    })
    $(template.findAll(".editReceivedBy")).editable({
      unsavedclass: null
    })
  }
})