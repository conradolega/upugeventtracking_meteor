//Events -- data model

/*Events:
  - name
  - start time
  - end time
*/
Events = new Meteor.Collection("events");

Meteor.methods({
  createEvent: function (options) {
    options = options || {};
    if (! (typeof options.name === "string" && options.name.length &&
           typeof options.start === "string" && options.start.length &&
           typeof options.end === "string" && options.end.length ) )
      throw new Meteor.Error(400, "Required parameter missing", "please check fields");
    if(options.name.length > 100)
      throw new Meteor.Error(401, "Event name too long", "should be less than or equal to 100 characters");
    var start = moment(options.start);
    var end = moment(options.end);
    if(!start.isValid() || !end.isValid())
      throw new Meteor.Error(402, "Invalid date format", "use MM/dd/yyyy HH:mm PP");
    var timeDiff = end.diff(start, 'minutes');
    if(timeDiff <= 0)
      throw new Meteor.Error(403, "Invalid date input", "start date may not be less than or equal to end date");
    else if((timeDiff >= 0) && (timeDiff < 30))
      throw new Meteor.Error(404, "Event duration too short", "event must span for at least 30 minutes");
    
    if(options.selected == "addEvent")
    {
      return Events.insert({
        name: options.name,
        venue: "None",
        startTime: start.format('MM/DD/YYYY hh:mm A'),  
        endTime: end.format('MM/DD/YYYY hh:mm A'),
        created: moment().utc().toString(),
        updated: moment().utc().toString(),
        collaborators: [Meteor.userId()],
        lastUpdate: Meteor.userId(),
        lineup: [],
        sponsors: []
      });
    }
    else
    {
      return Events.update(
        {_id: options.selected},
        {$set: {name: options.name, 
          startTime: start.format('MM/DD/YYYY hh:mm A'),
          endTime: end.format('MM/DD/YYYY hh:mm A'),
          updated: moment().utc().toString(),
          lastUpdate: Meteor.userId()}
        }
      );
    }
  },
  addCollaborators: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $addToSet: { collaborators: { $each: options.ids } }
      }
    );
  },
  updateLineup: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { lineup: options.lineup }
      }
    );
  },
  updateSponsors: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { sponsors: options.sponsors }
      }
    );
  }   
})