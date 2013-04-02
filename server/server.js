

Meteor.publish("events", function () {
	return Events.find({owner: this.userId});
})
