Template.body.rendered = function () {
  $('#sidebar').affix();
}

Template.body.showDetails = function () {
  return Session.get("selected");
}

Template.body.showSteps = function () {
  return Session.get("selected") != "addEvent";
}

Template.page.loading = function () {
  return Session.get("loading");
}

Template.body.showLoader = function () {
  return Session.get("eventsLoaded");
}

Template.body.showError = function () {
  return Session.get("addEventError");
}

Template.body.showSuccess = function () {
  return Session.get("addEventSuccess");
}

Template.body.events({
  'click .close' : function () {
    Session.set("addEventError", null);
    Session.set("addEventSuccess", null);
  }
});