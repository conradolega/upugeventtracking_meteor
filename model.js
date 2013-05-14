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
        work: [{name: "Program"}, {name: "Runner"}, {name: "Timer"}, {name: "Peace"}, {name: "Hosts"}, {name: "Baggage"}, {name: "Tech"}, {name: "Entrance"} ],
        images: [],
        wk2lineup: [],
        wk2sponsors: [],
        wk2lineupContract: [],
        finalPoster: {},
        finalLineup: [],
        finalSponsors: [],
        promotions: [],
        workAssignments: [],
        workAssignmentsHeader: [],
        performerRemind: [],
        sponsorCollateral: [],
        wk4promotions: [],
        postingAssignments: [{where: 'FA', number: 4}, 
{where: 'College of Science', number: 2}, 
{where: 'Chem Pav. - OSA', number: 4}, 
{where: 'CASAA', number: 10}, 
{where: 'Law - OSA', number: 2}, 
{where: 'Ilang-Ilang Dorm - OSA', number: 2}, 
{where: 'SC Stalls and Board', number: 25}, 
{where: 'Kalai Dorm - OSA', number: 2}, 
{where: 'Molave Dorm - OSA', number: 4}, 
{where: 'Coll. of Mass Com', number: 6}, 
{where: 'Gym', number: 5}, 
{where: 'ISSI - OSA', number: 3}, 
{where: 'SURP - OSA', number: 3}, 
{where: 'Kamia Dorm - OSA', number: 2}, 
{where: 'Sampaguita Dorm', number: 2}, 
{where: 'Ipil Dorm - OSA', number: 4}, 
{where: 'CNB (CAL) - FC', number: 4}, 
{where: 'AS', number: 40}, 
{where: 'PHAN - OSA', number: 6}, 
{where: 'Educ - OSA', number: 5}, 
{where: "Vinzon's - OSA", number: 4}, 
{where: 'CHE - OSA/College', number: 6}, 
{where: 'Math', number: 10}, 
{where: 'BA', number: 4}, 
{where: 'Econ', number: 4}, 
{where: 'Stat - OSA', number: 4}, 
{where: 'Engg - OSA', number: 10}, 
{where: 'CSWCD', number: 6}, 
{where: 'Archi', number: 16}, 
{where: 'NCPAG - OSA', number: 4}, 
{where: 'IB - OSA', number: 4}, 
{where: 'NIGS - OSA', number: 4}, 
{where: 'Villadolid - OSA', number: 2}, 
{where: 'Albert Hall', number: 2}, 
{where: 'NIP', number: 4}, 
{where: 'Kiosks sa FC', number: 4}, 
{where: 'Main Lib. Walk', number: 12}, 
{where: "Center for Women's Studies", number: 2}, 
{where: 'Vanguard - OSA', number: 2}, 
{where: 'AIT - OSA', number: 4}, 
{where: 'Physics Pav. - OSA', number: 4}, 
{where: 'Bio Pav. - OSA', number: 4}, 
{where: 'College Of Music', number: 8},
{where: 'Philcoa', number: 20}, 
{where: 'Katipunan', number: 20}, 
{where: 'Pantranco', number: 20}, 
{where: 'MRT/Hi-way', number: 20}, 
{where: 'SM North', number: 20}, 
{where: 'Ikot', number: 20},  
{where: 'Toki', number: 20},  
{where: 'Ateneo', number: 2},  
{where: 'Katipunan Area', number: 10},  
{where: 'Philcoa Area', number: 20},  
{where: "KNL Area and Sarah's", number: 20},  
{where: 'Freedom Bar', number: 2},  
{where: 'Bluberri', number: 2},  
{where: 'MRS', number: 2},  
{where: 'Blue Room', number: 2}, 
{where: 'Circus', number: 2},   
{where: 'Love One Another', number: 2},  
{where: 'Maginhawa', number: 25},  
{where: 'Pansol Area', number: 10},  
],
        rtr: [{time: "8:30 - 10:00"}, {time: "10:00 - 11:30"}, {time: "11:30 - 1:00"}, {time: "1:00 - 2:30"}, {time: "2:30 - 4:00"}, {time: "4:00 - 5:30"}],
        rtr2:[{time: "8:30 - 10:00"}, {time: "10:00 - 11:30"}, {time: "11:30 - 1:00"}, {time: "1:00 - 2:30"}, {time: "2:30 - 4:00"}, {time: "4:00 - 5:30"}],
        otherPromotions: [],
        performerRemind2: []
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
            url: options.url,
            date: moment().utc().format('MMMM Do YYYY, h:mm:ss a').toString()
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
        $set: { finalPoster: { url: options.url, date: moment().utc().format('MMMM Do YYYY, h:mm:ss a').toString() } }
      }
    );
  },
  updateFinalLineup: function(options) {
    options = options || {};
    var bands = _.pluck(options.lineup, 'band');
    var save = []
    _.each(bands, function (entry)
    {
      save.push({
        band: entry,
        status: "Not yet contacted"
      });
    });
    return Events.update(
      {_id: options.selected},
      {
        $set: { finalLineup: options.lineup, performerRemind: save, performerRemind2: save }
      }
    );
  },
  updateFinalSponsors: function(options) {
    options = options || {};
    var sponsorCollateral = []
    _.each(_.pluck(options.finalSponsors, 'sponsor'), function (d) {
      sponsorCollateral.push({sponsor: d});
    })
    return Events.update(
      {_id: options.selected},
      {
        $set: { finalSponsors: options.finalSponsors, sponsorCollateral: sponsorCollateral }
      }
    );    
  },
  updatePromotions: function(options) {
    options = options || {};
    var wk4promotions = []
    _.each(_.pluck(options.promotions, 'platform'), function (d) {
      wk4promotions.push({platform: d, status: "Not yet shared"});
    })
    return Events.update(
      {_id: options.selected},
      {
        $set: { promotions: options.promotions, wk4promotions: wk4promotions }
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
  },
  updatePerformerRemind: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { performerRemind: options.performerRemind }
      })
  },
  updateSponsorCollateral: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { sponsorCollateral: options.sponsorCollateral }
      })
  },
  updateWk4Promotions: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { wk4promotions: options.wk4promotions }
      })
  },
  updatePostingAssignments: function(options) {
    options = options || {};
    var event = Events.findOne({_id: options.selected}, {postingAssignments: 1})
    if(event)
    {
      var count = 0;
      _.each(event.postingAssignments, function (d) {
        d.person = options.postingAssignments[count]
        count++;
      })
      return Events.update(
        {_id: options.selected},
        {
          $set: { postingAssignments: event.postingAssignments }
        }
      )
    }    
  },
  updateRTR: function(options) {
    options = options || {}
    var event = Events.findOne({_id: options.selected}, {rtr: 1})
    if(event)
    {
      var count = 0;
      _.each(event.rtr, function(d) {
        d.tth = options.rtr[count].tth
        d.wf = options.rtr[count].wf
        count++;
      })
      return Events.update(
        {_id: options.selected},
        {
          $set: { rtr: event.rtr }
        }
      )
    }
  },
  updateOtherPromotions: function(options) {
    options = options || {}
    return Events.update(
      {_id: options.selected},
      {
        $set: { otherPromotions: options.otherPromotions }
      })
  },
  updateText: function (options) {
    return  Events.update(
      {_id: options.selected},
      {
        $set: {updated: moment().utc().toString(), lastUpdate: Meteor.userId()}
      })  
  },
  updatePerformerRemind2: function(options) {
    options = options || {};
    return Events.update(
      {_id: options.selected},
      {
        $set: { performerRemind2: options.performerRemind }
      })
  },
  updateRTR2: function(options) {
    options = options || {}
    var event = Events.findOne({_id: options.selected}, {rtr2: 1})
    if(event)
    {
      var count = 0;
      _.each(event.rtr2, function(d) {
        d.tth = options.rtr[count].tth
        d.wf = options.rtr[count].wf
        count++;
      })
      return Events.update(
        {_id: options.selected},
        {
          $set: { rtr2: event.rtr2 }
        }
      )
    }
  }  
})