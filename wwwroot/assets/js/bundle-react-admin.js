(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var AuthorApi = require('../api/authorApi');
var ActionTypes = require('../constants/actionTypes');

var AuthorActions = {
    createAuthor: function (author) {
        var newAuthor = AuthorApi.saveAuthor(author);

        //go tell all the "stores" that an author was just created
        Dispatcher.dispatch({
            actionType: ActionTypes.CREATE_AUTHOR,
            author: newAuthor
        });
    }, 
    updateAuthor: function (author) {
        var updatedAuthor = AuthorApi.saveAuthor(author);

        //go tell all the "stores" that an author was just updated
        Dispatcher.dispatch({
            actionType: ActionTypes.UPDATE_AUTHOR,
            author: updatedAuthor
        });
    },
    deleteAuthor: function (id) {
        AuthorApi.deleteAuthor(id);

        //go tell all the "stores" that an author was just deleted
        Dispatcher.dispatch({
            actionType: ActionTypes.DELETE_AUTHOR,
            id: id
        });
    }
};

module.exports = AuthorActions;

},{"../api/authorApi":3,"../constants/actionTypes":15,"../dispatcher/appDispatcher":16}],2:[function(require,module,exports){
"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var AuthorApi = require('../api/authorApi');
var ActionTypes = require('../constants/actionTypes');

var InitializeActions = {
    initApp: function () {
        //go tell all the "stores" that an author was just created
        Dispatcher.dispatch({
            actionType: ActionTypes.INITIALIZE,
            initialData: {
                authors: AuthorApi.getAllAuthors()
            }
        });
    }
};

module.exports = InitializeActions;

},{"../api/authorApi":3,"../constants/actionTypes":15,"../dispatcher/appDispatcher":16}],3:[function(require,module,exports){
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

},{"./authorData":4,"lodash":"lodash"}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"react":"react"}],6:[function(require,module,exports){
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

},{"./common/header":11,"jquery":"jquery","react":"react","react-router":"react-router"}],7:[function(require,module,exports){
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

},{"../common/textInput":12,"react":"react"}],8:[function(require,module,exports){
"use strict";

var React = require('react');
var Link = require('react-router').Link;

var AuthorActions = require('../../actions/authorActions');
var toastr = require('toastr');


var AuthorList = React.createClass({displayName: "AuthorList",
    propTypes: {
        authors: React.PropTypes.array.isRequired
    }, 
    deleteAuthor: function (id, event) {
        event.preventDefault();
        AuthorActions.deleteAuthor(id);
        toastr.success('Author Deleted');
    }, 
    render: function () {

        var createAuthorRow = function (author) {
            return (
                React.createElement("tr", {key: author.id}, 
                    React.createElement("td", null, React.createElement("a", {href: "#", onClick: this.deleteAuthor.bind(this, author.id)}, "Delete")), 
                    React.createElement("td", null, React.createElement(Link, {to: "editAuthor", params: { id: author.id}}, author.id)), 
                    React.createElement("td", null, author.firstName, " ", author.lastName)
                )
            )
        };

        return (
            React.createElement("table", {className: "table"}, 
                React.createElement("thead", null, 
                    React.createElement("th", null, " "), 
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

},{"../../actions/authorActions":1,"react":"react","react-router":"react-router","toastr":24}],9:[function(require,module,exports){
"use strict";

var React = require('react');
var Router = require('react-router');
var Link = require('react-router').Link;
var AuthorList = require('./authorList');

var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');

var AuthorPage = React.createClass({displayName: "AuthorPage",
    getInitialState: function () {
        return {
            authors: AuthorStore.getAllAuthors()
        };
    },
    //componentWillMount: function () {
    //    AuthorStore.addChangeListener(this._onChange);
    //}, 
    //componentWillUnmount: function () {
    //    AuthorStore.removeChangeListener(this._onChange);
    //}, 
    //_onChange: function () {
    //    this.setState({ authors: AuthorStore.getAllAuthors() });
    //}, 
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

},{"../../actions/authorActions":1,"../../stores/authorStore":19,"./authorList":8,"react":"react","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

var React = require('react');
var Router = require('react-router');
var toastr = require('toastr');
var AuthorForm = require('./authorForm');

var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');

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
            this.setState({author: AuthorStore.getAuthorById(authorId)});
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

        if (this.state.author.id) {
            AuthorActions.updateAuthor(this.state.author);
        }
        else {
            AuthorActions.createAuthor(this.state.author);
        }

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

},{"../../actions/authorActions":1,"../../stores/authorStore":19,"./authorForm":7,"react":"react","react-router":"react-router","toastr":24}],11:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router"}],12:[function(require,module,exports){
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

},{"react":"react"}],13:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router"}],14:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router"}],15:[function(require,module,exports){
"use strict";

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    INITIALIZE: null, 
    CREATE_AUTHOR: null, 
    UPDATE_AUTHOR: null, 
    DELETE_AUTHOR: null
});

},{"react/lib/keyMirror":23}],16:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();
},{"flux":"flux"}],17:[function(require,module,exports){
"use strict";

//react
var React = require('react');
var Router = require('react-router');

//routes
var routes = require('./routes');

var InitializeActions = require('./actions/initializeActions');

InitializeActions.initApp();

Router.run(routes, function (Handler) {
    React.render(React.createElement(Handler, null), document.getElementById('app-admin'))
});

},{"./actions/initializeActions":2,"./routes":18,"react":"react","react-router":"react-router"}],18:[function(require,module,exports){
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

},{"./components/about/aboutPage":5,"./components/app":6,"./components/authors/authorPage":9,"./components/authors/manageAuthorPage":10,"./components/homePage":13,"./components/notFoundPage":14,"react":"react","react-router":"react-router"}],19:[function(require,module,exports){
"use strict";

var _ = require('lodash');
var Assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

var CHANGE_EVENT = 'change';

var _authors = [];

var AuthorStore = Assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    }, 
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }, 
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    }, 
    getAllAuthors: function () {
        return _authors;
    },
    getAuthorById: function (id) {
        return _.find(_authors, {id: id});
    }
});

Dispatcher.register(function (action) {
    switch (action.actionType) {
        case ActionTypes.INITIALIZE:
            _authors = action.initialData.authors;
            AuthorStore.emitChange();
            break;
        case ActionTypes.CREATE_AUTHOR:
            _authors.push(action.author);
            AuthorStore.emitChange();
            break;
        case ActionTypes.UPDATE_AUTHOR:
            var existingAuthor = _.find(_authors, {id: action.author.id});
            var existingAuthorIndex = _.indexOf(_authors, existingAuthor);
            _authors.splice(existingAuthorIndex, 1, action.author);
            AuthorStore.emitChange();
            break;
        case ActionTypes.DELETE_AUTHOR:
            _.remove(_authors, function (author) {
                return action.id === author.id
            });
            AuthorStore.emitChange();
            break;
        default: 
            //no op
    }
});

module.exports = AuthorStore;

},{"../constants/actionTypes":15,"../dispatcher/appDispatcher":16,"events":20,"lodash":"lodash","object-assign":"object-assign"}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],21:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":21}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

'use strict';

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require('_process'))
},{"./invariant":22,"_process":21}],24:[function(require,module,exports){
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

},{"jquery":"jquery"}]},{},[17]);
