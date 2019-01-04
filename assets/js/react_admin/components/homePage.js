"use strict";

var React = require('react');
var Link = require('react-router').Link;

var Home = React.createClass({
    render: function () {
        return (
            <div className="jumbotron">
                <h1>Pluralsight Administration</h1>
                <p>This is a test</p>
                <Link to="about" className="btn btn-primary btn-lg">Learn More</Link>
            </div>
        );
    }
});

module.exports = Home;