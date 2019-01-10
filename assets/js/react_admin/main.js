"use strict";

//react
var React = require('react');
var Router = require('react-router');

//routes
var routes = require('./routes');

var InitializeActions = require('./actions/initializeActions');

InitializeActions.initApp();

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById('app-admin'))
});