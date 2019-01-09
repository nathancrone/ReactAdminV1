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

},{"./common/header":9,"jquery":"jquery","react":"react","react-router":"react-router"}],5:[function(require,module,exports){
"use strict";

var React = require('react');
var Input = require('../common/textInput');

var AuthorForm = React.createClass({displayName: "AuthorForm",
    propTypes: {
        author: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired,
        errors: React.PropTypes.object
    },
    render: function () {
        return (
            React.createElement("form", null, 
                React.createElement("h1", null, "Manage Author"), 
                React.createElement(Input, {
                    name: "firstName", 
                    label: "First Name", 
                    value: this.props.author.firstName, 
                    onChange: this.props.onChange, 
                    error: this.props.errors.firstName}), 
                React.createElement(Input, {
                    name: "lastName", 
                    label: "Last Name", 
                    value: this.props.author.lastName, 
                    onChange: this.props.onChange, 
                    error: this.props.errors.lastName}), 
                React.createElement("input", {type: "submit", value: "Save", className: "btn btn-default", onClick: this.props.onSave})
            )
        );
    }
});

module.exports = AuthorForm;

},{"../common/textInput":10,"react":"react"}],6:[function(require,module,exports){
"use strict";

var React = require('react');
var Link = require('react-router').Link;

var AuthorList = React.createClass({displayName: "AuthorList",
    propTypes: {
        authors: React.PropTypes.array.isRequired
    }, 
    render: function () {

        var createAuthorRow = function (author) {
            return (
                React.createElement("tr", {key: author.id}, 
                    React.createElement("td", null, React.createElement(Link, {to: "editAuthor", params: { id: author.id}}, author.id)), 
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

},{"react":"react","react-router":"react-router"}],7:[function(require,module,exports){
"use strict";

var React = require('react');
var Router = require('react-router');
var Link = require('react-router').Link;
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
                React.createElement(Link, {to: "addAuthor", className: "btn btn-default"}, "Add Author"), 
                React.createElement(AuthorList, {authors: this.state.authors})
            )
        );
    }
});

module.exports = AuthorPage;

},{"../../api/authorApi":1,"./authorList":6,"react":"react","react-router":"react-router"}],8:[function(require,module,exports){
"use strict";

var React = require('react');
var Router = require('react-router');
var toastr = require('toastr');
var AuthorForm = require('./authorForm');
var AuthorApi = require('../../api/authorApi');

var ManageAuthorPage = React.createClass({displayName: "ManageAuthorPage",
    mixins: [
        Router.Navigation
    ], 
    statics: {
        willTransitionFrom: function (transition, component) {
            if (component.state.dirty && !confirm('Leave without saving?')) {
                transition.abort();
            }
        }
    }, 
    getInitialState: function () {
        return {
            author: { id: '', firstName: '', lastName: '' }, 
            errors: {}, 
            dirty: false
        };
    }, 
    componentWillMount: function () {
        var authorId = this.props.params.id;
        if (authorId) {
            this.setState({author: AuthorApi.getAuthorById(authorId)});
        }
    }, 
    setAuthorState: function (event) {
        this.setState({dirty: true});
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        return this.setState({author: this.state.author});
    }, 
    authorFormIsValid: function () {
        var formIsValid = true;
        this.state.errors = {};
        if (this.state.author.firstName.length < 3) {
            this.state.errors.firstName = "First name must be at least 3 characters.";
            formIsValid = false;
        }
        if (this.state.author.lastName.length < 3) {
            this.state.errors.lastName = "Last name must be at least 3 characters.";
            formIsValid = false;
        }
        this.setState({ errors: this.state.errors });
        return formIsValid;
    }, 
    saveAuthor: function (event) {
        event.preventDefault();

        if (!this.authorFormIsValid()) {
            return;
        }

        AuthorApi.saveAuthor(this.state.author);
        this.setState({ dirty: false });
        toastr.success('Author saved.');
        this.transitionTo('authors');
    }, 
    render: function () {
        return (
            React.createElement(AuthorForm, {
                author: this.state.author, 
                onChange: this.setAuthorState, 
                onSave: this.saveAuthor, 
                errors: this.state.errors})
        );
    }
});

module.exports = ManageAuthorPage;

},{"../../api/authorApi":1,"./authorForm":5,"react":"react","react-router":"react-router","toastr":15}],9:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

var React = require('react');

var Input = React.createClass({displayName: "Input",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        placeholder: React.PropTypes.string,
        value: React.PropTypes.string,
        error: React.PropTypes.string
    },

    render: function () {
        var wrapperClass = 'form-group';
        if (this.props.error && this.props.error.length > 0) {
            wrapperClass += " " + 'has-error';
        }

        return (
            React.createElement("div", {className: wrapperClass}, 
                React.createElement("label", {htmlFor: this.props.name}, this.props.label), 
                React.createElement("div", {className: "field"}, 
                    React.createElement("input", {type: "text", 
                        name: this.props.name, 
                        className: "form-control", 
                        placeholder: this.props.placeholder, 
                        ref: this.props.name, 
                        value: this.props.value, 
                        onChange: this.props.onChange}), 
                    React.createElement("div", {className: "input"}, this.props.error)
                )
            )
        );
    }
});

