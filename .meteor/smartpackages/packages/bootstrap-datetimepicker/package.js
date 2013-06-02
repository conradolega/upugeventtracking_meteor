Package.describe({
  summary: 'meteor port for bootstrap datetime picker'
});

Package.on_use(function (api, where) {
  api.add_files('js/bootstrap-datetimepicker.min.js', 'client');
  api.add_files('css/bootstrap-datetimepicker.min.css', 'client');
});
