Meteor.startup( function () {
	Events.remove({});
})

Meteor.publish("events", function () {
	return Events.find({owner: this.userId});
})
