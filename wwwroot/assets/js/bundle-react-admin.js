(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

//This file is mocking a web API by hitting hard coded data.
var authors = require('./authorData').authors;
var _ = require('lodash');

//This would be performed on the server in a real app. Just stubbing in.
var _generateId = function (author) {
    return author.firstName.toLowerCase() + '-' + author.lastName.toLowerCase();
};

var _clone = function (item) {
    return JSON.parse(JSON.stringify(item)); //return cloned copy so that the item is passed by value instead of by reference
};

var AuthorApi = {
    getAllAuthors: function () {
        return _clone(authors);
    },

    getAuthorById: function (id) {
        var author = _.find(authors, { id: id });
        return _clone(author);
    },

    saveAuthor: function (author) {
        //pretend an ajax call to web api is made here
        console.log('Pretend this just saved the author to the DB via AJAX call...');

        if (author.id) {
            var existingAuthorIndex = _.indexOf(authors, _.find(authors, { id: author.id }));
            authors.splice(existingAuthorIndex, 1, author);
        } else {
            //Just simulating creation here.
            //The server would generate ids for new authors in a real app.
            //Cloning so copy returned is passed by value rather than by reference.
            author.id = _generateId(author);
            authors.push(author);
        }

        return _clone(author);
    },

    deleteAuthor: function (id) {
        console.log('Pretend this just deleted the author from the DB via an AJAX call...');
        _.remove(authors, { id: id });
    }
};

module.exports = AuthorApi;

},{"./authorData":2,"lodash":"lodash"}],2:[function(require,module,exports){
module.exports = {
    authors:
        [
            {
                id: 'cory-house',
                firstName: 'Cory',
                lastName: 'House'
            },
            {
                id: 'scott-allen',
                firstName: 'Scott',
                lastName: 'Allen'
            },
            {
                id: 'dan-wahlin',
                firstName: 'Dan',
                lastName: 'Wahlin'
            }
        ]
};

},{}],3:[function(require,module,exports){
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

},{"react":"react"}],4:[function(require,module,exports){
/* eslint-disable strict */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

//jquery
$ = jQuery = require('jquery');

var Header = require('./common/header');

var App = React.createClass({displayName: "App",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement(RouteHandler, null)
                )
            )
        );
    }
});

module.exports = App;

},{"./common/header":7,"jquery":"jquery","react":"react","react-router":"react-router"}],5:[function(require,module,exports){
"use strict";

var React = require('react');

var AuthorList = React.createClass({displayName: "AuthorList",
    propTypes: {
        authors: React.PropTypes.array.isRequired
    }, 
    render: function () {

        var createAuthorRow = function (author) {
            return (
                React.createElement("tr", {key: author.id}, 
                    React.createElement("td", null, React.createElement("a", {href: "/#authors/" + author.id}, author.id)), 
                    React.createElement("td", null, author.firstName, " ", author.lastName)
                )
            )
        };

        return (
            React.createElement("table", {className: "table"}, 
                React.createElement("thead", null, 
                    React.createElement("th", null, "ID"), 
                    React.createElement("th", null, "Name")
                ), 
                React.createElement("tbody", null, 
                    this.props.authors.map(createAuthorRow, this)
                )
            )
        );
    }
});

module.exports = AuthorList;

},{"react":"react"}],6:[function(require,module,exports){
"use strict";

var React = require('react');
var AuthorApi = require('../../api/authorApi');
var AuthorList = require('./authorList');

var AuthorPage = React.createClass({displayName: "AuthorPage",
    getInitialState: function () {
        return {
            authors: []
        }
    }, 
    componentDidMount: function () {
        if (this.isMounted()) {
            this.setState({ authors: AuthorApi.getAllAuthors() })
        }
    }, 
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, "Authors"), 
                React.createElement(AuthorList, {authors: this.state.authors})
            )
        );
    }
});

module.exports = AuthorPage;

},{"../../api/authorApi":1,"./authorList":5,"react":"react"}],7:[function(require,module,exports){
"use strict";

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = React.createClass({displayName: "Header",
    render: function () {
        return (
            React.createElement("nav", {className: "navbar navbar-default"}, 
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement(Link, {to: "app-admin", className: "navbar-brand"}, 
                        "Admin App"
                    ), 
                    React.createElement("ul", {className: "nav navbar-nav"}, 
                        React.createElement("li", null, React.createElement(Link, {to: "app-admin"}, "Home")), 
                        React.createElement("li", null, React.createElement(Link, {to: "authors"}, "Authors")), 
                        React.createElement("li", null, React.createElement(Link, {to: "about"}, "About"))
                    )
                )
            )
        );
    }
});

module.exports = Header;

},{"react":"react","react-router":"react-router"}],8:[function(require,module,exports){
"use strict";

var React = require('react');
var Link = require('react-router').Link;

var Home = React.createClass({displayName: "Home",
    render: function () {
        return (
            React.createElement("div", {className: "jumbotron"}, 
                React.createElement("h1", null, "Pluralsight Administration"), 
                React.createElement("p", null, "This is a test"), 
                React.createElement(Link, {to: "about", className: "btn btn-primary btn-lg"}, "Learn More")
            )
        );
    }
});

module.exports = Home;

},{"react":"react","react-router":"react-router"}],9:[function(require,module,exports){
"use strict";

var React = require('react');
var Link = require('react-router').Link;

var NotFoundPage = React.createClass({displayName: "NotFoundPage",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("h1", null, "Page Not Found"), 
                React.createElement("p", null, "Whoops! Sorry, there is nothing to see here."), 
                React.createElement("p", null, React.createElement(Link, {to: "app-admin"}, "Back to Home"))
            )
        );
    }
});

module.exports = NotFoundPage;

},{"react":"react","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

//react
var React = require('react');
var Router = require('react-router');

//routes
var routes = require('./routes');

Router.run(routes, function (Handler) {
    React.render(React.createElement(Handler, null), document.getElementById('app-admin'))
});

},{"./routes":11,"react":"react","react-router":"react-router"}],11:[function(require,module,exports){
"use strict";

var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Route = Router.Route;
var Redirect = Router.Redirect;

var routes = (
    React.createElement(Route, {name: "app-admin", path: "/", handler: require('./components/app')}, 
        React.createElement(DefaultRoute, {handler: require('./components/homePage')}), 
        React.createElement(Route, {name: "authors", handler: require('./components/authors/authorPage')}), 
        React.createElement(Redirect, {from: "awthurs", to: "authors"}), 
        React.createElement(Route, {name: "about", handler: require('./components/about/aboutPage')}), 
        React.createElement(Redirect, {from: "about-us", to: "about"}), 
        React.createElement(Redirect, {from: "about/*", to: "about"}), 
        React.createElement(NotFoundRoute, {handler: require('./components/notFoundPage')})
    )
);

module.exports = routes;

},{"./components/about/aboutPage":3,"./components/app":4,"./components/authors/authorPage":6,"./components/homePage":8,"./components/notFoundPage":9,"react":"react","react-router":"react-router"}]},{},[10]);
