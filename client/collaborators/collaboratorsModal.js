Template.collaboratorsModule.you = function () {
  return this._id === Meteor.userId();
}

Template.collaboratorsModule.help = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
    return Meteor.users.find({_id: {$in: event.collaborators}});
}

Template.collaboratorsModal.others = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if(event)
    return Meteor.users.find({_id: {$nin: event.collaborators}});
}

Template.collaboratorsModal.events({
  'click #addCollaborator' : function () {
    var checked = $("#collaboratorModal").find("input[type=checkbox]:checked");
    var ids = [];
    checked.each( function () {
      ids.push($(this).attr('userId'));
    });
    if(ids.length > 0)
    {
      Meteor.call('addCollaborators', 
      {
        ids: ids,
        selected: Session.get("selected")
      },
      function (error, _id) {
        if (error) {
          toastr.error(error.details, error.reason)
        }
        else {
          toastr.success('Collaborators successfully added!')
        }
      });
    }
  }
});