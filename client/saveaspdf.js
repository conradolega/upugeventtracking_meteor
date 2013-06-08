Template.saveaspdf.events({
	'click .downloadpdf': function(event) {
		var doc = new jsPDF("portrait", "in", "letter");
		doc.setFontSize(10);
		doc.setLineWidth(6.5);
		var lines = doc.splitTextToSize(JSON.stringify(Events.findOne(Session.get("selected"))), 6.5);
		doc.text(1, 1, lines);
		doc.save("event.pdf");
	}
});