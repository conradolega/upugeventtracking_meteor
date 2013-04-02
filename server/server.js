Meteor.publish("events", function () {
	return Events.find({owner: this.userId});
});

Meteor.publish("users", function (){
	return Meteor.users.find({}, {fields: {'_id':1, 'profile':1}});
})

