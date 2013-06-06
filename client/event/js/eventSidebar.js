Template.eventSidebar.eventBlock = function () {
  return Events.find();
};

Template.eventSidebar.addEventClass = function () {
  return Session.get("selected") === "addEvent" ? "active" : "inactive";
};

Template.eventSidebar.events({
  'click #addEvent' : function(event) {
    Session.set("selected", "addEvent");
    Session.set("addEventError", null);
    Session.set("addEventSuccess", null);
  }
});