module.exports = Input;

},{"react":"react"}],11:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router"}],12:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router"}],13:[function(require,module,exports){
"use strict";

//react
var React = require('react');
var Router = require('react-router');

//routes
var routes = require('./routes');

Router.run(routes, function (Handler) {
    React.render(React.createElement(Handler, null), document.getElementById('app-admin'))
});

},{"./routes":14,"react":"react","react-router":"react-router"}],14:[function(require,module,exports){
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
        React.createElement(Route, {name: "addAuthor", path: "author", handler: require('./components/authors/manageAuthorPage')}), 
        React.createElement(Route, {name: "editAuthor", path: "author/:id", handler: require('./components/authors/manageAuthorPage')}), 
        React.createElement(Redirect, {to: "authors", from: "awthurs"}), 
        React.createElement(Route, {name: "about", handler: require('./components/about/aboutPage')}), 
        React.createElement(Redirect, {to: "about", from: "about-us"}), 
        React.createElement(Redirect, {to: "about", from: "about/*"}), 
        React.createElement(NotFoundRoute, {handler: require('./components/notFoundPage')})
    )
);

module.exports = routes;

},{"./components/about/aboutPage":3,"./components/app":4,"./components/authors/authorPage":7,"./components/authors/manageAuthorPage":8,"./components/homePage":11,"./components/notFoundPage":12,"react":"react","react-router":"react-router"}],15:[function(require,module,exports){
/*
 * Toastr
 * Copyright 2012-2015
 * Authors: John Papa, Hans Fjällemark, and Tim Ferrell.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * ARIA Support: Greta Krafsig
 *
 * Project: https://github.com/CodeSeven/toastr
 */
/* global define */
(function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var $container;
            var listener;
            var toastId = 0;
            var toastType = {
                error: 'error',
                info: 'info',
                success: 'success',
                warning: 'warning'
            };

            var toastr = {
                clear: clear,
                remove: remove,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                subscribe: subscribe,
                success: success,
                version: '2.1.4',
                warning: warning
            };

            var previousToast;

            return toastr;

            ////////////////

            function error(message, title, optionsOverride) {
                return notify({
                    type: toastType.error,
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function getContainer(options, create) {
                if (!options) { options = getOptions(); }
                $container = $('#' + options.containerId);
                if ($container.length) {
                    return $container;
                }
                if (create) {
                    $container = createContainer(options);
                }
                return $container;
            }

            function info(message, title, optionsOverride) {
                return notify({
                    type: toastType.info,
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function subscribe(callback) {
                listener = callback;
            }

            function success(message, title, optionsOverride) {
                return notify({
                    type: toastType.success,
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function warning(message, title, optionsOverride) {
                return notify({
                    type: toastType.warning,
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function clear($toastElement, clearOptions) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if (!clearToast($toastElement, options, clearOptions)) {
                    clearContainer(options);
                }
            }

            function remove($toastElement) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if ($toastElement && $(':focus', $toastElement).length === 0) {
                    removeToast($toastElement);
                    return;
                }
                if ($container.children().length) {
                    $container.remove();
                }
            }

            // internal functions

            function clearContainer (options) {
                var toastsToClear = $container.children();
                for (var i = toastsToClear.length - 1; i >= 0; i--) {
                    clearToast($(toastsToClear[i]), options);
                }
            }

            function clearToast ($toastElement, options, clearOptions) {
                var force = clearOptions && clearOptions.force ? clearOptions.force : false;
                if ($toastElement && (force || $(':focus', $toastElement).length === 0)) {
                    $toastElement[options.hideMethod]({
                        duration: options.hideDuration,
                        easing: options.hideEasing,
                        complete: function () { removeToast($toastElement); }
                    });
                    return true;
                }
                return false;
            }

            function createContainer(options) {
                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass);

                $container.appendTo($(options.target));
                return $container;
            }

            function getDefaults() {
                return {
                    tapToDismiss: true,
                    toastClass: 'toast',
                    containerId: 'toast-container',
                    debug: false,

                    showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
                    showDuration: 300,
                    showEasing: 'swing', //swing and linear are built into jQuery
                    onShown: undefined,
                    hideMethod: 'fadeOut',
                    hideDuration: 1000,
                    hideEasing: 'swing',
                    onHidden: undefined,
                    closeMethod: false,
                    closeDuration: false,
                    closeEasing: false,
                    closeOnHover: true,

                    extendedTimeOut: 1000,
                    iconClasses: {
                        error: 'toast-error',
                        info: 'toast-info',
                        success: 'toast-success',
                        warning: 'toast-warning'
                    },
                    iconClass: 'toast-info',
                    positionClass: 'toast-top-right',
                    timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
                    titleClass: 'toast-title',
                    messageClass: 'toast-message',
                    escapeHtml: false,
                    target: 'body',
                    closeHtml: '<button type="button">&times;</button>',
                    closeClass: 'toast-close-button',
                    newestOnTop: true,
                    preventDuplicates: false,
                    progressBar: false,
                    progressClass: 'toast-progress',
                    rtl: false
                };
            }

            function publish(args) {
                if (!listener) { return; }
                listener(args);
            }

            function notify(map) {
                var options = getOptions();
                var iconClass = map.iconClass || options.iconClass;

                if (typeof (map.optionsOverride) !== 'undefined') {
                    options = $.extend(options, map.optionsOverride);
                    iconClass = map.optionsOverride.iconClass || iconClass;
                }

                if (shouldExit(options, map)) { return; }

                toastId++;

                $container = getContainer(options, true);

                var intervalId = null;
                var $toastElement = $('<div/>');
                var $titleElement = $('<div/>');
                var $messageElement = $('<div/>');
                var $progressElement = $('<div/>');
                var $closeElement = $(options.closeHtml);
                var progressBar = {
                    intervalId: null,
                    hideEta: null,
                    maxHideTime: null
                };
                var response = {
                    toastId: toastId,
                    state: 'visible',
                    startTime: new Date(),
                    options: options,
                    map: map
                };

                personalizeToast();

                displayToast();

                handleEvents();

                publish(response);

                if (options.debug && console) {
                    console.log(response);
                }

                return $toastElement;

                function escapeHtml(source) {
                    if (source == null) {
                        source = '';
                    }

                    return source
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }

                function personalizeToast() {
                    setIcon();
                    setTitle();
                    setMessage();
                    setCloseButton();
                    setProgressBar();
                    setRTL();
                    setSequence();
                    setAria();
                }

                function setAria() {
                    var ariaValue = '';
                    switch (map.iconClass) {
                        case 'toast-success':
                        case 'toast-info':
                            ariaValue =  'polite';
                            break;
                        default:
                            ariaValue = 'assertive';
                    }
                    $toastElement.attr('aria-live', ariaValue);
                }

                function handleEvents() {
                    if (options.closeOnHover) {
                        $toastElement.hover(stickAround, delayedHideToast);
                    }

                    if (!options.onclick && options.tapToDismiss) {
                        $toastElement.click(hideToast);
                    }

                    if (options.closeButton && $closeElement) {
                        $closeElement.click(function (event) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
                                event.cancelBubble = true;
                            }

                            if (options.onCloseClick) {
                                options.onCloseClick(event);
                            }

                            hideToast(true);
                        });
                    }

                    if (options.onclick) {
                        $toastElement.click(function (event) {
                            options.onclick(event);
                            hideToast();
                        });
                    }
                }

                function displayToast() {
                    $toastElement.hide();

                    $toastElement[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing, complete: options.onShown}
                    );

                    if (options.timeOut > 0) {
                        intervalId = setTimeout(hideToast, options.timeOut);
                        progressBar.maxHideTime = parseFloat(options.timeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                        if (options.progressBar) {
                            progressBar.intervalId = setInterval(updateProgress, 10);
                        }
                    }
                }

                function setIcon() {
                    if (map.iconClass) {
                        $toastElement.addClass(options.toastClass).addClass(iconClass);
                    }
                }

                function setSequence() {
                    if (options.newestOnTop) {
                        $container.prepend($toastElement);
                    } else {
                        $container.append($toastElement);
                    }
                }

                function setTitle() {
                    if (map.title) {
                        var suffix = map.title;
                        if (options.escapeHtml) {
                            suffix = escapeHtml(map.title);
                        }
                        $titleElement.append(suffix).addClass(options.titleClass);
                        $toastElement.append($titleElement);
                    }
                }

                function setMessage() {
                    if (map.message) {
                        var suffix = map.message;
                        if (options.escapeHtml) {
                            suffix = escapeHtml(map.message);
                        }
                        $messageElement.append(suffix).addClass(options.messageClass);
                        $toastElement.append($messageElement);
                    }
                }

                function setCloseButton() {
                    if (options.closeButton) {
                        $closeElement.addClass(options.closeClass).attr('role', 'button');
                        $toastElement.prepend($closeElement);
                    }
                }

                function setProgressBar() {
                    if (options.progressBar) {
                        $progressElement.addClass(options.progressClass);
                        $toastElement.prepend($progressElement);
                    }
                }

                function setRTL() {
                    if (options.rtl) {
                        $toastElement.addClass('rtl');
                    }
                }

                function shouldExit(options, map) {
                    if (options.preventDuplicates) {
                        if (map.message === previousToast) {
                            return true;
                        } else {
                            previousToast = map.message;
                        }
                    }
                    return false;
                }

                function hideToast(override) {
                    var method = override && options.closeMethod !== false ? options.closeMethod : options.hideMethod;
                    var duration = override && options.closeDuration !== false ?
                        options.closeDuration : options.hideDuration;
                    var easing = override && options.closeEasing !== false ? options.closeEasing : options.hideEasing;
                    if ($(':focus', $toastElement).length && !override) {
                        return;
                    }
                    clearTimeout(progressBar.intervalId);
                    return $toastElement[method]({
                        duration: duration,
                        easing: easing,
                        complete: function () {
                            removeToast($toastElement);
                            clearTimeout(intervalId);
                            if (options.onHidden && response.state !== 'hidden') {
                                options.onHidden();
                            }
                            response.state = 'hidden';
                            response.endTime = new Date();
                            publish(response);
                        }
                    });
                }

                function delayedHideToast() {
                    if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                        intervalId = setTimeout(hideToast, options.extendedTimeOut);
                        progressBar.maxHideTime = parseFloat(options.extendedTimeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                    }
                }

                function stickAround() {
                    clearTimeout(intervalId);
                    progressBar.hideEta = 0;
                    $toastElement.stop(true, true)[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing}
                    );
                }

                function updateProgress() {
                    var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100;
                    $progressElement.width(percentage + '%');
                }
            }

            function getOptions() {
                return $.extend({}, getDefaults(), toastr.options);
            }

            function removeToast($toastElement) {
                if (!$container) { $container = getContainer(); }
                if ($toastElement.is(':visible')) {
                    return;
                }
                $toastElement.remove();
                $toastElement = null;
                if ($container.children().length === 0) {
                    $container.remove();
                    previousToast = undefined;
                }
            }

        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    } else {
        window.toastr = factory(window.jQuery);
    }
}));

},{"jquery":"jquery"}]},{},[13]);
