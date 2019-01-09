"use strict";

var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Route = Router.Route;
var Redirect = Router.Redirect;

var routes = (
    <Route name="app-admin" path="/" handler={require('./components/app')}>
        <DefaultRoute handler={require('./components/homePage')} />
        <Route name="authors" handler={require('./components/authors/authorPage')} />
        <Route name="addAuthor" path="author" handler={require('./components/authors/manageAuthorPage')} />
        <Route name="editAuthor" path="author/:id" handler={require('./components/authors/manageAuthorPage')} />
        <Redirect to="authors" from="awthurs" />
        <Route name="about" handler={require('./components/about/aboutPage')} />
        <Redirect to="about" from="about-us" />
        <Redirect to="about" from="about/*" />
        <NotFoundRoute handler={require('./components/notFoundPage')} />
    </Route>
);

module.exports = routes;