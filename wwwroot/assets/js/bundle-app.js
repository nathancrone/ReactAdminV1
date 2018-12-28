(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$ = jQuery = require('jquery');
var React = require('react');

var Home = require('./components/homePage');
var About = require('./components/about/aboutPage');

var App = React.createClass({displayName: "App",
    render: function () {
        var Child;

        switch (this.props.route) {
            case 'about': Child = About; break;
            default: Child = Home;
        }

        return (
            React.createElement("div", null, 
                React.createElement(Child, null)
            )
        );
    }
});

function render() {
    var route = window.location.hash.substr(1);
    React.render(React.createElement(App, {route: route}), document.getElementById('app'));
}

window.addEventListener('hashchange', render);
render();

},{"./components/about/aboutPage":2,"./components/homePage":3,"jquery":"jquery","react":"react"}],2:[function(require,module,exports){
"use strict";

var React = require('react');

var About = React.createClass({displayName: "About",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, "About"), 
                React.createElement("p", null, "This is about page.")
            )
        );
    }
});

module.exports = About;

},{"react":"react"}],3:[function(require,module,exports){
"use strict";

var React = require('react');

var Home = React.createClass({displayName: "Home",
    render: function () {
        return (
            React.createElement("div", {className: "jumbotron"}, 
                React.createElement("h1", null, "Pluralsight Administration"), 
                React.createElement("p", null, "This is a test")
            )
        );
    }
});

module.exports = Home;

},{"react":"react"}]},{},[1]);
