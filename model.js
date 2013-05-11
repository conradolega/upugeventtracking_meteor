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
        finalVenue: {},
        startTime: start.format('MM/DD/YYYY hh:mm A'),  
        endTime: end.format('MM/DD/YYYY hh:mm A'),
        created: moment().utc().toString(),
        updated: moment().utc().toString(),
        collaborators: [Meteor.userId()],
        lastUpdate: Meteor.userId(),
        lineup: [],
        sponsors: [],
        venue: [],
        work: [{name: "Program"}, {name: "Runner"}, {name: "Timer"}, {name: "Peace"}, {name: "Hosts"}, {name: "Baggage"} ],
        images: [],
        wk2lineup: [],
        wk2sponsors: [],
        wk2lineupContract: [],
        finalPoster: {},
        finalLineup: [],
        finalSponsors: [],
        promotions: [],
        workAssignments: [],
        workAssignmentsHeader: []
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
    var event = Events.findOne({_id: options.selected});
    if(!_.isEqual(event.lineup,options.lineup))
    {
      var contact = [];
      _.each(options.lineup, function (element) {
        var push = {
          status: "Not yet contacted",
          band: element.band
        };
        contact.push(push);
      });
      return Events.update(
        {_id: options.selected},
        {
          $set: { lineup: options.lineup, wk2lineup: contact, wk2lineupContract: []}
        }
      );
    }
  },
  updateSponsors: function(options) {
    options = options || {};
    var event = Events.findOne({_id: options.selected});    
    if(!_.isEqual(event.sponsors,options.sponsors))
    {
      var contact = [];
      _.each(options.sponsors, function (element) {
        var push = {
          status: "Not yet contacted",
          sponsor: element.sponsor
        };
        contact.push(push);
      });
      return Events.update(
        {_id: options.selected},
        {
          $set: { sponsors: options.sponsors, wk2sponsors: contact}
        }
      );
    }
  },
 updateVenue: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { venue: options.venue}
      }
    );    
  },
  // Images methods
  addImage: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.id},
      {
        $addToSet: { 
          images: {
            url: options.url
            // To do: get uploader
          }  
        }
      }
    );
  },
 updateWork: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { work: options.work, workAssignments: options.work }
      }
    );
  },
  updateFinalVenue: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { finalVenue: options.finalVenue }
      }
    );
  },
  updateBandContact: function(options) {
    options = options || {};
    var save = [];
    var event = Events.findOne({_id:options.selected});
    _.each(options.wk2lineup, function (element) {
      if(element.status == "Approved")
      {
        var push = {
          band: element.band,
          status: "Not yet signed"
        };
        save.push(push);
      }
    });
    return Events.update(
      {_id: options.selected},
      {
        $set: { wk2lineup: options.wk2lineup, wk2lineupContract: save }
      })
  },
  updateSponsorsContact: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { wk2sponsors: options.wk2sponsors }
      })    
  },
  updateLineupContract: function(options) {
    options = options || {};
    var event = Events.findOne({_id: options.selected});
    var save = [];
    if(event)
    {
      _.each(options.wk2lineupContract, function (element) {
        if(_.contains(_.pluck(event.wk2lineupContract,'band'), element.band))
        {
          save.push(element);
        }
      });
      _.each(event.wk2lineupContract, function (element) {
        if(!_.contains(_.pluck(save,'band'), element.band))
            save.push(element);
      });
      return Events.update(
        {_id: options.selected},
        {
          $set: { wk2lineupContract: save }
        })
    }
  },
  addFinalPoster: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.id},
      {
        $set: { finalPoster: options.url }
      }
    );
  },
  updateFinalLineup: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { finalLineup: options.lineup }
      }
    );
  },
  updateFinalSponsors: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { finalSponsors: options.finalSponsors }
      }
    );    
  },
  updatePromotions: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { promotions: options.promotions }
      }
   );    
  },
  updateWorkAssignments: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { workAssignments: options.workAssignments, 
          workAssignmentsHeader: options.workAssignmentsHeader}
      }
   );   
  }
})