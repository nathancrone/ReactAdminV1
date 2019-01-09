"use strict";

var React = require('react');

var About = React.createClass({
    statics: {
        willTransitionTo: function (transition, params, query, callback) {
            if (!confirm('Are you sure you want to read a page that\'s this boring?')) {
                transition.abort();
            }
            else {
                callback();
            }
        }, 
        willTransitionFrom: function (transition, component) {
            if (!confirm('Are you sure you want to leavea  page that\'s this exciting?')) {
                transition.abort();
            }
        }
    }, 
    render: function () {
        return (
            <div>
                <h1>About</h1>
                <p>This is about page.</p>
            </div>
        );
    }
});

module.exports = About;