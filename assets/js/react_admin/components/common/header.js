"use strict";

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = React.createClass({
    render: function () {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <Link to="app-admin" className="navbar-brand">
                        Admin App
                    </Link>
                    <ul className="nav navbar-nav">
                        <li><Link to="app-admin">Home</Link></li>
                        <li><Link to="authors">Authors</Link></li>
                        <li><Link to="about">About</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
});

module.exports = Header;