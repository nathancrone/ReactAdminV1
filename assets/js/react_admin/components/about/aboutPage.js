﻿"use strict";

var React = require('react');

var About = React.createClass({
    static: {
        willTransitionTo: function (transition, params, query, callback) {

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