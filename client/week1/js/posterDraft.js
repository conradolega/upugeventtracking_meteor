Template.posterDraft.images = function () {
  var event = Events.findOne({_id: Session.get("selected")});
  if (!event) return [];
    else return event.images;
} 

Template.posterDraft.events({
  'click #upload' : function() {
    filepicker.setKey("AwF05MMJuRkGDqKAeQanoz");
    filepicker.pick({
      mimetypes: ['image/*'],
      container: 'modal',
      services: ['COMPUTER', 'FACEBOOK'],
    },
    function(FPFile) {
      console.log(JSON.stringify(FPFile));
      Meteor.call("addImage", {
        id: Session.get("selected"),
        url: FPFile.url
      },
      function(error, _id) {
        if (error) {
          Session.set("addImageError", {error: error.reason, details: error.details});
        }
        else {
          console.log("Successfully uploaded image");
        }        
      });
    },
    function(FPError) {
      console.log(FPError.toString());
    }
  );
  }
});
