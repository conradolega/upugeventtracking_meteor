Template.event.events({
  'click #event' : function (event) {
    Session.set("addEventError", null);
    Session.set("selected", this._id);
  }
});

Template.event.listItemClass = function () {
  return Session.equals("selected", this._id) ? "active" : "inactive";
};

Template.event.startTimeDisp = function () {
  var startTime = this.startTime;
  return moment(this.startTime).format("ddd, MMM DD h:mmA");
}

Template.event.endTimeDisp = function () {
  var endTime = this.endTime;
  return moment(this.endTime).format("ddd, MMM DD h:mmA");
}