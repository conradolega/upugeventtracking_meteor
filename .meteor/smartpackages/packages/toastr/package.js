Package.describe({
	summary: "Javascript library for Gnome / Growl type non-blocking notifications"
})

Package.on_use(function (api) {
  api.add_files('toastr.min.css', 'client');
  api.add_files('toastr.min.js', 'client');
})