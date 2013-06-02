Package.describe({
  summary: "A 5.5kb javascript date library for parsing, validating, manipulating, and formatting dates."
});

Package.on_use(function (api, where) {
  where = where || ['client', 'server'];
  api.add_files('moment.min.js', where);
});
