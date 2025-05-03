"use strict";

var _app = _interopRequireDefault(require("./app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = process.env.PORT || 4000;

_app["default"].listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});