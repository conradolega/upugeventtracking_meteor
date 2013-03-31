//Events -- data model

Events = new Meteor.Collection("events");

/*Events:
	- name
	- start time
	- end time
*/

Meteor.methods({
  createEvent: function (options) {
    options = options || {};
    if (! (typeof options.name === "string" && options.name.length &&
           typeof options.start === "string" && options.start.length &&
           typeof options.end === "string" && options.end.length ) )
      throw new Meteor.Error(400, "Required parameter missing", "please check fields");
    if(options.name.length > 100)
      throw new Meteor.Error(401, "Event name too long", "should be less than or equal to 100 characters");
  } 
})