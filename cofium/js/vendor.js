(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor"],{

/***/ "./node_modules/@googlemaps/js-api-loader/dist/index.esm.js":
/*!******************************************************************!*\
  !*** ./node_modules/@googlemaps/js-api-loader/dist/index.esm.js ***!
  \******************************************************************/
/*! exports provided: DEFAULT_ID, Loader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_ID", function() { return DEFAULT_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Loader", function() { return Loader; });
// do not edit .js files directly - edit src/index.jst



var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 *      Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ID = "__googleMapsScriptId";
/**
 * [[Loader]] makes it easier to add Google Maps JavaScript API to your application
 * dynamically using
 * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * It works by dynamically creating and appending a script node to the the
 * document head and wrapping the callback function so as to return a promise.
 *
 * ```
 * const loader = new Loader({
 *   apiKey: "",
 *   version: "weekly",
 *   libraries: ["places"]
 * });
 *
 * loader.load().then(() => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */
class Loader {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    constructor({ apiKey, channel, client, id = DEFAULT_ID, libraries = [], language, region, version, mapIds, nonce, retries = 3, url = "https://maps.googleapis.com/maps/api/js", }) {
        this.CALLBACK = "__googleMapsCallback";
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.version = version;
        this.apiKey = apiKey;
        this.channel = channel;
        this.client = client;
        this.id = id || DEFAULT_ID; // Do not allow empty string
        this.libraries = libraries;
        this.language = language;
        this.region = region;
        this.mapIds = mapIds;
        this.nonce = nonce;
        this.retries = retries;
        this.url = url;
        if (Loader.instance) {
            if (!fastDeepEqual(this.options, Loader.instance.options)) {
                throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
            }
            return Loader.instance;
        }
        Loader.instance = this;
    }
    get options() {
        return {
            version: this.version,
            apiKey: this.apiKey,
            channel: this.channel,
            client: this.client,
            id: this.id,
            libraries: this.libraries,
            language: this.language,
            region: this.region,
            mapIds: this.mapIds,
            nonce: this.nonce,
            url: this.url,
        };
    }
    /**
     * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
     *
     * @ignore
     */
    createUrl() {
        let url = this.url;
        url += `?callback=${this.CALLBACK}`;
        if (this.apiKey) {
            url += `&key=${this.apiKey}`;
        }
        if (this.channel) {
            url += `&channel=${this.channel}`;
        }
        if (this.client) {
            url += `&client=${this.client}`;
        }
        if (this.libraries.length > 0) {
            url += `&libraries=${this.libraries.join(",")}`;
        }
        if (this.language) {
            url += `&language=${this.language}`;
        }
        if (this.region) {
            url += `&region=${this.region}`;
        }
        if (this.version) {
            url += `&v=${this.version}`;
        }
        if (this.mapIds) {
            url += `&map_ids=${this.mapIds.join(",")}`;
        }
        return url;
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     */
    load() {
        return this.loadPromise();
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     */
    loadPromise() {
        return new Promise((resolve, reject) => {
            this.loadCallback((err) => {
                if (!err) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    /**
     * Load the Google Maps JavaScript API script with a callback.
     */
    loadCallback(fn) {
        this.callbacks.push(fn);
        this.execute();
    }
    /**
     * Set the script on document.
     */
    setScript() {
        if (document.getElementById(this.id)) {
            // TODO wrap onerror callback for cases where the script was loaded elsewhere
            this.callback();
            return;
        }
        const url = this.createUrl();
        const script = document.createElement("script");
        script.id = this.id;
        script.type = "text/javascript";
        script.src = url;
        script.onerror = this.loadErrorCallback.bind(this);
        script.defer = true;
        script.async = true;
        if (this.nonce) {
            script.nonce = this.nonce;
        }
        document.head.appendChild(script);
    }
    deleteScript() {
        const script = document.getElementById(this.id);
        if (script) {
            script.remove();
        }
    }
    resetIfRetryingFailed() {
        const possibleAttempts = this.retries + 1;
        if (this.done && !this.loading && this.errors.length >= possibleAttempts) {
            this.deleteScript();
            this.done = false;
            this.loading = false;
            this.errors = [];
            this.onerrorEvent = null;
        }
    }
    loadErrorCallback(e) {
        this.errors.push(e);
        if (this.errors.length <= this.retries) {
            const delay = this.errors.length * Math.pow(2, this.errors.length);
            console.log(`Failed to load Google Maps script, retrying in ${delay} ms.`);
            setTimeout(() => {
                this.deleteScript();
                this.setScript();
            }, delay);
        }
        else {
            this.onerrorEvent = e;
            this.callback();
        }
    }
    setCallback() {
        window.__googleMapsCallback = this.callback.bind(this);
    }
    callback() {
        this.done = true;
        this.loading = false;
        this.callbacks.forEach((cb) => {
            cb(this.onerrorEvent);
        });
        this.callbacks = [];
    }
    execute() {
        if (window.google && window.google.maps && window.google.maps.version) {
            console.warn("Google Maps already loaded outside @googlemaps/js-api-loader." +
                "This may result in undesirable behavior as options and script parameters may not match.");
            this.callback();
        }
        this.resetIfRetryingFailed();
        if (this.done) {
            this.callback();
        }
        else {
            if (this.loading) ;
            else {
                this.loading = true;
                this.setCallback();
                this.setScript();
            }
        }
    }
}


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/dom7/dom7.esm.js":
/*!***************************************!*\
  !*** ./node_modules/dom7/dom7.esm.js ***!
  \***************************************/
/*! exports provided: default, $, add, addClass, animate, animationEnd, append, appendTo, attr, blur, change, children, click, closest, css, data, dataset, detach, each, empty, eq, filter, find, focus, focusin, focusout, hasClass, height, hide, html, index, insertAfter, insertBefore, is, keydown, keypress, keyup, mousedown, mouseenter, mouseleave, mousemove, mouseout, mouseover, mouseup, next, nextAll, off, offset, on, once, outerHeight, outerWidth, parent, parents, prepend, prependTo, prev, prevAll, prop, remove, removeAttr, removeClass, removeData, resize, scroll, scrollLeft, scrollTo, scrollTop, show, siblings, stop, styles, submit, text, toggleClass, touchend, touchmove, touchstart, transform, transition, transitionEnd, trigger, val, value, width */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$", function() { return $; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addClass", function() { return addClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animate", function() { return animate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animationEnd", function() { return animationEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "append", function() { return append; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendTo", function() { return appendTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attr", function() { return attr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blur", function() { return blur; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "change", function() { return change; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "children", function() { return children; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "click", function() { return click; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closest", function() { return closest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css", function() { return css; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "data", function() { return data; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dataset", function() { return dataset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detach", function() { return detach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "each", function() { return each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return empty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eq", function() { return eq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return filter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focus", function() { return focus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focusin", function() { return focusin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focusout", function() { return focusout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasClass", function() { return hasClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "height", function() { return height; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hide", function() { return hide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "html", function() { return html; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "index", function() { return index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertAfter", function() { return insertAfter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertBefore", function() { return insertBefore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "is", function() { return is; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keydown", function() { return keydown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keypress", function() { return keypress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyup", function() { return keyup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mousedown", function() { return mousedown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseenter", function() { return mouseenter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseleave", function() { return mouseleave; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mousemove", function() { return mousemove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseout", function() { return mouseout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseover", function() { return mouseover; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseup", function() { return mouseup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "next", function() { return next; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nextAll", function() { return nextAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "off", function() { return off; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "offset", function() { return offset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "once", function() { return once; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outerHeight", function() { return outerHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outerWidth", function() { return outerWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parent", function() { return parent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parents", function() { return parents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prepend", function() { return prepend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prependTo", function() { return prependTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prev", function() { return prev; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prevAll", function() { return prevAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prop", function() { return prop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeAttr", function() { return removeAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeClass", function() { return removeClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeData", function() { return removeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resize", function() { return resize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scroll", function() { return scroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollLeft", function() { return scrollLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollTo", function() { return scrollTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollTop", function() { return scrollTop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "show", function() { return show; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "siblings", function() { return siblings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stop", function() { return stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "styles", function() { return styles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "submit", function() { return submit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "text", function() { return text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleClass", function() { return toggleClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "touchend", function() { return touchend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "touchmove", function() { return touchmove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "touchstart", function() { return touchstart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transform", function() { return transform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transition", function() { return transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transitionEnd", function() { return transitionEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trigger", function() { return trigger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "val", function() { return val; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "value", function() { return value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "width", function() { return width; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/**
 * Dom7 3.0.0
 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
 * https://framework7.io/docs/dom7.html
 *
 * Copyright 2020, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: November 9, 2020
 */


function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/* eslint-disable no-proto */
function makeReactive(obj) {
  var proto = obj.__proto__;
  Object.defineProperty(obj, '__proto__', {
    get: function get() {
      return proto;
    },
    set: function set(value) {
      proto.__proto__ = value;
    }
  });
}

var Dom7 = /*#__PURE__*/function (_Array) {
  _inheritsLoose(Dom7, _Array);

  function Dom7(items) {
    var _this;

    _this = _Array.call.apply(_Array, [this].concat(items)) || this;
    makeReactive(_assertThisInitialized(_this));
    return _this;
  }

  return Dom7;
}( /*#__PURE__*/_wrapNativeSuper(Array));

function arrayFlat(arr) {
  if (arr === void 0) {
    arr = [];
  }

  var res = [];
  arr.forEach(function (el) {
    if (Array.isArray(el)) {
      res.push.apply(res, arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  var uniqueArray = [];

  for (var i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
  }

  return uniqueArray;
}
function toCamelCase(string) {
  return string.toLowerCase().replace(/-(.)/g, function (match, group) {
    return group.toUpperCase();
  });
}

function qsa(selector, context) {
  if (typeof selector !== 'string') {
    return [selector];
  }

  var a = [];
  var res = context.querySelectorAll(selector);

  for (var i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }

  return a;
}

function $(selector, context) {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var arr = [];

  if (!context && selector instanceof Dom7) {
    return selector;
  }

  if (!selector) {
    return new Dom7(arr);
  }

  if (typeof selector === 'string') {
    var html = selector.trim();

    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
      var toCreate = 'div';
      if (html.indexOf('<li') === 0) toCreate = 'ul';
      if (html.indexOf('<tr') === 0) toCreate = 'tbody';
      if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
      if (html.indexOf('<tbody') === 0) toCreate = 'table';
      if (html.indexOf('<option') === 0) toCreate = 'select';
      var tempParent = document.createElement(toCreate);
      tempParent.innerHTML = html;

      for (var i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document);
    } // arr = qsa(selector, document);

  } else if (selector.nodeType || selector === window || selector === document) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7) return selector;
    arr = selector;
  }

  return new Dom7(arrayUnique(arr));
}

$.fn = Dom7.prototype;

function addClass() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }

  var classNames = arrayFlat(classes.map(function (c) {
    return c.split(' ');
  }));
  this.forEach(function (el) {
    var _el$classList;

    (_el$classList = el.classList).add.apply(_el$classList, classNames);
  });
  return this;
}

function removeClass() {
  for (var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    classes[_key2] = arguments[_key2];
  }

  var classNames = arrayFlat(classes.map(function (c) {
    return c.split(' ');
  }));
  this.forEach(function (el) {
    var _el$classList2;

    (_el$classList2 = el.classList).remove.apply(_el$classList2, classNames);
  });
  return this;
}

function toggleClass() {
  for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    classes[_key3] = arguments[_key3];
  }

  var classNames = arrayFlat(classes.map(function (c) {
    return c.split(' ');
  }));
  this.forEach(function (el) {
    classNames.forEach(function (className) {
      el.classList.toggle(className);
    });
  });
}

function hasClass() {
  for (var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    classes[_key4] = arguments[_key4];
  }

  var classNames = arrayFlat(classes.map(function (c) {
    return c.split(' ');
  }));
  return arrayFilter(this, function (el) {
    return classNames.filter(function (className) {
      return el.classList.contains(className);
    }).length > 0;
  }).length > 0;
}

function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === 'string') {
    // Get attr
    if (this[0]) return this[0].getAttribute(attrs);
    return undefined;
  } // Set attrs


  for (var i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      // String
      this[i].setAttribute(attrs, value);
    } else {
      // Object
      for (var attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }

  return this;
}

function removeAttr(attr) {
  for (var i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr);
  }

  return this;
}

function prop(props, value) {
  if (arguments.length === 1 && typeof props === 'string') {
    // Get prop
    if (this[0]) return this[0][props];
  } else {
    // Set props
    for (var i = 0; i < this.length; i += 1) {
      if (arguments.length === 2) {
        // String
        this[i][props] = value;
      } else {
        // Object
        for (var propName in props) {
          this[i][propName] = props[propName];
        }
      }
    }

    return this;
  }

  return this;
}

function data(key, value) {
  var el;

  if (typeof value === 'undefined') {
    el = this[0];
    if (!el) return undefined; // Get value

    if (el.dom7ElementDataStorage && key in el.dom7ElementDataStorage) {
      return el.dom7ElementDataStorage[key];
    }

    var dataKey = el.getAttribute("data-" + key);

    if (dataKey) {
      return dataKey;
    }

    return undefined;
  } // Set value


  for (var i = 0; i < this.length; i += 1) {
    el = this[i];
    if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
    el.dom7ElementDataStorage[key] = value;
  }

  return this;
}

function removeData(key) {
  for (var i = 0; i < this.length; i += 1) {
    var el = this[i];

    if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
      el.dom7ElementDataStorage[key] = null;
      delete el.dom7ElementDataStorage[key];
    }
  }
}

function dataset() {
  var el = this[0];
  if (!el) return undefined;
  var dataset = {}; // eslint-disable-line

  if (el.dataset) {
    for (var dataKey in el.dataset) {
      dataset[dataKey] = el.dataset[dataKey];
    }
  } else {
    for (var i = 0; i < el.attributes.length; i += 1) {
      var _attr = el.attributes[i];

      if (_attr.name.indexOf('data-') >= 0) {
        dataset[toCamelCase(_attr.name.split('data-')[1])] = _attr.value;
      }
    }
  }

  for (var key in dataset) {
    if (dataset[key] === 'false') dataset[key] = false;else if (dataset[key] === 'true') dataset[key] = true;else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] *= 1;
  }

  return dataset;
}

function val(value) {
  if (typeof value === 'undefined') {
    // get value
    var el = this[0];
    if (!el) return undefined;

    if (el.multiple && el.nodeName.toLowerCase() === 'select') {
      var values = [];

      for (var i = 0; i < el.selectedOptions.length; i += 1) {
        values.push(el.selectedOptions[i].value);
      }

      return values;
    }

    return el.value;
  } // set value


  for (var _i = 0; _i < this.length; _i += 1) {
    var _el = this[_i];

    if (Array.isArray(value) && _el.multiple && _el.nodeName.toLowerCase() === 'select') {
      for (var j = 0; j < _el.options.length; j += 1) {
        _el.options[j].selected = value.indexOf(_el.options[j].value) >= 0;
      }
    } else {
      _el.value = value;
    }
  }

  return this;
}

function value(value) {
  return this.val(value);
}

function transform(transform) {
  for (var i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform;
  }

  return this;
}

function transition(duration) {
  for (var i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== 'string' ? duration + "ms" : duration;
  }

  return this;
}

function on() {
  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  var eventType = args[0],
      targetSelector = args[1],
      listener = args[2],
      capture = args[3];

  if (typeof args[1] === 'function') {
    eventType = args[0];
    listener = args[1];
    capture = args[2];
    targetSelector = undefined;
  }

  if (!capture) capture = false;

  function handleLiveEvent(e) {
    var target = e.target;
    if (!target) return;
    var eventData = e.target.dom7EventData || [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
      var _parents = $(target).parents(); // eslint-disable-line


      for (var k = 0; k < _parents.length; k += 1) {
        if ($(_parents[k]).is(targetSelector)) listener.apply(_parents[k], eventData);
      }
    }
  }

  function handleEvent(e) {
    var eventData = e && e.target ? e.target.dom7EventData || [] : [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    listener.apply(this, eventData);
  }

  var events = eventType.split(' ');
  var j;

  for (var i = 0; i < this.length; i += 1) {
    var el = this[i];

    if (!targetSelector) {
      for (j = 0; j < events.length; j += 1) {
        var event = events[j];
        if (!el.dom7Listeners) el.dom7Listeners = {};
        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener: listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      // Live events
      for (j = 0; j < events.length; j += 1) {
        var _event = events[j];
        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[_event]) el.dom7LiveListeners[_event] = [];

        el.dom7LiveListeners[_event].push({
          listener: listener,
          proxyListener: handleLiveEvent
        });

        el.addEventListener(_event, handleLiveEvent, capture);
      }
    }
  }

  return this;
}

function off() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  var eventType = args[0],
      targetSelector = args[1],
      listener = args[2],
      capture = args[3];

  if (typeof args[1] === 'function') {
    eventType = args[0];
    listener = args[1];
    capture = args[2];
    targetSelector = undefined;
  }

  if (!capture) capture = false;
  var events = eventType.split(' ');

  for (var i = 0; i < events.length; i += 1) {
    var event = events[i];

    for (var j = 0; j < this.length; j += 1) {
      var el = this[j];
      var handlers = void 0;

      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }

      if (handlers && handlers.length) {
        for (var k = handlers.length - 1; k >= 0; k -= 1) {
          var handler = handlers[k];

          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }

  return this;
}

function once() {
  var dom = this;

  for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  var eventName = args[0],
      targetSelector = args[1],
      listener = args[2],
      capture = args[3];

  if (typeof args[1] === 'function') {
    eventName = args[0];
    listener = args[1];
    capture = args[2];
    targetSelector = undefined;
  }

  function onceHandler() {
    for (var _len8 = arguments.length, eventArgs = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      eventArgs[_key8] = arguments[_key8];
    }

    listener.apply(this, eventArgs);
    dom.off(eventName, targetSelector, onceHandler, capture);

    if (onceHandler.dom7proxy) {
      delete onceHandler.dom7proxy;
    }
  }

  onceHandler.dom7proxy = listener;
  return dom.on(eventName, targetSelector, onceHandler, capture);
}

function trigger() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

  for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }

  var events = args[0].split(' ');
  var eventData = args[1];

  for (var i = 0; i < events.length; i += 1) {
    var event = events[i];

    for (var j = 0; j < this.length; j += 1) {
      var el = this[j];

      if (window.CustomEvent) {
        var evt = new window.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter(function (data, dataIndex) {
          return dataIndex > 0;
        });
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }

  return this;
}

function transitionEnd(callback) {
  var dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('transitionend', fireCallBack);
  }

  if (callback) {
    dom.on('transitionend', fireCallBack);
  }

  return this;
}

function animationEnd(callback) {
  var dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('animationend', fireCallBack);
  }

  if (callback) {
    dom.on('animationend', fireCallBack);
  }

  return this;
}

function width() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

  if (this[0] === window) {
    return window.innerWidth;
  }

  if (this.length > 0) {
    return parseFloat(this.css('width'));
  }

  return null;
}

function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      var _styles = this.styles();

      return this[0].offsetWidth + parseFloat(_styles.getPropertyValue('margin-right')) + parseFloat(_styles.getPropertyValue('margin-left'));
    }

    return this[0].offsetWidth;
  }

  return null;
}

function height() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

  if (this[0] === window) {
    return window.innerHeight;
  }

  if (this.length > 0) {
    return parseFloat(this.css('height'));
  }

  return null;
}

function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      var _styles2 = this.styles();

      return this[0].offsetHeight + parseFloat(_styles2.getPropertyValue('margin-top')) + parseFloat(_styles2.getPropertyValue('margin-bottom'));
    }

    return this[0].offsetHeight;
  }

  return null;
}

function offset() {
  if (this.length > 0) {
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    var el = this[0];
    var box = el.getBoundingClientRect();
    var body = document.body;
    var clientTop = el.clientTop || body.clientTop || 0;
    var clientLeft = el.clientLeft || body.clientLeft || 0;
    var scrollTop = el === window ? window.scrollY : el.scrollTop;
    var scrollLeft = el === window ? window.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  return null;
}

function hide() {
  for (var i = 0; i < this.length; i += 1) {
    this[i].style.display = 'none';
  }

  return this;
}

function show() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

  for (var i = 0; i < this.length; i += 1) {
    var el = this[i];

    if (el.style.display === 'none') {
      el.style.display = '';
    }

    if (window.getComputedStyle(el, null).getPropertyValue('display') === 'none') {
      // Still not visible
      el.style.display = 'block';
    }
  }

  return this;
}

function styles() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  if (this[0]) return window.getComputedStyle(this[0], null);
  return {};
}

function css(props, value) {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var i;

  if (arguments.length === 1) {
    if (typeof props === 'string') {
      // .css('width')
      if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      // .css({ width: '100px' })
      for (i = 0; i < this.length; i += 1) {
        for (var _prop in props) {
          this[i].style[_prop] = props[_prop];
        }
      }

      return this;
    }
  }

  if (arguments.length === 2 && typeof props === 'string') {
    // .css('width', '100px')
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }

    return this;
  }

  return this;
}

function each(callback) {
  if (!callback) return this;
  this.forEach(function (el, index) {
    callback.apply(el, [el, index]);
  });
  return this;
}

function filter(callback) {
  var result = arrayFilter(this, callback);
  return $(result);
}

function html(html) {
  if (typeof html === 'undefined') {
    return this[0] ? this[0].innerHTML : null;
  }

  for (var i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html;
  }

  return this;
}

function text(text) {
  if (typeof text === 'undefined') {
    return this[0] ? this[0].textContent.trim() : null;
  }

  for (var i = 0; i < this.length; i += 1) {
    this[i].textContent = text;
  }

  return this;
}

function is(selector) {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var el = this[0];
  var compareWith;
  var i;
  if (!el || typeof selector === 'undefined') return false;

  if (typeof selector === 'string') {
    if (el.matches) return el.matches(selector);
    if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector) return el.msMatchesSelector(selector);
    compareWith = $(selector);

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  if (selector === document) {
    return el === document;
  }

  if (selector === window) {
    return el === window;
  }

  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  return false;
}

function index() {
  var child = this[0];
  var i;

  if (child) {
    i = 0; // eslint-disable-next-line

    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }

    return i;
  }

  return undefined;
}

function eq(index) {
  if (typeof index === 'undefined') return this;
  var length = this.length;

  if (index > length - 1) {
    return $([]);
  }

  if (index < 0) {
    var returnIndex = length + index;
    if (returnIndex < 0) return $([]);
    return $([this[returnIndex]]);
  }

  return $([this[index]]);
}

function append() {
  var newChild;
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();

  for (var k = 0; k < arguments.length; k += 1) {
    newChild = k < 0 || arguments.length <= k ? undefined : arguments[k];

    for (var i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;

        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (var j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }

  return this;
}

function appendTo(parent) {
  $(parent).append(this);
  return this;
}

function prepend(newChild) {
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var i;
  var j;

  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === 'string') {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;

      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }

  return this;
}

function prependTo(parent) {
  $(parent).prepend(this);
  return this;
}

function insertBefore(selector) {
  var before = $(selector);

  for (var i = 0; i < this.length; i += 1) {
    if (before.length === 1) {
      before[0].parentNode.insertBefore(this[i], before[0]);
    } else if (before.length > 1) {
      for (var j = 0; j < before.length; j += 1) {
        before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
      }
    }
  }
}

function insertAfter(selector) {
  var after = $(selector);

  for (var i = 0; i < this.length; i += 1) {
    if (after.length === 1) {
      after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
    } else if (after.length > 1) {
      for (var j = 0; j < after.length; j += 1) {
        after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
      }
    }
  }
}

function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
        return $([this[0].nextElementSibling]);
      }

      return $([]);
    }

    if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
    return $([]);
  }

  return $([]);
}

function nextAll(selector) {
  var nextEls = [];
  var el = this[0];
  if (!el) return $([]);

  while (el.nextElementSibling) {
    var _next = el.nextElementSibling; // eslint-disable-line

    if (selector) {
      if ($(_next).is(selector)) nextEls.push(_next);
    } else nextEls.push(_next);

    el = _next;
  }

  return $(nextEls);
}

function prev(selector) {
  if (this.length > 0) {
    var el = this[0];

    if (selector) {
      if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
        return $([el.previousElementSibling]);
      }

      return $([]);
    }

    if (el.previousElementSibling) return $([el.previousElementSibling]);
    return $([]);
  }

  return $([]);
}

function prevAll(selector) {
  var prevEls = [];
  var el = this[0];
  if (!el) return $([]);

  while (el.previousElementSibling) {
    var _prev = el.previousElementSibling; // eslint-disable-line

    if (selector) {
      if ($(_prev).is(selector)) prevEls.push(_prev);
    } else prevEls.push(_prev);

    el = _prev;
  }

  return $(prevEls);
}

function siblings(selector) {
  return this.nextAll(selector).add(this.prevAll(selector));
}

function parent(selector) {
  var parents = []; // eslint-disable-line

  for (var i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
      } else {
        parents.push(this[i].parentNode);
      }
    }
  }

  return $(parents);
}

function parents(selector) {
  var parents = []; // eslint-disable-line

  for (var i = 0; i < this.length; i += 1) {
    var _parent = this[i].parentNode; // eslint-disable-line

    while (_parent) {
      if (selector) {
        if ($(_parent).is(selector)) parents.push(_parent);
      } else {
        parents.push(_parent);
      }

      _parent = _parent.parentNode;
    }
  }

  return $(parents);
}

function closest(selector) {
  var closest = this; // eslint-disable-line

  if (typeof selector === 'undefined') {
    return $([]);
  }

  if (!closest.is(selector)) {
    closest = closest.parents(selector).eq(0);
  }

  return closest;
}

function find(selector) {
  var foundElements = [];

  for (var i = 0; i < this.length; i += 1) {
    var found = this[i].querySelectorAll(selector);

    for (var j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }

  return $(foundElements);
}

function children(selector) {
  var children = []; // eslint-disable-line

  for (var i = 0; i < this.length; i += 1) {
    var childNodes = this[i].children;

    for (var j = 0; j < childNodes.length; j += 1) {
      if (!selector || $(childNodes[j]).is(selector)) {
        children.push(childNodes[j]);
      }
    }
  }

  return $(children);
}

function remove() {
  for (var i = 0; i < this.length; i += 1) {
    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
  }

  return this;
}

function detach() {
  return this.remove();
}

function add() {
  var dom = this;
  var i;
  var j;

  for (var _len10 = arguments.length, els = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    els[_key10] = arguments[_key10];
  }

  for (i = 0; i < els.length; i += 1) {
    var toAdd = $(els[i]);

    for (j = 0; j < toAdd.length; j += 1) {
      dom.push(toAdd[j]);
    }
  }

  return dom;
}

function empty() {
  for (var i = 0; i < this.length; i += 1) {
    var el = this[i];

    if (el.nodeType === 1) {
      for (var j = 0; j < el.childNodes.length; j += 1) {
        if (el.childNodes[j].parentNode) {
          el.childNodes[j].parentNode.removeChild(el.childNodes[j]);
        }
      }

      el.textContent = '';
    }
  }

  return this;
}

function scrollTo() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var left = args[0],
      top = args[1],
      duration = args[2],
      easing = args[3],
      callback = args[4];

  if (args.length === 4 && typeof easing === 'function') {
    callback = easing;
    left = args[0];
    top = args[1];
    duration = args[2];
    callback = args[3];
    easing = args[4];
  }

  if (typeof easing === 'undefined') easing = 'swing';
  return this.each(function animate() {
    var el = this;
    var currentTop;
    var currentLeft;
    var maxTop;
    var maxLeft;
    var newTop;
    var newLeft;
    var scrollTop; // eslint-disable-line

    var scrollLeft; // eslint-disable-line

    var animateTop = top > 0 || top === 0;
    var animateLeft = left > 0 || left === 0;

    if (typeof easing === 'undefined') {
      easing = 'swing';
    }

    if (animateTop) {
      currentTop = el.scrollTop;

      if (!duration) {
        el.scrollTop = top;
      }
    }

    if (animateLeft) {
      currentLeft = el.scrollLeft;

      if (!duration) {
        el.scrollLeft = left;
      }
    }

    if (!duration) return;

    if (animateTop) {
      maxTop = el.scrollHeight - el.offsetHeight;
      newTop = Math.max(Math.min(top, maxTop), 0);
    }

    if (animateLeft) {
      maxLeft = el.scrollWidth - el.offsetWidth;
      newLeft = Math.max(Math.min(left, maxLeft), 0);
    }

    var startTime = null;
    if (animateTop && newTop === currentTop) animateTop = false;
    if (animateLeft && newLeft === currentLeft) animateLeft = false;

    function render(time) {
      if (time === void 0) {
        time = new Date().getTime();
      }

      if (startTime === null) {
        startTime = time;
      }

      var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      var easeProgress = easing === 'linear' ? progress : 0.5 - Math.cos(progress * Math.PI) / 2;
      var done;
      if (animateTop) scrollTop = currentTop + easeProgress * (newTop - currentTop);
      if (animateLeft) scrollLeft = currentLeft + easeProgress * (newLeft - currentLeft);

      if (animateTop && newTop > currentTop && scrollTop >= newTop) {
        el.scrollTop = newTop;
        done = true;
      }

      if (animateTop && newTop < currentTop && scrollTop <= newTop) {
        el.scrollTop = newTop;
        done = true;
      }

      if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft) {
        el.scrollLeft = newLeft;
        done = true;
      }

      if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft) {
        el.scrollLeft = newLeft;
        done = true;
      }

      if (done) {
        if (callback) callback();
        return;
      }

      if (animateTop) el.scrollTop = scrollTop;
      if (animateLeft) el.scrollLeft = scrollLeft;
      window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
  });
} // scrollTop(top, duration, easing, callback) {


function scrollTop() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var top = args[0],
      duration = args[1],
      easing = args[2],
      callback = args[3];

  if (args.length === 3 && typeof easing === 'function') {
    top = args[0];
    duration = args[1];
    callback = args[2];
    easing = args[3];
  }

  var dom = this;

  if (typeof top === 'undefined') {
    if (dom.length > 0) return dom[0].scrollTop;
    return null;
  }

  return dom.scrollTo(undefined, top, duration, easing, callback);
}

function scrollLeft() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var left = args[0],
      duration = args[1],
      easing = args[2],
      callback = args[3];

  if (args.length === 3 && typeof easing === 'function') {
    left = args[0];
    duration = args[1];
    callback = args[2];
    easing = args[3];
  }

  var dom = this;

  if (typeof left === 'undefined') {
    if (dom.length > 0) return dom[0].scrollLeft;
    return null;
  }

  return dom.scrollTo(left, undefined, duration, easing, callback);
}

function animate(initialProps, initialParams) {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var els = this;
  var a = {
    props: Object.assign({}, initialProps),
    params: Object.assign({
      duration: 300,
      easing: 'swing' // or 'linear'

      /* Callbacks
      begin(elements)
      complete(elements)
      progress(elements, complete, remaining, start, tweenValue)
      */

    }, initialParams),
    elements: els,
    animating: false,
    que: [],
    easingProgress: function easingProgress(easing, progress) {
      if (easing === 'swing') {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      }

      if (typeof easing === 'function') {
        return easing(progress);
      }

      return progress;
    },
    stop: function stop() {
      if (a.frameId) {
        window.cancelAnimationFrame(a.frameId);
      }

      a.animating = false;
      a.elements.each(function (el) {
        var element = el;
        delete element.dom7AnimateInstance;
      });
      a.que = [];
    },
    done: function done(complete) {
      a.animating = false;
      a.elements.each(function (el) {
        var element = el;
        delete element.dom7AnimateInstance;
      });
      if (complete) complete(els);

      if (a.que.length > 0) {
        var que = a.que.shift();
        a.animate(que[0], que[1]);
      }
    },
    animate: function animate(props, params) {
      if (a.animating) {
        a.que.push([props, params]);
        return a;
      }

      var elements = []; // Define & Cache Initials & Units

      a.elements.each(function (el, index) {
        var initialFullValue;
        var initialValue;
        var unit;
        var finalValue;
        var finalFullValue;
        if (!el.dom7AnimateInstance) a.elements[index].dom7AnimateInstance = a;
        elements[index] = {
          container: el
        };
        Object.keys(props).forEach(function (prop) {
          initialFullValue = window.getComputedStyle(el, null).getPropertyValue(prop).replace(',', '.');
          initialValue = parseFloat(initialFullValue);
          unit = initialFullValue.replace(initialValue, '');
          finalValue = parseFloat(props[prop]);
          finalFullValue = props[prop] + unit;
          elements[index][prop] = {
            initialFullValue: initialFullValue,
            initialValue: initialValue,
            unit: unit,
            finalValue: finalValue,
            finalFullValue: finalFullValue,
            currentValue: initialValue
          };
        });
      });
      var startTime = null;
      var time;
      var elementsDone = 0;
      var propsDone = 0;
      var done;
      var began = false;
      a.animating = true;

      function render() {
        time = new Date().getTime();
        var progress;
        var easeProgress; // let el;

        if (!began) {
          began = true;
          if (params.begin) params.begin(els);
        }

        if (startTime === null) {
          startTime = time;
        }

        if (params.progress) {
          // eslint-disable-next-line
          params.progress(els, Math.max(Math.min((time - startTime) / params.duration, 1), 0), startTime + params.duration - time < 0 ? 0 : startTime + params.duration - time, startTime);
        }

        elements.forEach(function (element) {
          var el = element;
          if (done || el.done) return;
          Object.keys(props).forEach(function (prop) {
            if (done || el.done) return;
            progress = Math.max(Math.min((time - startTime) / params.duration, 1), 0);
            easeProgress = a.easingProgress(params.easing, progress);
            var _el$prop = el[prop],
                initialValue = _el$prop.initialValue,
                finalValue = _el$prop.finalValue,
                unit = _el$prop.unit;
            el[prop].currentValue = initialValue + easeProgress * (finalValue - initialValue);
            var currentValue = el[prop].currentValue;

            if (finalValue > initialValue && currentValue >= finalValue || finalValue < initialValue && currentValue <= finalValue) {
              el.container.style[prop] = finalValue + unit;
              propsDone += 1;

              if (propsDone === Object.keys(props).length) {
                el.done = true;
                elementsDone += 1;
              }

              if (elementsDone === elements.length) {
                done = true;
              }
            }

            if (done) {
              a.done(params.complete);
              return;
            }

            el.container.style[prop] = currentValue + unit;
          });
        });
        if (done) return; // Then call

        a.frameId = window.requestAnimationFrame(render);
      }

      a.frameId = window.requestAnimationFrame(render);
      return a;
    }
  };

  if (a.elements.length === 0) {
    return els;
  }

  var animateInstance;

  for (var i = 0; i < a.elements.length; i += 1) {
    if (a.elements[i].dom7AnimateInstance) {
      animateInstance = a.elements[i].dom7AnimateInstance;
    } else a.elements[i].dom7AnimateInstance = a;
  }

  if (!animateInstance) {
    animateInstance = a;
  }

  if (initialProps === 'stop') {
    animateInstance.stop();
  } else {
    animateInstance.animate(a.props, a.params);
  }

  return els;
}

function stop() {
  var els = this;

  for (var i = 0; i < els.length; i += 1) {
    if (els[i].dom7AnimateInstance) {
      els[i].dom7AnimateInstance.stop();
    }
  }
}

var noTrigger = 'resize scroll'.split(' ');

function shortcut(name) {
  function eventHandler() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (typeof args[0] === 'undefined') {
      for (var i = 0; i < this.length; i += 1) {
        if (noTrigger.indexOf(name) < 0) {
          if (name in this[i]) this[i][name]();else {
            $(this[i]).trigger(name);
          }
        }
      }

      return this;
    }

    return this.on.apply(this, [name].concat(args));
  }

  return eventHandler;
}

var click = shortcut('click');
var blur = shortcut('blur');
var focus = shortcut('focus');
var focusin = shortcut('focusin');
var focusout = shortcut('focusout');
var keyup = shortcut('keyup');
var keydown = shortcut('keydown');
var keypress = shortcut('keypress');
var submit = shortcut('submit');
var change = shortcut('change');
var mousedown = shortcut('mousedown');
var mousemove = shortcut('mousemove');
var mouseup = shortcut('mouseup');
var mouseenter = shortcut('mouseenter');
var mouseleave = shortcut('mouseleave');
var mouseout = shortcut('mouseout');
var mouseover = shortcut('mouseover');
var touchstart = shortcut('touchstart');
var touchend = shortcut('touchend');
var touchmove = shortcut('touchmove');
var resize = shortcut('resize');
var scroll = shortcut('scroll');

/* harmony default export */ __webpack_exports__["default"] = ($);



/***/ }),

/***/ "./node_modules/overlayscrollbars/js/OverlayScrollbars.js":
/*!****************************************************************!*\
  !*** ./node_modules/overlayscrollbars/js/OverlayScrollbars.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * OverlayScrollbars
 * https://github.com/KingSora/OverlayScrollbars
 *
 * Version: 1.13.0
 *
 * Copyright KingSora | Rene Haas.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 * Date: 02.08.2020
 */

(function (global, factory) {
    if (true)
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return factory(global, global.document, undefined); }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    else {}
}(typeof window !== 'undefined' ? window : this,
    function (window, document, undefined) {
        'use strict';
        var PLUGINNAME = 'OverlayScrollbars';
        var TYPES = {
            o: 'object',
            f: 'function',
            a: 'array',
            s: 'string',
            b: 'boolean',
            n: 'number',
            u: 'undefined',
            z: 'null'
            //d : 'date',
            //e : 'error',
            //r : 'regexp',
            //y : 'symbol'
        };
        var LEXICON = {
            c: 'class',
            s: 'style',
            i: 'id',
            l: 'length',
            p: 'prototype',
            ti: 'tabindex',
            oH: 'offsetHeight',
            cH: 'clientHeight',
            sH: 'scrollHeight',
            oW: 'offsetWidth',
            cW: 'clientWidth',
            sW: 'scrollWidth',
            hOP: 'hasOwnProperty',
            bCR: 'getBoundingClientRect'
        };
        var VENDORS = (function () {
            //https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix
            var jsCache = {};
            var cssCache = {};
            var cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];
            var jsPrefixes = ['WebKit', 'Moz', 'O', 'MS'];
            function firstLetterToUpper(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            return {
                _cssPrefixes: cssPrefixes,
                _jsPrefixes: jsPrefixes,
                _cssProperty: function (name) {
                    var result = cssCache[name];

                    if (cssCache[LEXICON.hOP](name))
                        return result;

                    var uppercasedName = firstLetterToUpper(name);
                    var elmStyle = document.createElement('div')[LEXICON.s];
                    var resultPossibilities;
                    var i = 0;
                    var v;
                    var currVendorWithoutDashes;

                    for (; i < cssPrefixes.length; i++) {
                        currVendorWithoutDashes = cssPrefixes[i].replace(/-/g, '');
                        resultPossibilities = [
                            name, //transition
                            cssPrefixes[i] + name, //-webkit-transition
                            currVendorWithoutDashes + uppercasedName, //webkitTransition
                            firstLetterToUpper(currVendorWithoutDashes) + uppercasedName //WebkitTransition
                        ];
                        for (v = 0; v < resultPossibilities[LEXICON.l]; v++) {
                            if (elmStyle[resultPossibilities[v]] !== undefined) {
                                result = resultPossibilities[v];
                                break;
                            }
                        }
                    }

                    cssCache[name] = result;
                    return result;
                },
                _cssPropertyValue: function (property, values, suffix) {
                    var name = property + ' ' + values;
                    var result = cssCache[name];

                    if (cssCache[LEXICON.hOP](name))
                        return result;

                    var dummyStyle = document.createElement('div')[LEXICON.s];
                    var possbleValues = values.split(' ');
                    var preparedSuffix = suffix || '';
                    var i = 0;
                    var v = -1;
                    var prop;

                    for (; i < possbleValues[LEXICON.l]; i++) {
                        for (; v < VENDORS._cssPrefixes[LEXICON.l]; v++) {
                            prop = v < 0 ? possbleValues[i] : VENDORS._cssPrefixes[v] + possbleValues[i];
                            dummyStyle.cssText = property + ':' + prop + preparedSuffix;
                            if (dummyStyle[LEXICON.l]) {
                                result = prop;
                                break;
                            }
                        }
                    }

                    cssCache[name] = result;
                    return result;
                },
                _jsAPI: function (name, isInterface, fallback) {
                    var i = 0;
                    var result = jsCache[name];

                    if (!jsCache[LEXICON.hOP](name)) {
                        result = window[name];
                        for (; i < jsPrefixes[LEXICON.l]; i++)
                            result = result || window[(isInterface ? jsPrefixes[i] : jsPrefixes[i].toLowerCase()) + firstLetterToUpper(name)];
                        jsCache[name] = result;
                    }
                    return result || fallback;
                }
            }
        })();
        var COMPATIBILITY = (function () {
            function windowSize(x) {
                return x ? window.innerWidth || document.documentElement[LEXICON.cW] || document.body[LEXICON.cW] : window.innerHeight || document.documentElement[LEXICON.cH] || document.body[LEXICON.cH];
            }
            function bind(func, thisObj) {
                if (typeof func != TYPES.f) {
                    throw "Can't bind function!";
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    //throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }
                var proto = LEXICON.p;
                var aArgs = Array[proto].slice.call(arguments, 2);
                var fNOP = function () { };
                var fBound = function () { return func.apply(this instanceof fNOP ? this : thisObj, aArgs.concat(Array[proto].slice.call(arguments))); };

                if (func[proto])
                    fNOP[proto] = func[proto]; // Function.prototype doesn't have a prototype property
                fBound[proto] = new fNOP();

                return fBound;
            }

            return {
                /**
                 * Gets the current window width.
                 * @returns {Number|number} The current window width in pixel.
                 */
                wW: bind(windowSize, 0, true),

                /**
                 * Gets the current window height.
                 * @returns {Number|number} The current window height in pixel.
                 */
                wH: bind(windowSize, 0),

                /**
                 * Gets the MutationObserver Object or undefined if not supported.
                 * @returns {MutationObserver|*|undefined} The MutationsObserver Object or undefined.
                 */
                mO: bind(VENDORS._jsAPI, 0, 'MutationObserver', true),

                /**
                 * Gets the ResizeObserver Object or undefined if not supported.
                 * @returns {MutationObserver|*|undefined} The ResizeObserver Object or undefined.
                 */
                rO: bind(VENDORS._jsAPI, 0, 'ResizeObserver', true),

                /**
                 * Gets the RequestAnimationFrame method or it's corresponding polyfill.
                 * @returns {*|Function} The RequestAnimationFrame method or it's corresponding polyfill.
                 */
                rAF: bind(VENDORS._jsAPI, 0, 'requestAnimationFrame', false, function (func) { return window.setTimeout(func, 1000 / 60); }),

                /**
                 * Gets the CancelAnimationFrame method or it's corresponding polyfill.
                 * @returns {*|Function} The CancelAnimationFrame method or it's corresponding polyfill.
                 */
                cAF: bind(VENDORS._jsAPI, 0, 'cancelAnimationFrame', false, function (id) { return window.clearTimeout(id); }),

                /**
                 * Gets the current time.
                 * @returns {number} The current time.
                 */
                now: function () {
                    return Date.now && Date.now() || new Date().getTime();
                },

                /**
                 * Stops the propagation of the given event.
                 * @param event The event of which the propagation shall be stoped.
                 */
                stpP: function (event) {
                    if (event.stopPropagation)
                        event.stopPropagation();
                    else
                        event.cancelBubble = true;
                },

                /**
                 * Prevents the default action of the given event.
                 * @param event The event of which the default action shall be prevented.
                 */
                prvD: function (event) {
                    if (event.preventDefault && event.cancelable)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                },

                /**
                 * Gets the pageX and pageY values of the given mouse event.
                 * @param event The mouse event of which the pageX and pageX shall be got.
                 * @returns {{x: number, y: number}} x = pageX value, y = pageY value.
                 */
                page: function (event) {
                    event = event.originalEvent || event;

                    var strPage = 'page';
                    var strClient = 'client';
                    var strX = 'X';
                    var strY = 'Y';
                    var target = event.target || event.srcElement || document;
                    var eventDoc = target.ownerDocument || document;
                    var doc = eventDoc.documentElement;
                    var body = eventDoc.body;

                    //if touch event return return pageX/Y of it
                    if (event.touches !== undefined) {
                        var touch = event.touches[0];
                        return {
                            x: touch[strPage + strX],
                            y: touch[strPage + strY]
                        }
                    }

                    // Calculate pageX/Y if not native supported
                    if (!event[strPage + strX] && event[strClient + strX] && event[strClient + strX] != null) {

                        return {
                            x: event[strClient + strX] +
                                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                                (doc && doc.clientLeft || body && body.clientLeft || 0),
                            y: event[strClient + strY] +
                                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                                (doc && doc.clientTop || body && body.clientTop || 0)
                        }
                    }
                    return {
                        x: event[strPage + strX],
                        y: event[strPage + strY]
                    };
                },

                /**
                 * Gets the clicked mouse button of the given mouse event.
                 * @param event The mouse event of which the clicked button shal be got.
                 * @returns {number} The number of the clicked mouse button. (0 : none | 1 : leftButton | 2 : middleButton | 3 : rightButton)
                 */
                mBtn: function (event) {
                    var button = event.button;
                    if (!event.which && button !== undefined)
                        return (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                    else
                        return event.which;
                },

                /**
                 * Checks whether a item is in the given array and returns its index.
                 * @param item The item of which the position in the array shall be determined.
                 * @param arr The array.
                 * @returns {number} The zero based index of the item or -1 if the item isn't in the array.
                 */
                inA: function (item, arr) {
                    for (var i = 0; i < arr[LEXICON.l]; i++)
                        //Sometiems in IE a "SCRIPT70" Permission denied error occurs if HTML elements in a iFrame are compared
                        try {
                            if (arr[i] === item)
                                return i;
                        }
                        catch (e) { }
                    return -1;
                },

                /**
                 * Returns true if the given value is a array.
                 * @param arr The potential array.
                 * @returns {boolean} True if the given value is a array, false otherwise.
                 */
                isA: function (arr) {
                    var def = Array.isArray;
                    return def ? def(arr) : this.type(arr) == TYPES.a;
                },

                /**
                 * Determine the internal JavaScript [[Class]] of the given object.
                 * @param obj The object of which the type shall be determined.
                 * @returns {string} The type of the given object.
                 */
                type: function (obj) {
                    if (obj === undefined)
                        return obj + '';
                    if (obj === null)
                        return obj + '';
                    return Object[LEXICON.p].toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
                },


                bind: bind

                /**
                 * Gets the vendor-prefixed CSS property by the given name.
                 * For example the given name is "transform" and you're using a old Firefox browser then the returned value would be "-moz-transform".
                 * If the browser doesn't need a vendor-prefix, then the returned string is the given name.
                 * If the browser doesn't support the given property name at all (not even with a vendor-prefix) the returned value is null.
                 * @param propName The unprefixed CSS property name.
                 * @returns {string|null} The vendor-prefixed CSS property or null if the browser doesn't support the given CSS property.

                cssProp: function(propName) {
                    return VENDORS._cssProperty(propName);
                }
                */
            }
        })();


        var MATH = Math;
        var JQUERY = window.jQuery;
        var EASING = (function () {
            var _easingsMath = {
                p: MATH.PI,
                c: MATH.cos,
                s: MATH.sin,
                w: MATH.pow,
                t: MATH.sqrt,
                n: MATH.asin,
                a: MATH.abs,
                o: 1.70158
            };

            /*
             x : current percent (0 - 1),
             t : current time (duration * percent),
             b : start value (from),
             c : end value (to),
             d : duration

             easingName : function(x, t, b, c, d) { return easedValue; }
             */

            return {
                swing: function (x, t, b, c, d) {
                    return 0.5 - _easingsMath.c(x * _easingsMath.p) / 2;
                },
                linear: function (x, t, b, c, d) {
                    return x;
                },
                easeInQuad: function (x, t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOutQuad: function (x, t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOutQuad: function (x, t, b, c, d) {
                    return ((t /= d / 2) < 1) ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b;
                },
                easeInCubic: function (x, t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOutCubic: function (x, t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOutCubic: function (x, t, b, c, d) {
                    return ((t /= d / 2) < 1) ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;
                },
                easeInQuart: function (x, t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOutQuart: function (x, t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOutQuart: function (x, t, b, c, d) {
                    return ((t /= d / 2) < 1) ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                },
                easeInQuint: function (x, t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOutQuint: function (x, t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOutQuint: function (x, t, b, c, d) {
                    return ((t /= d / 2) < 1) ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                },
                easeInSine: function (x, t, b, c, d) {
                    return -c * _easingsMath.c(t / d * (_easingsMath.p / 2)) + c + b;
                },
                easeOutSine: function (x, t, b, c, d) {
                    return c * _easingsMath.s(t / d * (_easingsMath.p / 2)) + b;
                },
                easeInOutSine: function (x, t, b, c, d) {
                    return -c / 2 * (_easingsMath.c(_easingsMath.p * t / d) - 1) + b;
                },
                easeInExpo: function (x, t, b, c, d) {
                    return (t == 0) ? b : c * _easingsMath.w(2, 10 * (t / d - 1)) + b;
                },
                easeOutExpo: function (x, t, b, c, d) {
                    return (t == d) ? b + c : c * (-_easingsMath.w(2, -10 * t / d) + 1) + b;
                },
                easeInOutExpo: function (x, t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * _easingsMath.w(2, 10 * (t - 1)) + b;
                    return c / 2 * (-_easingsMath.w(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (x, t, b, c, d) {
                    return -c * (_easingsMath.t(1 - (t /= d) * t) - 1) + b;
                },
                easeOutCirc: function (x, t, b, c, d) {
                    return c * _easingsMath.t(1 - (t = t / d - 1) * t) + b;
                },
                easeInOutCirc: function (x, t, b, c, d) {
                    return ((t /= d / 2) < 1) ? -c / 2 * (_easingsMath.t(1 - t * t) - 1) + b : c / 2 * (_easingsMath.t(1 - (t -= 2) * t) + 1) + b;
                },
                easeInElastic: function (x, t, b, c, d) {
                    var s = _easingsMath.o; var p = 0; var a = c;
                    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                    if (a < _easingsMath.a(c)) { a = c; s = p / 4; }
                    else s = p / (2 * _easingsMath.p) * _easingsMath.n(c / a);
                    return -(a * _easingsMath.w(2, 10 * (t -= 1)) * _easingsMath.s((t * d - s) * (2 * _easingsMath.p) / p)) + b;
                },
                easeOutElastic: function (x, t, b, c, d) {
                    var s = _easingsMath.o; var p = 0; var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < _easingsMath.a(c)) { a = c; s = p / 4; }
                    else s = p / (2 * _easingsMath.p) * _easingsMath.n(c / a);
                    return a * _easingsMath.w(2, -10 * t) * _easingsMath.s((t * d - s) * (2 * _easingsMath.p) / p) + c + b;
                },
                easeInOutElastic: function (x, t, b, c, d) {
                    var s = _easingsMath.o; var p = 0; var a = c;
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    if (a < _easingsMath.a(c)) { a = c; s = p / 4; }
                    else s = p / (2 * _easingsMath.p) * _easingsMath.n(c / a);
                    if (t < 1) return -.5 * (a * _easingsMath.w(2, 10 * (t -= 1)) * _easingsMath.s((t * d - s) * (2 * _easingsMath.p) / p)) + b;
                    return a * _easingsMath.w(2, -10 * (t -= 1)) * _easingsMath.s((t * d - s) * (2 * _easingsMath.p) / p) * .5 + c + b;
                },
                easeInBack: function (x, t, b, c, d, s) {
                    s = s || _easingsMath.o;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOutBack: function (x, t, b, c, d, s) {
                    s = s || _easingsMath.o;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOutBack: function (x, t, b, c, d, s) {
                    s = s || _easingsMath.o;
                    return ((t /= d / 2) < 1) ? c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b : c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                },
                easeInBounce: function (x, t, b, c, d) {
                    return c - this.easeOutBounce(x, d - t, 0, c, d) + b;
                },
                easeOutBounce: function (x, t, b, c, d) {
                    var o = 7.5625;
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (o * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (o * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (o * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (o * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                easeInOutBounce: function (x, t, b, c, d) {
                    return (t < d / 2) ? this.easeInBounce(x, t * 2, 0, c, d) * .5 + b : this.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            };
            /*
             *
             * TERMS OF USE - EASING EQUATIONS
             * 
             * Open source under the BSD License. 
             * 
             * Copyright Â© 2001 Robert Penner
             * All rights reserved.
             * 
             * Redistribution and use in source and binary forms, with or without modification, 
             * are permitted provided that the following conditions are met:
             * 
             * Redistributions of source code must retain the above copyright notice, this list of 
             * conditions and the following disclaimer.
             * Redistributions in binary form must reproduce the above copyright notice, this list 
             * of conditions and the following disclaimer in the documentation and/or other materials 
             * provided with the distribution.
             * 
             * Neither the name of the author nor the names of contributors may be used to endorse 
             * or promote products derived from this software without specific prior written permission.
             * 
             * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
             * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
             * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
             *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
             *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
             *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
             * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
             *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
             * OF THE POSSIBILITY OF SUCH DAMAGE. 
             *
             */
        })();
        var FRAMEWORK = (function () {
            var _rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);
            var _strSpace = ' ';
            var _strEmpty = '';
            var _strScrollLeft = 'scrollLeft';
            var _strScrollTop = 'scrollTop';
            var _animations = [];
            var _type = COMPATIBILITY.type;
            var _cssNumber = {
                animationIterationCount: true,
                columnCount: true,
                fillOpacity: true,
                flexGrow: true,
                flexShrink: true,
                fontWeight: true,
                lineHeight: true,
                opacity: true,
                order: true,
                orphans: true,
                widows: true,
                zIndex: true,
                zoom: true
            };

            function extend() {
                var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {},
                    i = 1,
                    length = arguments[LEXICON.l],
                    deep = false;

                // Handle a deep copy situation
                if (_type(target) == TYPES.b) {
                    deep = target;
                    target = arguments[1] || {};
                    // skip the boolean and the target
                    i = 2;
                }

                // Handle case when target is a string or something (possible in deep copy)
                if (_type(target) != TYPES.o && !_type(target) == TYPES.f) {
                    target = {};
                }

                // extend jQuery itself if only one argument is passed
                if (length === i) {
                    target = FakejQuery;
                    --i;
                }

                for (; i < length; i++) {
                    // Only deal with non-null/undefined values
                    if ((options = arguments[i]) != null) {
                        // Extend the base object
                        for (name in options) {
                            src = target[name];
                            copy = options[name];

                            // Prevent never-ending loop
                            if (target === copy) {
                                continue;
                            }

                            // Recurse if we're merging plain objects or arrays
                            if (deep && copy && (isPlainObject(copy) || (copyIsArray = COMPATIBILITY.isA(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && COMPATIBILITY.isA(src) ? src : [];

                                } else {
                                    clone = src && isPlainObject(src) ? src : {};
                                }

                                // Never move original objects, clone them
                                target[name] = extend(deep, clone, copy);

                                // Don't bring in undefined values
                            } else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }

                // Return the modified object
                return target;
            };

            function inArray(item, arr, fromIndex) {
                for (var i = fromIndex || 0; i < arr[LEXICON.l]; i++)
                    if (arr[i] === item)
                        return i;
                return -1;
            }

            function isFunction(obj) {
                return _type(obj) == TYPES.f;
            };

            function isEmptyObject(obj) {
                for (var name in obj)
                    return false;
                return true;
            };

            function isPlainObject(obj) {
                if (!obj || _type(obj) != TYPES.o)
                    return false;

                var key;
                var proto = LEXICON.p;
                var hasOwnProperty = Object[proto].hasOwnProperty;
                var hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
                var hasIsPrototypeOf = obj.constructor && obj.constructor[proto] && hasOwnProperty.call(obj.constructor[proto], 'isPrototypeOf');

                if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
                    return false;
                }


                for (key in obj) { /**/ }

                return _type(key) == TYPES.u || hasOwnProperty.call(obj, key);
            };

            function each(obj, callback) {
                var i = 0;

                if (isArrayLike(obj)) {
                    for (; i < obj[LEXICON.l]; i++) {
                        if (callback.call(obj[i], i, obj[i]) === false)
                            break;
                    }
                }
                else {
                    for (i in obj) {
                        if (callback.call(obj[i], i, obj[i]) === false)
                            break;
                    }
                }

                return obj;
            };

            function isArrayLike(obj) {
                var length = !!obj && [LEXICON.l] in obj && obj[LEXICON.l];
                var t = _type(obj);
                return isFunction(t) ? false : (t == TYPES.a || length === 0 || _type(length) == TYPES.n && length > 0 && (length - 1) in obj);
            }

            function stripAndCollapse(value) {
                var tokens = value.match(_rnothtmlwhite) || [];
                return tokens.join(_strSpace);
            }

            function matches(elem, selector) {
                var nodeList = (elem.parentNode || document).querySelectorAll(selector) || [];
                var i = nodeList[LEXICON.l];

                while (i--)
                    if (nodeList[i] == elem)
                        return true;

                return false;
            }

            function insertAdjacentElement(el, strategy, child) {
                if (COMPATIBILITY.isA(child)) {
                    for (var i = 0; i < child[LEXICON.l]; i++)
                        insertAdjacentElement(el, strategy, child[i]);
                }
                else if (_type(child) == TYPES.s)
                    el.insertAdjacentHTML(strategy, child);
                else
                    el.insertAdjacentElement(strategy, child.nodeType ? child : child[0]);
            }

            function setCSSVal(el, prop, val) {
                try {
                    if (el[LEXICON.s][prop] !== undefined)
                        el[LEXICON.s][prop] = parseCSSVal(prop, val);
                } catch (e) { }
            }

            function parseCSSVal(prop, val) {
                if (!_cssNumber[prop.toLowerCase()] && _type(val) == TYPES.n)
                    val += 'px';
                return val;
            }

            function startNextAnimationInQ(animObj, removeFromQ) {
                var index;
                var nextAnim;
                if (removeFromQ !== false)
                    animObj.q.splice(0, 1);
                if (animObj.q[LEXICON.l] > 0) {
                    nextAnim = animObj.q[0];
                    animate(animObj.el, nextAnim.props, nextAnim.duration, nextAnim.easing, nextAnim.complete, true);
                }
                else {
                    index = inArray(animObj, _animations);
                    if (index > -1)
                        _animations.splice(index, 1);
                }
            }

            function setAnimationValue(el, prop, value) {
                if (prop === _strScrollLeft || prop === _strScrollTop)
                    el[prop] = value;
                else
                    setCSSVal(el, prop, value);
            }

            function animate(el, props, options, easing, complete, guaranteedNext) {
                var hasOptions = isPlainObject(options);
                var from = {};
                var to = {};
                var i = 0;
                var key;
                var animObj;
                var start;
                var progress;
                var step;
                var specialEasing;
                var duration;
                if (hasOptions) {
                    easing = options.easing;
                    start = options.start;
                    progress = options.progress;
                    step = options.step;
                    specialEasing = options.specialEasing;
                    complete = options.complete;
                    duration = options.duration;
                }
                else
                    duration = options;
                specialEasing = specialEasing || {};
                duration = duration || 400;
                easing = easing || 'swing';
                guaranteedNext = guaranteedNext || false;

                for (; i < _animations[LEXICON.l]; i++) {
                    if (_animations[i].el === el) {
                        animObj = _animations[i];
                        break;
                    }
                }

                if (!animObj) {
                    animObj = {
                        el: el,
                        q: []
                    };
                    _animations.push(animObj);
                }

                for (key in props) {
                    if (key === _strScrollLeft || key === _strScrollTop)
                        from[key] = el[key];
                    else
                        from[key] = FakejQuery(el).css(key);
                }

                for (key in from) {
                    if (from[key] !== props[key] && props[key] !== undefined)
                        to[key] = props[key];
                }

                if (!isEmptyObject(to)) {
                    var timeNow;
                    var end;
                    var percent;
                    var fromVal;
                    var toVal;
                    var easedVal;
                    var timeStart;
                    var frame;
                    var elapsed;
                    var qPos = guaranteedNext ? 0 : inArray(qObj, animObj.q);
                    var qObj = {
                        props: to,
                        duration: hasOptions ? options : duration,
                        easing: easing,
                        complete: complete
                    };
                    if (qPos === -1) {
                        qPos = animObj.q[LEXICON.l];
                        animObj.q.push(qObj);
                    }

                    if (qPos === 0) {
                        if (duration > 0) {
                            timeStart = COMPATIBILITY.now();
                            frame = function () {
                                timeNow = COMPATIBILITY.now();
                                elapsed = (timeNow - timeStart);
                                end = qObj.stop || elapsed >= duration;
                                percent = 1 - ((MATH.max(0, timeStart + duration - timeNow) / duration) || 0);

                                for (key in to) {
                                    fromVal = parseFloat(from[key]);
                                    toVal = parseFloat(to[key]);
                                    easedVal = (toVal - fromVal) * EASING[specialEasing[key] || easing](percent, percent * duration, 0, 1, duration) + fromVal;
                                    setAnimationValue(el, key, easedVal);
                                    if (isFunction(step)) {
                                        step(easedVal, {
                                            elem: el,
                                            prop: key,
                                            start: fromVal,
                                            now: easedVal,
                                            end: toVal,
                                            pos: percent,
                                            options: {
                                                easing: easing,
                                                speacialEasing: specialEasing,
                                                duration: duration,
                                                complete: complete,
                                                step: step
                                            },
                                            startTime: timeStart
                                        });
                                    }
                                }

                                if (isFunction(progress))
                                    progress({}, percent, MATH.max(0, duration - elapsed));

                                if (end) {
                                    startNextAnimationInQ(animObj);
                                    if (isFunction(complete))
                                        complete();
                                }
                                else
                                    qObj.frame = COMPATIBILITY.rAF()(frame);
                            };
                            qObj.frame = COMPATIBILITY.rAF()(frame);
                        }
                        else {
                            for (key in to)
                                setAnimationValue(el, key, to[key]);
                            startNextAnimationInQ(animObj);
                        }
                    }
                }
                else if (guaranteedNext)
                    startNextAnimationInQ(animObj);
            }

            function stop(el, clearQ, jumpToEnd) {
                var animObj;
                var qObj;
                var key;
                var i = 0;
                for (; i < _animations[LEXICON.l]; i++) {
                    animObj = _animations[i];
                    if (animObj.el === el) {
                        if (animObj.q[LEXICON.l] > 0) {
                            qObj = animObj.q[0];
                            qObj.stop = true;
                            COMPATIBILITY.cAF()(qObj.frame);
                            animObj.q.splice(0, 1);

                            if (jumpToEnd)
                                for (key in qObj.props)
                                    setAnimationValue(el, key, qObj.props[key]);

                            if (clearQ)
                                animObj.q = [];
                            else
                                startNextAnimationInQ(animObj, false);
                        }
                        break;
                    }
                }
            }

            function elementIsVisible(el) {
                return !!(el[LEXICON.oW] || el[LEXICON.oH] || el.getClientRects()[LEXICON.l]);
            }

            function FakejQuery(selector) {
                if (arguments[LEXICON.l] === 0)
                    return this;

                var base = new FakejQuery();
                var elements = selector;
                var i = 0;
                var elms;
                var el;

                if (_type(selector) == TYPES.s) {
                    elements = [];
                    if (selector.charAt(0) === '<') {
                        el = document.createElement('div');
                        el.innerHTML = selector;
                        elms = el.children;
                    }
                    else {
                        elms = document.querySelectorAll(selector);
                    }

                    for (; i < elms[LEXICON.l]; i++)
                        elements.push(elms[i]);
                }

                if (elements) {
                    if (_type(elements) != TYPES.s && (!isArrayLike(elements) || elements === window || elements === elements.self))
                        elements = [elements];

                    for (i = 0; i < elements[LEXICON.l]; i++)
                        base[i] = elements[i];

                    base[LEXICON.l] = elements[LEXICON.l];
                }

                return base;
            };

            FakejQuery[LEXICON.p] = {

                //EVENTS:

                on: function (eventName, handler) {
                    eventName = (eventName || _strEmpty).match(_rnothtmlwhite) || [_strEmpty];

                    var eventNameLength = eventName[LEXICON.l];
                    var i = 0;
                    var el;
                    return this.each(function () {
                        el = this;
                        try {
                            if (el.addEventListener) {
                                for (; i < eventNameLength; i++)
                                    el.addEventListener(eventName[i], handler);
                            }
                            else if (el.detachEvent) {
                                for (; i < eventNameLength; i++)
                                    el.attachEvent('on' + eventName[i], handler);
                            }
                        } catch (e) { }
                    });
                },

                off: function (eventName, handler) {
                    eventName = (eventName || _strEmpty).match(_rnothtmlwhite) || [_strEmpty];

                    var eventNameLength = eventName[LEXICON.l];
                    var i = 0;
                    var el;
                    return this.each(function () {
                        el = this;
                        try {
                            if (el.removeEventListener) {
                                for (; i < eventNameLength; i++)
                                    el.removeEventListener(eventName[i], handler);
                            }
                            else if (el.detachEvent) {
                                for (; i < eventNameLength; i++)
                                    el.detachEvent('on' + eventName[i], handler);
                            }
                        } catch (e) { }
                    });
                },

                one: function (eventName, handler) {
                    eventName = (eventName || _strEmpty).match(_rnothtmlwhite) || [_strEmpty];
                    return this.each(function () {
                        var el = FakejQuery(this);
                        FakejQuery.each(eventName, function (i, oneEventName) {
                            var oneHandler = function (e) {
                                handler.call(this, e);
                                el.off(oneEventName, oneHandler);
                            };
                            el.on(oneEventName, oneHandler);
                        });
                    });
                },

                trigger: function (eventName) {
                    var el;
                    var event;
                    return this.each(function () {
                        el = this;
                        if (document.createEvent) {
                            event = document.createEvent('HTMLEvents');
                            event.initEvent(eventName, true, false);
                            el.dispatchEvent(event);
                        }
                        else {
                            el.fireEvent('on' + eventName);
                        }
                    });
                },

                //DOM NODE INSERTING / REMOVING:

                append: function (child) {
                    return this.each(function () { insertAdjacentElement(this, 'beforeend', child); });
                },

                prepend: function (child) {
                    return this.each(function () { insertAdjacentElement(this, 'afterbegin', child); });
                },

                before: function (child) {
                    return this.each(function () { insertAdjacentElement(this, 'beforebegin', child); });
                },

                after: function (child) {
                    return this.each(function () { insertAdjacentElement(this, 'afterend', child); });
                },

                remove: function () {
                    return this.each(function () {
                        var el = this;
                        var parentNode = el.parentNode;
                        if (parentNode != null)
                            parentNode.removeChild(el);
                    });
                },

                unwrap: function () {
                    var parents = [];
                    var i;
                    var el;
                    var parent;

                    this.each(function () {
                        parent = this.parentNode;
                        if (inArray(parent, parents) === - 1)
                            parents.push(parent);
                    });

                    for (i = 0; i < parents[LEXICON.l]; i++) {
                        el = parents[i];
                        parent = el.parentNode;
                        while (el.firstChild)
                            parent.insertBefore(el.firstChild, el);
                        parent.removeChild(el);
                    }

                    return this;
                },

                wrapAll: function (wrapperHTML) {
                    var i;
                    var nodes = this;
                    var wrapper = FakejQuery(wrapperHTML)[0];
                    var deepest = wrapper;
                    var parent = nodes[0].parentNode;
                    var previousSibling = nodes[0].previousSibling;
                    while (deepest.childNodes[LEXICON.l] > 0)
                        deepest = deepest.childNodes[0];

                    for (i = 0; nodes[LEXICON.l] - i; deepest.firstChild === nodes[0] && i++)
                        deepest.appendChild(nodes[i]);

                    var nextSibling = previousSibling ? previousSibling.nextSibling : parent.firstChild;
                    parent.insertBefore(wrapper, nextSibling);

                    return this;
                },

                wrapInner: function (wrapperHTML) {
                    return this.each(function () {
                        var el = FakejQuery(this);
                        var contents = el.contents();

                        if (contents[LEXICON.l])
                            contents.wrapAll(wrapperHTML);
                        else
                            el.append(wrapperHTML);
                    });
                },

                wrap: function (wrapperHTML) {
                    return this.each(function () { FakejQuery(this).wrapAll(wrapperHTML); });
                },


                //DOM NODE MANIPULATION / INFORMATION:

                css: function (styles, val) {
                    var el;
                    var key;
                    var cptStyle;
                    var getCptStyle = window.getComputedStyle;
                    if (_type(styles) == TYPES.s) {
                        if (val === undefined) {
                            el = this[0];
                            cptStyle = getCptStyle ? getCptStyle(el, null) : el.currentStyle[styles];

                            //https://bugzilla.mozilla.org/show_bug.cgi?id=548397 can be null sometimes if iframe with display: none (firefox only!)
                            return getCptStyle ? cptStyle != null ? cptStyle.getPropertyValue(styles) : el[LEXICON.s][styles] : cptStyle;
                        }
                        else {
                            return this.each(function () {
                                setCSSVal(this, styles, val);
                            });
                        }
                    }
                    else {
                        return this.each(function () {
                            for (key in styles)
                                setCSSVal(this, key, styles[key]);
                        });
                    }
                },

                hasClass: function (className) {
                    var elem, i = 0;
                    var classNamePrepared = _strSpace + className + _strSpace;
                    var classList;

                    while ((elem = this[i++])) {
                        classList = elem.classList;
                        if (classList && classList.contains(className))
                            return true;
                        else if (elem.nodeType === 1 && (_strSpace + stripAndCollapse(elem.className + _strEmpty) + _strSpace).indexOf(classNamePrepared) > -1)
                            return true;
                    }

                    return false;
                },

                addClass: function (className) {
                    var classes;
                    var elem;
                    var cur;
                    var curValue;
                    var clazz;
                    var finalValue;
                    var supportClassList;
                    var elmClassList;
                    var i = 0;
                    var v = 0;

                    if (className) {
                        classes = className.match(_rnothtmlwhite) || [];

                        while ((elem = this[i++])) {
                            elmClassList = elem.classList;
                            if (supportClassList === undefined)
                                supportClassList = elmClassList !== undefined;

                            if (supportClassList) {
                                while ((clazz = classes[v++]))
                                    elmClassList.add(clazz);
                            }
                            else {
                                curValue = elem.className + _strEmpty;
                                cur = elem.nodeType === 1 && (_strSpace + stripAndCollapse(curValue) + _strSpace);

                                if (cur) {
                                    while ((clazz = classes[v++]))
                                        if (cur.indexOf(_strSpace + clazz + _strSpace) < 0)
                                            cur += clazz + _strSpace;

                                    finalValue = stripAndCollapse(cur);
                                    if (curValue !== finalValue)
                                        elem.className = finalValue;
                                }
                            }
                        }
                    }

                    return this;
                },

                removeClass: function (className) {
                    var classes;
                    var elem;
                    var cur;
                    var curValue;
                    var clazz;
                    var finalValue;
                    var supportClassList;
                    var elmClassList;
                    var i = 0;
                    var v = 0;

                    if (className) {
                        classes = className.match(_rnothtmlwhite) || [];

                        while ((elem = this[i++])) {
                            elmClassList = elem.classList;
                            if (supportClassList === undefined)
                                supportClassList = elmClassList !== undefined;

                            if (supportClassList) {
                                while ((clazz = classes[v++]))
                                    elmClassList.remove(clazz);
                            }
                            else {
                                curValue = elem.className + _strEmpty;
                                cur = elem.nodeType === 1 && (_strSpace + stripAndCollapse(curValue) + _strSpace);

                                if (cur) {
                                    while ((clazz = classes[v++]))
                                        while (cur.indexOf(_strSpace + clazz + _strSpace) > -1)
                                            cur = cur.replace(_strSpace + clazz + _strSpace, _strSpace);

                                    finalValue = stripAndCollapse(cur);
                                    if (curValue !== finalValue)
                                        elem.className = finalValue;
                                }
                            }
                        }
                    }

                    return this;
                },

                hide: function () {
                    return this.each(function () { this[LEXICON.s].display = 'none'; });
                },

                show: function () {
                    return this.each(function () { this[LEXICON.s].display = 'block'; });
                },

                attr: function (attrName, value) {
                    var i = 0;
                    var el;
                    while (el = this[i++]) {
                        if (value === undefined)
                            return el.getAttribute(attrName);
                        el.setAttribute(attrName, value);
                    }
                    return this;
                },

                removeAttr: function (attrName) {
                    return this.each(function () { this.removeAttribute(attrName); });
                },

                offset: function () {
                    var el = this[0];
                    var rect = el[LEXICON.bCR]();
                    var scrollLeft = window.pageXOffset || document.documentElement[_strScrollLeft];
                    var scrollTop = window.pageYOffset || document.documentElement[_strScrollTop];
                    return {
                        top: rect.top + scrollTop,
                        left: rect.left + scrollLeft
                    };
                },

                position: function () {
                    var el = this[0];
                    return {
                        top: el.offsetTop,
                        left: el.offsetLeft
                    };
                },

                scrollLeft: function (value) {
                    var i = 0;
                    var el;
                    while (el = this[i++]) {
                        if (value === undefined)
                            return el[_strScrollLeft];
                        el[_strScrollLeft] = value;
                    }
                    return this;
                },

                scrollTop: function (value) {
                    var i = 0;
                    var el;
                    while (el = this[i++]) {
                        if (value === undefined)
                            return el[_strScrollTop];
                        el[_strScrollTop] = value;
                    }
                    return this;
                },

                val: function (value) {
                    var el = this[0];
                    if (!value)
                        return el.value;
                    el.value = value;
                    return this;
                },


                //DOM TRAVERSAL / FILTERING:

                first: function () {
                    return this.eq(0);
                },

                last: function () {
                    return this.eq(-1);
                },

                eq: function (index) {
                    return FakejQuery(this[index >= 0 ? index : this[LEXICON.l] + index]);
                },

                find: function (selector) {
                    var children = [];
                    var i;
                    this.each(function () {
                        var el = this;
                        var ch = el.querySelectorAll(selector);
                        for (i = 0; i < ch[LEXICON.l]; i++)
                            children.push(ch[i]);
                    });
                    return FakejQuery(children);
                },

                children: function (selector) {
                    var children = [];
                    var el;
                    var ch;
                    var i;

                    this.each(function () {
                        ch = this.children;
                        for (i = 0; i < ch[LEXICON.l]; i++) {
                            el = ch[i];
                            if (selector) {
                                if ((el.matches && el.matches(selector)) || matches(el, selector))
                                    children.push(el);
                            }
                            else
                                children.push(el);
                        }
                    });
                    return FakejQuery(children);
                },

                parent: function (selector) {
                    var parents = [];
                    var parent;
                    this.each(function () {
                        parent = this.parentNode;
                        if (selector ? FakejQuery(parent).is(selector) : true)
                            parents.push(parent);
                    });
                    return FakejQuery(parents);
                },

                is: function (selector) {

                    var el;
                    var i;
                    for (i = 0; i < this[LEXICON.l]; i++) {
                        el = this[i];
                        if (selector === ':visible')
                            return elementIsVisible(el);
                        if (selector === ':hidden')
                            return !elementIsVisible(el);
                        if ((el.matches && el.matches(selector)) || matches(el, selector))
                            return true;
                    }
                    return false;
                },

                contents: function () {
                    var contents = [];
                    var childs;
                    var i;

                    this.each(function () {
                        childs = this.childNodes;
                        for (i = 0; i < childs[LEXICON.l]; i++)
                            contents.push(childs[i]);
                    });

                    return FakejQuery(contents);
                },

                each: function (callback) {
                    return each(this, callback);
                },


                //ANIMATION:

                animate: function (props, duration, easing, complete) {
                    return this.each(function () { animate(this, props, duration, easing, complete); });
                },

                stop: function (clearQ, jump) {
                    return this.each(function () { stop(this, clearQ, jump); });
                }
            };

            extend(FakejQuery, {
                extend: extend,
                inArray: inArray,
                isEmptyObject: isEmptyObject,
                isPlainObject: isPlainObject,
                each: each
            });

            return FakejQuery;
        })();
        var INSTANCES = (function () {
            var _targets = [];
            var _instancePropertyString = '__overlayScrollbars__';

            /**
             * Register, unregister or get a certain (or all) instances.
             * Register: Pass the target and the instance.
             * Unregister: Pass the target and null.
             * Get Instance: Pass the target from which the instance shall be got.
             * Get Targets: Pass no arguments.
             * @param target The target to which the instance shall be registered / from which the instance shall be unregistered / the instance shall be got
             * @param instance The instance.
             * @returns {*|void} Returns the instance from the given target.
             */
            return function (target, instance) {
                var argLen = arguments[LEXICON.l];
                if (argLen < 1) {
                    //return all targets
                    return _targets;
                }
                else {
                    if (instance) {
                        //register instance
                        target[_instancePropertyString] = instance;
                        _targets.push(target);
                    }
                    else {
                        var index = COMPATIBILITY.inA(target, _targets);
                        if (index > -1) {
                            if (argLen > 1) {
                                //unregister instance
                                delete target[_instancePropertyString];
                                _targets.splice(index, 1);
                            }
                            else {
                                //get instance from target
                                return _targets[index][_instancePropertyString];
                            }
                        }
                    }
                }
            }
        })();
        var PLUGIN = (function () {
            var _plugin;
            var _pluginsGlobals;
            var _pluginsAutoUpdateLoop;
            var _pluginsExtensions = [];
            var _pluginsOptions = (function () {
                var type = COMPATIBILITY.type;
                var possibleTemplateTypes = [
                    TYPES.b, //boolean
                    TYPES.n, //number
                    TYPES.s, //string
                    TYPES.a, //array
                    TYPES.o, //object
                    TYPES.f, //function
                    TYPES.z  //null
                ];
                var restrictedStringsSplit = ' ';
                var restrictedStringsPossibilitiesSplit = ':';
                var classNameAllowedValues = [TYPES.z, TYPES.s];
                var numberAllowedValues = TYPES.n;
                var booleanNullAllowedValues = [TYPES.z, TYPES.b];
                var booleanTrueTemplate = [true, TYPES.b];
                var booleanFalseTemplate = [false, TYPES.b];
                var callbackTemplate = [null, [TYPES.z, TYPES.f]];
                var updateOnLoadTemplate = [['img'], [TYPES.s, TYPES.a, TYPES.z]];
                var inheritedAttrsTemplate = [['style', 'class'], [TYPES.s, TYPES.a, TYPES.z]];
                var resizeAllowedValues = 'n:none b:both h:horizontal v:vertical';
                var overflowBehaviorAllowedValues = 'v-h:visible-hidden v-s:visible-scroll s:scroll h:hidden';
                var scrollbarsVisibilityAllowedValues = 'v:visible h:hidden a:auto';
                var scrollbarsAutoHideAllowedValues = 'n:never s:scroll l:leave m:move';
                var optionsDefaultsAndTemplate = {
                    className: ['os-theme-dark', classNameAllowedValues],                //null || string
                    resize: ['none', resizeAllowedValues],                               //none || both  || horizontal || vertical || n || b || h || v
                    sizeAutoCapable: booleanTrueTemplate,                                //true || false
                    clipAlways: booleanTrueTemplate,                                     //true || false
                    normalizeRTL: booleanTrueTemplate,                                   //true || false
                    paddingAbsolute: booleanFalseTemplate,                               //true || false
                    autoUpdate: [null, booleanNullAllowedValues],                        //true || false || null
                    autoUpdateInterval: [33, numberAllowedValues],                       //number
                    updateOnLoad: updateOnLoadTemplate,                                  //string || array || null
                    nativeScrollbarsOverlaid: {
                        showNativeScrollbars: booleanFalseTemplate,                      //true || false
                        initialize: booleanTrueTemplate                                  //true || false
                    },
                    overflowBehavior: {
                        x: ['scroll', overflowBehaviorAllowedValues],                    //visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
                        y: ['scroll', overflowBehaviorAllowedValues]                     //visible-hidden  || visible-scroll || hidden || scroll || v-h || v-s || h || s
                    },
                    scrollbars: {
                        visibility: ['auto', scrollbarsVisibilityAllowedValues],         //visible || hidden || auto || v || h || a
                        autoHide: ['never', scrollbarsAutoHideAllowedValues],            //never || scroll || leave || move || n || s || l || m
                        autoHideDelay: [800, numberAllowedValues],                       //number
                        dragScrolling: booleanTrueTemplate,                              //true || false
                        clickScrolling: booleanFalseTemplate,                            //true || false
                        touchSupport: booleanTrueTemplate,                               //true || false
                        snapHandle: booleanFalseTemplate                                 //true || false
                    },
                    textarea: {
                        dynWidth: booleanFalseTemplate,                                  //true || false
                        dynHeight: booleanFalseTemplate,                                 //true || false
                        inheritedAttrs: inheritedAttrsTemplate                           //string || array || null
                    },
                    callbacks: {
                        onInitialized: callbackTemplate,                                 //null || function
                        onInitializationWithdrawn: callbackTemplate,                     //null || function
                        onDestroyed: callbackTemplate,                                   //null || function
                        onScrollStart: callbackTemplate,                                 //null || function
                        onScroll: callbackTemplate,                                      //null || function
                        onScrollStop: callbackTemplate,                                  //null || function
                        onOverflowChanged: callbackTemplate,                             //null || function
                        onOverflowAmountChanged: callbackTemplate,                       //null || function
                        onDirectionChanged: callbackTemplate,                            //null || function
                        onContentSizeChanged: callbackTemplate,                          //null || function
                        onHostSizeChanged: callbackTemplate,                             //null || function
                        onUpdated: callbackTemplate                                      //null || function
                    }
                };
                var convert = function (template) {
                    var recursive = function (obj) {
                        var key;
                        var val;
                        var valType;
                        for (key in obj) {
                            if (!obj[LEXICON.hOP](key))
                                continue;
                            val = obj[key];
                            valType = type(val);
                            if (valType == TYPES.a)
                                obj[key] = val[template ? 1 : 0];
                            else if (valType == TYPES.o)
                                obj[key] = recursive(val);
                        }
                        return obj;
                    };
                    return recursive(FRAMEWORK.extend(true, {}, optionsDefaultsAndTemplate));
                };

                return {
                    _defaults: convert(),

                    _template: convert(true),

                    /**
                     * Validates the passed object by the passed template.
                     * @param obj The object which shall be validated.
                     * @param template The template which defines the allowed values and types.
                     * @param writeErrors True if errors shall be logged to the console.
                     * @param diffObj If a object is passed then only valid differences to this object will be returned.
                     * @returns {{}} A object which contains two objects called "default" and "prepared" which contains only the valid properties of the passed original object and discards not different values compared to the passed diffObj.
                     */
                    _validate: function (obj, template, writeErrors, diffObj) {
                        var validatedOptions = {};
                        var validatedOptionsPrepared = {};
                        var objectCopy = FRAMEWORK.extend(true, {}, obj);
                        var inArray = FRAMEWORK.inArray;
                        var isEmptyObj = FRAMEWORK.isEmptyObject;
                        var checkObjectProps = function (data, template, diffData, validatedOptions, validatedOptionsPrepared, prevPropName) {
                            for (var prop in template) {
                                if (template[LEXICON.hOP](prop) && data[LEXICON.hOP](prop)) {
                                    var isValid = false;
                                    var isDiff = false;
                                    var templateValue = template[prop];
                                    var templateValueType = type(templateValue);
                                    var templateIsComplex = templateValueType == TYPES.o;
                                    var templateTypes = !COMPATIBILITY.isA(templateValue) ? [templateValue] : templateValue;
                                    var dataDiffValue = diffData[prop];
                                    var dataValue = data[prop];
                                    var dataValueType = type(dataValue);
                                    var propPrefix = prevPropName ? prevPropName + '.' : '';
                                    var error = "The option \"" + propPrefix + prop + "\" wasn't set, because";
                                    var errorPossibleTypes = [];
                                    var errorRestrictedStrings = [];
                                    var restrictedStringValuesSplit;
                                    var restrictedStringValuesPossibilitiesSplit;
                                    var isRestrictedValue;
                                    var mainPossibility;
                                    var currType;
                                    var i;
                                    var v;
                                    var j;

                                    dataDiffValue = dataDiffValue === undefined ? {} : dataDiffValue;

                                    //if the template has a object as value, it means that the options are complex (verschachtelt)
                                    if (templateIsComplex && dataValueType == TYPES.o) {
                                        validatedOptions[prop] = {};
                                        validatedOptionsPrepared[prop] = {};
                                        checkObjectProps(dataValue, templateValue, dataDiffValue, validatedOptions[prop], validatedOptionsPrepared[prop], propPrefix + prop);
                                        FRAMEWORK.each([data, validatedOptions, validatedOptionsPrepared], function (index, value) {
                                            if (isEmptyObj(value[prop])) {
                                                delete value[prop];
                                            }
                                        });
                                    }
                                    else if (!templateIsComplex) {
                                        for (i = 0; i < templateTypes[LEXICON.l]; i++) {
                                            currType = templateTypes[i];
                                            templateValueType = type(currType);
                                            //if currtype is string and starts with restrictedStringPrefix and end with restrictedStringSuffix
                                            isRestrictedValue = templateValueType == TYPES.s && inArray(currType, possibleTemplateTypes) === -1;
                                            if (isRestrictedValue) {
                                                errorPossibleTypes.push(TYPES.s);

                                                //split it into a array which contains all possible values for example: ["y:yes", "n:no", "m:maybe"]
                                                restrictedStringValuesSplit = currType.split(restrictedStringsSplit);
                                                errorRestrictedStrings = errorRestrictedStrings.concat(restrictedStringValuesSplit);
                                                for (v = 0; v < restrictedStringValuesSplit[LEXICON.l]; v++) {
                                                    //split the possible values into their possibiliteis for example: ["y", "yes"] -> the first is always the mainPossibility
                                                    restrictedStringValuesPossibilitiesSplit = restrictedStringValuesSplit[v].split(restrictedStringsPossibilitiesSplit);
                                                    mainPossibility = restrictedStringValuesPossibilitiesSplit[0];
                                                    for (j = 0; j < restrictedStringValuesPossibilitiesSplit[LEXICON.l]; j++) {
                                                        //if any possibility matches with the dataValue, its valid
                                                        if (dataValue === restrictedStringValuesPossibilitiesSplit[j]) {
                                                            isValid = true;
                                                            break;
                                                        }
                                                    }
                                                    if (isValid)
                                                        break;
                                                }
                                            }
                                            else {
                                                errorPossibleTypes.push(currType);

                                                if (dataValueType === currType) {
                                                    isValid = true;
                                                    break;
                                                }
                                            }
                                        }

                                        if (isValid) {
                                            isDiff = dataValue !== dataDiffValue;

                                            if (isDiff)
                                                validatedOptions[prop] = dataValue;

                                            if (isRestrictedValue ? inArray(dataDiffValue, restrictedStringValuesPossibilitiesSplit) < 0 : isDiff)
                                                validatedOptionsPrepared[prop] = isRestrictedValue ? mainPossibility : dataValue;
                                        }
                                        else if (writeErrors) {
                                            console.warn(error + " it doesn't accept the type [ " + dataValueType.toUpperCase() + " ] with the value of \"" + dataValue + "\".\r\n" +
                                                "Accepted types are: [ " + errorPossibleTypes.join(', ').toUpperCase() + " ]." +
                                                (errorRestrictedStrings[length] > 0 ? "\r\nValid strings are: [ " + errorRestrictedStrings.join(', ').split(restrictedStringsPossibilitiesSplit).join(', ') + " ]." : ''));
                                        }
                                        delete data[prop];
                                    }
                                }
                            }
                        };
                        checkObjectProps(objectCopy, template, diffObj || {}, validatedOptions, validatedOptionsPrepared);

                        //add values which aren't specified in the template to the finished validated object to prevent them from being discarded
                        /*
                        if(keepForeignProps) {
                            FRAMEWORK.extend(true, validatedOptions, objectCopy);
                            FRAMEWORK.extend(true, validatedOptionsPrepared, objectCopy);
                        }
                        */

                        if (!isEmptyObj(objectCopy) && writeErrors)
                            console.warn('The following options are discarded due to invalidity:\r\n' + window.JSON.stringify(objectCopy, null, 2));

                        return {
                            _default: validatedOptions,
                            _prepared: validatedOptionsPrepared
                        };
                    }
                }
            }());

            /**
             * Initializes the object which contains global information about the plugin and each instance of it.
             */
            function initOverlayScrollbarsStatics() {
                if (!_pluginsGlobals)
                    _pluginsGlobals = new OverlayScrollbarsGlobals(_pluginsOptions._defaults);
                if (!_pluginsAutoUpdateLoop)
                    _pluginsAutoUpdateLoop = new OverlayScrollbarsAutoUpdateLoop(_pluginsGlobals);
            }

            /**
             * The global object for the OverlayScrollbars objects. It contains resources which every OverlayScrollbars object needs. This object is initialized only once: if the first OverlayScrollbars object gets initialized.
             * @param defaultOptions
             * @constructor
             */
            function OverlayScrollbarsGlobals(defaultOptions) {
                var _base = this;
                var strOverflow = 'overflow';
                var strHidden = 'hidden';
                var strScroll = 'scroll';
                var bodyElement = FRAMEWORK('body');
                var scrollbarDummyElement = FRAMEWORK('<div id="os-dummy-scrollbar-size"><div></div></div>');
                var scrollbarDummyElement0 = scrollbarDummyElement[0];
                var dummyContainerChild = FRAMEWORK(scrollbarDummyElement.children('div').eq(0));

                bodyElement.append(scrollbarDummyElement);
                scrollbarDummyElement.hide().show(); //fix IE8 bug (incorrect measuring)

                var nativeScrollbarSize = calcNativeScrollbarSize(scrollbarDummyElement0);
                var nativeScrollbarIsOverlaid = {
                    x: nativeScrollbarSize.x === 0,
                    y: nativeScrollbarSize.y === 0
                };
                var msie = (function () {
                    var ua = window.navigator.userAgent;
                    var strIndexOf = 'indexOf';
                    var strSubString = 'substring';
                    var msie = ua[strIndexOf]('MSIE ');
                    var trident = ua[strIndexOf]('Trident/');
                    var edge = ua[strIndexOf]('Edge/');
                    var rv = ua[strIndexOf]('rv:');
                    var result;
                    var parseIntFunc = parseInt;

                    // IE 10 or older => return version number
                    if (msie > 0)
                        result = parseIntFunc(ua[strSubString](msie + 5, ua[strIndexOf]('.', msie)), 10);

                    // IE 11 => return version number
                    else if (trident > 0)
                        result = parseIntFunc(ua[strSubString](rv + 3, ua[strIndexOf]('.', rv)), 10);

                    // Edge (IE 12+) => return version number
                    else if (edge > 0)
                        result = parseIntFunc(ua[strSubString](edge + 5, ua[strIndexOf]('.', edge)), 10);

                    // other browser
                    return result;
                })();

                FRAMEWORK.extend(_base, {
                    defaultOptions: defaultOptions,
                    msie: msie,
                    autoUpdateLoop: false,
                    autoUpdateRecommended: !COMPATIBILITY.mO(),
                    nativeScrollbarSize: nativeScrollbarSize,
                    nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
                    nativeScrollbarStyling: (function () {
                        var result = false;
                        scrollbarDummyElement.addClass('os-viewport-native-scrollbars-invisible');
                        try {
                            result = (scrollbarDummyElement.css('scrollbar-width') === 'none' && (msie > 9 || !msie)) || window.getComputedStyle(scrollbarDummyElement0, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
                        } catch (ex) { }

                        //fix opera bug: scrollbar styles will only appear if overflow value is scroll or auto during the activation of the style.
                        //and set overflow to scroll
                        //scrollbarDummyElement.css(strOverflow, strHidden).hide().css(strOverflow, strScroll).show();
                        //return (scrollbarDummyElement0[LEXICON.oH] - scrollbarDummyElement0[LEXICON.cH]) === 0 && (scrollbarDummyElement0[LEXICON.oW] - scrollbarDummyElement0[LEXICON.cW]) === 0;

                        return result;
                    })(),
                    overlayScrollbarDummySize: { x: 30, y: 30 },
                    cssCalc: VENDORS._cssPropertyValue('width', 'calc', '(1px)') || null,
                    restrictedMeasuring: (function () {
                        //https://bugzilla.mozilla.org/show_bug.cgi?id=1439305
                        //since 1.11.0 always false -> fixed via CSS (hopefully)
                        scrollbarDummyElement.css(strOverflow, strHidden);
                        var scrollSize = {
                            w: scrollbarDummyElement0[LEXICON.sW],
                            h: scrollbarDummyElement0[LEXICON.sH]
                        };
                        scrollbarDummyElement.css(strOverflow, 'visible');
                        var scrollSize2 = {
                            w: scrollbarDummyElement0[LEXICON.sW],
                            h: scrollbarDummyElement0[LEXICON.sH]
                        };
                        return (scrollSize.w - scrollSize2.w) !== 0 || (scrollSize.h - scrollSize2.h) !== 0;
                    })(),
                    rtlScrollBehavior: (function () {
                        scrollbarDummyElement.css({ 'overflow-y': strHidden, 'overflow-x': strScroll, 'direction': 'rtl' }).scrollLeft(0);
                        var dummyContainerOffset = scrollbarDummyElement.offset();
                        var dummyContainerChildOffset = dummyContainerChild.offset();
                        //https://github.com/KingSora/OverlayScrollbars/issues/187
                        scrollbarDummyElement.scrollLeft(-999);
                        var dummyContainerChildOffsetAfterScroll = dummyContainerChild.offset();
                        return {
                            //origin direction = determines if the zero scroll position is on the left or right side
                            //'i' means 'invert' (i === true means that the axis must be inverted to be correct)
                            //true = on the left side
                            //false = on the right side
                            i: dummyContainerOffset.left === dummyContainerChildOffset.left,
                            //negative = determines if the maximum scroll is positive or negative
                            //'n' means 'negate' (n === true means that the axis must be negated to be correct)
                            //true = negative
                            //false = positive
                            n: dummyContainerChildOffset.left !== dummyContainerChildOffsetAfterScroll.left
                        };
                    })(),
                    supportTransform: !!VENDORS._cssProperty('transform'),
                    supportTransition: !!VENDORS._cssProperty('transition'),
                    supportPassiveEvents: (function () {
                        var supportsPassive = false;
                        try {
                            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                                get: function () {
                                    supportsPassive = true;
                                }
                            }));
                        } catch (e) { }
                        return supportsPassive;
                    })(),
                    supportResizeObserver: !!COMPATIBILITY.rO(),
                    supportMutationObserver: !!COMPATIBILITY.mO()
                });

                scrollbarDummyElement.removeAttr(LEXICON.s).remove();

                //Catch zoom event:
                (function () {
                    if (nativeScrollbarIsOverlaid.x && nativeScrollbarIsOverlaid.y)
                        return;

                    var abs = MATH.abs;
                    var windowWidth = COMPATIBILITY.wW();
                    var windowHeight = COMPATIBILITY.wH();
                    var windowDpr = getWindowDPR();
                    var onResize = function () {
                        if (INSTANCES().length > 0) {
                            var newW = COMPATIBILITY.wW();
                            var newH = COMPATIBILITY.wH();
                            var deltaW = newW - windowWidth;
                            var deltaH = newH - windowHeight;

                            if (deltaW === 0 && deltaH === 0)
                                return;

                            var deltaWRatio = MATH.round(newW / (windowWidth / 100.0));
                            var deltaHRatio = MATH.round(newH / (windowHeight / 100.0));
                            var absDeltaW = abs(deltaW);
                            var absDeltaH = abs(deltaH);
                            var absDeltaWRatio = abs(deltaWRatio);
                            var absDeltaHRatio = abs(deltaHRatio);
                            var newDPR = getWindowDPR();

                            var deltaIsBigger = absDeltaW > 2 && absDeltaH > 2;
                            var difference = !differenceIsBiggerThanOne(absDeltaWRatio, absDeltaHRatio);
                            var dprChanged = newDPR !== windowDpr && windowDpr > 0;
                            var isZoom = deltaIsBigger && difference && dprChanged;
                            var oldScrollbarSize = _base.nativeScrollbarSize;
                            var newScrollbarSize;

                            if (isZoom) {
                                bodyElement.append(scrollbarDummyElement);
                                newScrollbarSize = _base.nativeScrollbarSize = calcNativeScrollbarSize(scrollbarDummyElement[0]);
                                scrollbarDummyElement.remove();
                                if (oldScrollbarSize.x !== newScrollbarSize.x || oldScrollbarSize.y !== newScrollbarSize.y) {
                                    FRAMEWORK.each(INSTANCES(), function () {
                                        if (INSTANCES(this))
                                            INSTANCES(this).update('zoom');
                                    });
                                }
                            }

                            windowWidth = newW;
                            windowHeight = newH;
                            windowDpr = newDPR;
                        }
                    };

                    function differenceIsBiggerThanOne(valOne, valTwo) {
                        var absValOne = abs(valOne);
                        var absValTwo = abs(valTwo);
                        return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
                    }

                    function getWindowDPR() {
                        var dDPI = window.screen.deviceXDPI || 0;
                        var sDPI = window.screen.logicalXDPI || 1;
                        return window.devicePixelRatio || (dDPI / sDPI);
                    }

                    FRAMEWORK(window).on('resize', onResize);
                })();

                function calcNativeScrollbarSize(measureElement) {
                    return {
                        x: measureElement[LEXICON.oH] - measureElement[LEXICON.cH],
                        y: measureElement[LEXICON.oW] - measureElement[LEXICON.cW]
                    };
                }
            }

            /**
             * The object which manages the auto update loop for all OverlayScrollbars objects. This object is initialized only once: if the first OverlayScrollbars object gets initialized.
             * @constructor
             */
            function OverlayScrollbarsAutoUpdateLoop(globals) {
                var _base = this;
                var _inArray = FRAMEWORK.inArray;
                var _getNow = COMPATIBILITY.now;
                var _strAutoUpdate = 'autoUpdate';
                var _strAutoUpdateInterval = _strAutoUpdate + 'Interval';
                var _strLength = LEXICON.l;
                var _loopingInstances = [];
                var _loopingInstancesIntervalCache = [];
                var _loopIsActive = false;
                var _loopIntervalDefault = 33;
                var _loopInterval = _loopIntervalDefault;
                var _loopTimeOld = _getNow();
                var _loopID;


                /**
                 * The auto update loop which will run every 50 milliseconds or less if the update interval of a instance is lower than 50 milliseconds.
                 */
                var loop = function () {
                    if (_loopingInstances[_strLength] > 0 && _loopIsActive) {
                        _loopID = COMPATIBILITY.rAF()(function () {
                            loop();
                        });
                        var timeNew = _getNow();
                        var timeDelta = timeNew - _loopTimeOld;
                        var lowestInterval;
                        var instance;
                        var instanceOptions;
                        var instanceAutoUpdateAllowed;
                        var instanceAutoUpdateInterval;
                        var now;

                        if (timeDelta > _loopInterval) {
                            _loopTimeOld = timeNew - (timeDelta % _loopInterval);
                            lowestInterval = _loopIntervalDefault;
                            for (var i = 0; i < _loopingInstances[_strLength]; i++) {
                                instance = _loopingInstances[i];
                                if (instance !== undefined) {
                                    instanceOptions = instance.options();
                                    instanceAutoUpdateAllowed = instanceOptions[_strAutoUpdate];
                                    instanceAutoUpdateInterval = MATH.max(1, instanceOptions[_strAutoUpdateInterval]);
                                    now = _getNow();

                                    if ((instanceAutoUpdateAllowed === true || instanceAutoUpdateAllowed === null) && (now - _loopingInstancesIntervalCache[i]) > instanceAutoUpdateInterval) {
                                        instance.update('auto');
                                        _loopingInstancesIntervalCache[i] = new Date(now += instanceAutoUpdateInterval);
                                    }

                                    lowestInterval = MATH.max(1, MATH.min(lowestInterval, instanceAutoUpdateInterval));
                                }
                            }
                            _loopInterval = lowestInterval;
                        }
                    } else {
                        _loopInterval = _loopIntervalDefault;
                    }
                };

                /**
                 * Add OverlayScrollbars instance to the auto update loop. Only successful if the instance isn't already added.
                 * @param instance The instance which shall be updated in a loop automatically.
                 */
                _base.add = function (instance) {
                    if (_inArray(instance, _loopingInstances) === -1) {
                        _loopingInstances.push(instance);
                        _loopingInstancesIntervalCache.push(_getNow());
                        if (_loopingInstances[_strLength] > 0 && !_loopIsActive) {
                            _loopIsActive = true;
                            globals.autoUpdateLoop = _loopIsActive;
                            loop();
                        }
                    }
                };

                /**
                 * Remove OverlayScrollbars instance from the auto update loop. Only successful if the instance was added before.
                 * @param instance The instance which shall be updated in a loop automatically.
                 */
                _base.remove = function (instance) {
                    var index = _inArray(instance, _loopingInstances);
                    if (index > -1) {
                        //remove from loopingInstances list
                        _loopingInstancesIntervalCache.splice(index, 1);
                        _loopingInstances.splice(index, 1);

                        //correct update loop behavior
                        if (_loopingInstances[_strLength] === 0 && _loopIsActive) {
                            _loopIsActive = false;
                            globals.autoUpdateLoop = _loopIsActive;
                            if (_loopID !== undefined) {
                                COMPATIBILITY.cAF()(_loopID);
                                _loopID = -1;
                            }
                        }
                    }
                };
            }

            /**
             * A object which manages the scrollbars visibility of the target element.
             * @param pluginTargetElement The element from which the scrollbars shall be hidden.
             * @param options The custom options.
             * @param extensions The custom extensions.
             * @param globals
             * @param autoUpdateLoop
             * @returns {*}
             * @constructor
             */
            function OverlayScrollbarsInstance(pluginTargetElement, options, extensions, globals, autoUpdateLoop) {
                //shortcuts
                var type = COMPATIBILITY.type;
                var inArray = FRAMEWORK.inArray;
                var each = FRAMEWORK.each;

                //make correct instanceof
                var _base = new _plugin();
                var _frameworkProto = FRAMEWORK[LEXICON.p];

                //if passed element is no HTML element: skip and return
                if (!isHTMLElement(pluginTargetElement))
                    return;

                //if passed element is already initialized: set passed options if there are any and return its instance
                if (INSTANCES(pluginTargetElement)) {
                    var inst = INSTANCES(pluginTargetElement);
                    inst.options(options);
                    return inst;
                }

                //globals:
                var _nativeScrollbarIsOverlaid;
                var _overlayScrollbarDummySize;
                var _rtlScrollBehavior;
                var _autoUpdateRecommended;
                var _msieVersion;
                var _nativeScrollbarStyling;
                var _cssCalc;
                var _nativeScrollbarSize;
                var _supportTransition;
                var _supportTransform;
                var _supportPassiveEvents;
                var _supportResizeObserver;
                var _supportMutationObserver;
                var _restrictedMeasuring;

                //general readonly:
                var _initialized;
                var _destroyed;
                var _isTextarea;
                var _isBody;
                var _documentMixed;
                var _domExists;

                //general:
                var _isBorderBox;
                var _sizeAutoObserverAdded;
                var _paddingX;
                var _paddingY;
                var _borderX;
                var _borderY;
                var _marginX;
                var _marginY;
                var _isRTL;
                var _sleeping;
                var _contentBorderSize = {};
                var _scrollHorizontalInfo = {};
                var _scrollVerticalInfo = {};
                var _viewportSize = {};
                var _nativeScrollbarMinSize = {};

                //naming:	
                var _strMinusHidden = '-hidden';
                var _strMarginMinus = 'margin-';
                var _strPaddingMinus = 'padding-';
                var _strBorderMinus = 'border-';
                var _strTop = 'top';
                var _strRight = 'right';
                var _strBottom = 'bottom';
                var _strLeft = 'left';
                var _strMinMinus = 'min-';
                var _strMaxMinus = 'max-';
                var _strWidth = 'width';
                var _strHeight = 'height';
                var _strFloat = 'float';
                var _strEmpty = '';
                var _strAuto = 'auto';
                var _strSync = 'sync';
                var _strScroll = 'scroll';
                var _strHundredPercent = '100%';
                var _strX = 'x';
                var _strY = 'y';
                var _strDot = '.';
                var _strSpace = ' ';
                var _strScrollbar = 'scrollbar';
                var _strMinusHorizontal = '-horizontal';
                var _strMinusVertical = '-vertical';
                var _strScrollLeft = _strScroll + 'Left';
                var _strScrollTop = _strScroll + 'Top';
                var _strMouseTouchDownEvent = 'mousedown touchstart';
                var _strMouseTouchUpEvent = 'mouseup touchend touchcancel';
                var _strMouseTouchMoveEvent = 'mousemove touchmove';
                var _strMouseEnter = 'mouseenter';
                var _strMouseLeave = 'mouseleave';
                var _strKeyDownEvent = 'keydown';
                var _strKeyUpEvent = 'keyup';
                var _strSelectStartEvent = 'selectstart';
                var _strTransitionEndEvent = 'transitionend webkitTransitionEnd oTransitionEnd';
                var _strResizeObserverProperty = '__overlayScrollbarsRO__';

                //class names:	
                var _cassNamesPrefix = 'os-';
                var _classNameHTMLElement = _cassNamesPrefix + 'html';
                var _classNameHostElement = _cassNamesPrefix + 'host';
                var _classNameHostElementForeign = _classNameHostElement + '-foreign';
                var _classNameHostTextareaElement = _classNameHostElement + '-textarea';
                var _classNameHostScrollbarHorizontalHidden = _classNameHostElement + '-' + _strScrollbar + _strMinusHorizontal + _strMinusHidden;
                var _classNameHostScrollbarVerticalHidden = _classNameHostElement + '-' + _strScrollbar + _strMinusVertical + _strMinusHidden;
                var _classNameHostTransition = _classNameHostElement + '-transition';
                var _classNameHostRTL = _classNameHostElement + '-rtl';
                var _classNameHostResizeDisabled = _classNameHostElement + '-resize-disabled';
                var _classNameHostScrolling = _classNameHostElement + '-scrolling';
                var _classNameHostOverflow = _classNameHostElement + '-overflow';
                var _classNameHostOverflow = _classNameHostElement + '-overflow';
                var _classNameHostOverflowX = _classNameHostOverflow + '-x';
                var _classNameHostOverflowY = _classNameHostOverflow + '-y';
                var _classNameTextareaElement = _cassNamesPrefix + 'textarea';
                var _classNameTextareaCoverElement = _classNameTextareaElement + '-cover';
                var _classNamePaddingElement = _cassNamesPrefix + 'padding';
                var _classNameViewportElement = _cassNamesPrefix + 'viewport';
                var _classNameViewportNativeScrollbarsInvisible = _classNameViewportElement + '-native-scrollbars-invisible';
                var _classNameViewportNativeScrollbarsOverlaid = _classNameViewportElement + '-native-scrollbars-overlaid';
                var _classNameContentElement = _cassNamesPrefix + 'content';
                var _classNameContentArrangeElement = _cassNamesPrefix + 'content-arrange';
                var _classNameContentGlueElement = _cassNamesPrefix + 'content-glue';
                var _classNameSizeAutoObserverElement = _cassNamesPrefix + 'size-auto-observer';
                var _classNameResizeObserverElement = _cassNamesPrefix + 'resize-observer';
                var _classNameResizeObserverItemElement = _cassNamesPrefix + 'resize-observer-item';
                var _classNameResizeObserverItemFinalElement = _classNameResizeObserverItemElement + '-final';
                var _classNameTextInherit = _cassNamesPrefix + 'text-inherit';
                var _classNameScrollbar = _cassNamesPrefix + _strScrollbar;
                var _classNameScrollbarTrack = _classNameScrollbar + '-track';
                var _classNameScrollbarTrackOff = _classNameScrollbarTrack + '-off';
                var _classNameScrollbarHandle = _classNameScrollbar + '-handle';
                var _classNameScrollbarHandleOff = _classNameScrollbarHandle + '-off';
                var _classNameScrollbarUnusable = _classNameScrollbar + '-unusable';
                var _classNameScrollbarAutoHidden = _classNameScrollbar + '-' + _strAuto + _strMinusHidden;
                var _classNameScrollbarCorner = _classNameScrollbar + '-corner';
                var _classNameScrollbarCornerResize = _classNameScrollbarCorner + '-resize';
                var _classNameScrollbarCornerResizeB = _classNameScrollbarCornerResize + '-both';
                var _classNameScrollbarCornerResizeH = _classNameScrollbarCornerResize + _strMinusHorizontal;
                var _classNameScrollbarCornerResizeV = _classNameScrollbarCornerResize + _strMinusVertical;
                var _classNameScrollbarHorizontal = _classNameScrollbar + _strMinusHorizontal;
                var _classNameScrollbarVertical = _classNameScrollbar + _strMinusVertical;
                var _classNameDragging = _cassNamesPrefix + 'dragging';
                var _classNameThemeNone = _cassNamesPrefix + 'theme-none';
                var _classNamesDynamicDestroy = [
                    _classNameViewportNativeScrollbarsInvisible,
                    _classNameViewportNativeScrollbarsOverlaid,
                    _classNameScrollbarTrackOff,
                    _classNameScrollbarHandleOff,
                    _classNameScrollbarUnusable,
                    _classNameScrollbarAutoHidden,
                    _classNameScrollbarCornerResize,
                    _classNameScrollbarCornerResizeB,
                    _classNameScrollbarCornerResizeH,
                    _classNameScrollbarCornerResizeV,
                    _classNameDragging].join(_strSpace);

                //callbacks:	
                var _callbacksInitQeueue = [];

                //attrs viewport shall inherit from target	
                var _viewportAttrsFromTarget = [LEXICON.ti];

                //options:	
                var _defaultOptions;
                var _currentOptions;
                var _currentPreparedOptions;

                //extensions:	
                var _extensions = {};
                var _extensionsPrivateMethods = 'added removed on contract';

                //update	
                var _lastUpdateTime;
                var _swallowedUpdateHints = {};
                var _swallowedUpdateTimeout;
                var _swallowUpdateLag = 42;
                var _updateOnLoadEventName = 'load';
                var _updateOnLoadElms = [];

                //DOM elements:	
                var _windowElement;
                var _documentElement;
                var _htmlElement;
                var _bodyElement;
                var _targetElement;                     //the target element of this OverlayScrollbars object	
                var _hostElement;                       //the host element of this OverlayScrollbars object -> may be the same as targetElement	
                var _sizeAutoObserverElement;           //observes size auto changes	
                var _sizeObserverElement;               //observes size and padding changes	
                var _paddingElement;                    //manages the padding	
                var _viewportElement;                   //is the viewport of our scrollbar model	
                var _contentElement;                    //the element which holds the content	
                var _contentArrangeElement;             //is needed for correct sizing of the content element (only if native scrollbars are overlays)	
                var _contentGlueElement;                //has always the size of the content element	
                var _textareaCoverElement;              //only applied if target is a textarea element. Used for correct size calculation and for prevention of uncontrolled scrolling	
                var _scrollbarCornerElement;
                var _scrollbarHorizontalElement;
                var _scrollbarHorizontalTrackElement;
                var _scrollbarHorizontalHandleElement;
                var _scrollbarVerticalElement;
                var _scrollbarVerticalTrackElement;
                var _scrollbarVerticalHandleElement;
                var _windowElementNative;
                var _documentElementNative;
                var _targetElementNative;
                var _hostElementNative;
                var _sizeAutoObserverElementNative;
                var _sizeObserverElementNative;
                var _paddingElementNative;
                var _viewportElementNative;
                var _contentElementNative;

                //Cache:	
                var _hostSizeCache;
                var _contentScrollSizeCache;
                var _arrangeContentSizeCache;
                var _hasOverflowCache;
                var _hideOverflowCache;
                var _widthAutoCache;
                var _heightAutoCache;
                var _cssBoxSizingCache;
                var _cssPaddingCache;
                var _cssBorderCache;
                var _cssMarginCache;
                var _cssDirectionCache;
                var _cssDirectionDetectedCache;
                var _paddingAbsoluteCache;
                var _clipAlwaysCache;
                var _contentGlueSizeCache;
                var _overflowBehaviorCache;
                var _overflowAmountCache;
                var _ignoreOverlayScrollbarHidingCache;
                var _autoUpdateCache;
                var _sizeAutoCapableCache;
                var _contentElementScrollSizeChangeDetectedCache;
                var _hostElementSizeChangeDetectedCache;
                var _scrollbarsVisibilityCache;
                var _scrollbarsAutoHideCache;
                var _scrollbarsClickScrollingCache;
                var _scrollbarsDragScrollingCache;
                var _resizeCache;
                var _normalizeRTLCache;
                var _classNameCache;
                var _oldClassName;
                var _textareaAutoWrappingCache;
                var _textareaInfoCache;
                var _textareaSizeCache;
                var _textareaDynHeightCache;
                var _textareaDynWidthCache;
                var _bodyMinSizeCache;
                var _updateAutoCache = {};

                //MutationObserver:	
                var _mutationObserverHost;
                var _mutationObserverContent;
                var _mutationObserverHostCallback;
                var _mutationObserverContentCallback;
                var _mutationObserversConnected;
                var _mutationObserverAttrsTextarea = ['wrap', 'cols', 'rows'];
                var _mutationObserverAttrsHost = [LEXICON.i, LEXICON.c, LEXICON.s, 'open'].concat(_viewportAttrsFromTarget);

                //events:	
                var _destroyEvents = [];

                //textarea:	
                var _textareaHasFocus;

                //scrollbars:	
                var _scrollbarsAutoHideTimeoutId;
                var _scrollbarsAutoHideMoveTimeoutId;
                var _scrollbarsAutoHideDelay;
                var _scrollbarsAutoHideNever;
                var _scrollbarsAutoHideScroll;
                var _scrollbarsAutoHideMove;
                var _scrollbarsAutoHideLeave;
                var _scrollbarsHandleHovered;
                var _scrollbarsHandlesDefineScrollPos;

                //resize	
                var _resizeNone;
                var _resizeBoth;
                var _resizeHorizontal;
                var _resizeVertical;


                //==== Event Listener ====//	

                /**	
                 * Adds or removes a event listener from the given element. 	
                 * @param element The element to which the event listener shall be applied or removed.	
                 * @param eventNames The name(s) of the events.	
                 * @param listener The method which shall be called.	
                 * @param remove True if the handler shall be removed, false or undefined if the handler shall be added.	
                 * @param passiveOrOptions The options for the event.
                 */
                function setupResponsiveEventListener(element, eventNames, listener, remove, passiveOrOptions) {
                    var collected = COMPATIBILITY.isA(eventNames) && COMPATIBILITY.isA(listener);
                    var method = remove ? 'removeEventListener' : 'addEventListener';
                    var onOff = remove ? 'off' : 'on';
                    var events = collected ? false : eventNames.split(_strSpace)
                    var i = 0;

                    var passiveOrOptionsIsObj = FRAMEWORK.isPlainObject(passiveOrOptions);
                    var passive = (_supportPassiveEvents && (passiveOrOptionsIsObj ? (passiveOrOptions._passive) : passiveOrOptions)) || false;
                    var capture = passiveOrOptionsIsObj && (passiveOrOptions._capture || false);
                    var nativeParam = _supportPassiveEvents ? {
                        passive: passive,
                        capture: capture,
                    } : capture;

                    if (collected) {
                        for (; i < eventNames[LEXICON.l]; i++)
                            setupResponsiveEventListener(element, eventNames[i], listener[i], remove, passiveOrOptions);
                    }
                    else {
                        for (; i < events[LEXICON.l]; i++) {
                            if(_supportPassiveEvents) {
                                element[0][method](events[i], listener, nativeParam);
                            }
                            else {
                                element[onOff](events[i], listener);
                            }     
                        }
                    }
                }


                function addDestroyEventListener(element, eventNames, listener, passive) {
                    setupResponsiveEventListener(element, eventNames, listener, false, passive);
                    _destroyEvents.push(COMPATIBILITY.bind(setupResponsiveEventListener, 0, element, eventNames, listener, true, passive));
                }

                //==== Resize Observer ====//

                /**
                 * Adds or removes a resize observer from the given element.
                 * @param targetElement The element to which the resize observer shall be added or removed.
                 * @param onElementResizedCallback The callback which is fired every time the resize observer registers a size change or false / undefined if the resizeObserver shall be removed.
                 */
                function setupResizeObserver(targetElement, onElementResizedCallback) {
                    if (targetElement) {
                        var resizeObserver = COMPATIBILITY.rO();
                        var strAnimationStartEvent = 'animationstart mozAnimationStart webkitAnimationStart MSAnimationStart';
                        var strChildNodes = 'childNodes';
                        var constScroll = 3333333;
                        var callback = function () {
                            targetElement[_strScrollTop](constScroll)[_strScrollLeft](_isRTL ? _rtlScrollBehavior.n ? -constScroll : _rtlScrollBehavior.i ? 0 : constScroll : constScroll);
                            onElementResizedCallback();
                        };
                        //add resize observer:
                        if (onElementResizedCallback) {
                            if (_supportResizeObserver) {
                                var element = targetElement.addClass('observed').append(generateDiv(_classNameResizeObserverElement)).contents()[0];
                                var observer = element[_strResizeObserverProperty] = new resizeObserver(callback);
                                observer.observe(element);
                            }
                            else {
                                if (_msieVersion > 9 || !_autoUpdateRecommended) {
                                    targetElement.prepend(
                                        generateDiv(_classNameResizeObserverElement,
                                            generateDiv({ c: _classNameResizeObserverItemElement, dir: 'ltr' },
                                                generateDiv(_classNameResizeObserverItemElement,
                                                    generateDiv(_classNameResizeObserverItemFinalElement)
                                                ) +
                                                generateDiv(_classNameResizeObserverItemElement,
                                                    generateDiv({ c: _classNameResizeObserverItemFinalElement, style: 'width: 200%; height: 200%' })
                                                )
                                            )
                                        )
                                    );

                                    var observerElement = targetElement[0][strChildNodes][0][strChildNodes][0];
                                    var shrinkElement = FRAMEWORK(observerElement[strChildNodes][1]);
                                    var expandElement = FRAMEWORK(observerElement[strChildNodes][0]);
                                    var expandElementChild = FRAMEWORK(expandElement[0][strChildNodes][0]);
                                    var widthCache = observerElement[LEXICON.oW];
                                    var heightCache = observerElement[LEXICON.oH];
                                    var isDirty;
                                    var rAFId;
                                    var currWidth;
                                    var currHeight;
                                    var factor = 2;
                                    var nativeScrollbarSize = globals.nativeScrollbarSize; //care don't make changes to this object!!!
                                    var reset = function () {
                                        /*
                                         var sizeResetWidth = observerElement[LEXICON.oW] + nativeScrollbarSize.x * factor + nativeScrollbarSize.y * factor + _overlayScrollbarDummySize.x + _overlayScrollbarDummySize.y;
                                         var sizeResetHeight = observerElement[LEXICON.oH] + nativeScrollbarSize.x * factor + nativeScrollbarSize.y * factor + _overlayScrollbarDummySize.x + _overlayScrollbarDummySize.y;
                                         var expandChildCSS = {};
                                         expandChildCSS[_strWidth] = sizeResetWidth;
                                         expandChildCSS[_strHeight] = sizeResetHeight;
                                         expandElementChild.css(expandChildCSS);


                                         expandElement[_strScrollLeft](sizeResetWidth)[_strScrollTop](sizeResetHeight);
                                         shrinkElement[_strScrollLeft](sizeResetWidth)[_strScrollTop](sizeResetHeight);
                                         */
                                        expandElement[_strScrollLeft](constScroll)[_strScrollTop](constScroll);
                                        shrinkElement[_strScrollLeft](constScroll)[_strScrollTop](constScroll);
                                    };
                                    var onResized = function () {
                                        rAFId = 0;
                                        if (!isDirty)
                                            return;

                                        widthCache = currWidth;
                                        heightCache = currHeight;
                                        callback();
                                    };
                                    var onScroll = function (event) {
                                        currWidth = observerElement[LEXICON.oW];
                                        currHeight = observerElement[LEXICON.oH];
                                        isDirty = currWidth != widthCache || currHeight != heightCache;

                                        if (event && isDirty && !rAFId) {
                                            COMPATIBILITY.cAF()(rAFId);
                                            rAFId = COMPATIBILITY.rAF()(onResized);
                                        }
                                        else if (!event)
                                            onResized();

                                        reset();
                                        if (event) {
                                            COMPATIBILITY.prvD(event);
                                            COMPATIBILITY.stpP(event);
                                        }
                                        return false;
                                    };
                                    var expandChildCSS = {};
                                    var observerElementCSS = {};

                                    setTopRightBottomLeft(observerElementCSS, _strEmpty, [
                                        -((nativeScrollbarSize.y + 1) * factor),
                                        nativeScrollbarSize.x * -factor,
                                        nativeScrollbarSize.y * -factor,
                                        -((nativeScrollbarSize.x + 1) * factor)
                                    ]);

                                    FRAMEWORK(observerElement).css(observerElementCSS);
                                    expandElement.on(_strScroll, onScroll);
                                    shrinkElement.on(_strScroll, onScroll);
                                    targetElement.on(strAnimationStartEvent, function () {
                                        onScroll(false);
                                    });
                                    //lets assume that the divs will never be that large and a constant value is enough
                                    expandChildCSS[_strWidth] = constScroll;
                                    expandChildCSS[_strHeight] = constScroll;
                                    expandElementChild.css(expandChildCSS);

                                    reset();
                                }
                                else {
                                    var attachEvent = _documentElementNative.attachEvent;
                                    var isIE = _msieVersion !== undefined;
                                    if (attachEvent) {
                                        targetElement.prepend(generateDiv(_classNameResizeObserverElement));
                                        findFirst(targetElement, _strDot + _classNameResizeObserverElement)[0].attachEvent('onresize', callback);
                                    }
                                    else {
                                        var obj = _documentElementNative.createElement(TYPES.o);
                                        obj.setAttribute(LEXICON.ti, '-1');
                                        obj.setAttribute(LEXICON.c, _classNameResizeObserverElement);
                                        obj.onload = function () {
                                            var wnd = this.contentDocument.defaultView;
                                            wnd.addEventListener('resize', callback);
                                            wnd.document.documentElement.style.display = 'none';
                                        };
                                        obj.type = 'text/html';
                                        if (isIE)
                                            targetElement.prepend(obj);
                                        obj.data = 'about:blank';
                                        if (!isIE)
                                            targetElement.prepend(obj);
                                        targetElement.on(strAnimationStartEvent, callback);
                                    }
                                }
                            }

                            if (targetElement[0] === _sizeObserverElementNative) {
                                var directionChanged = function () {
                                    var dir = _hostElement.css('direction');
                                    var css = {};
                                    var scrollLeftValue = 0;
                                    var result = false;
                                    if (dir !== _cssDirectionDetectedCache) {
                                        if (dir === 'ltr') {
                                            css[_strLeft] = 0;
                                            css[_strRight] = _strAuto;
                                            scrollLeftValue = constScroll;
                                        }
                                        else {
                                            css[_strLeft] = _strAuto;
                                            css[_strRight] = 0;
                                            scrollLeftValue = _rtlScrollBehavior.n ? -constScroll : _rtlScrollBehavior.i ? 0 : constScroll;
                                        }
                                        //execution order is important for IE!!!
                                        _sizeObserverElement.children().eq(0).css(css);
                                        _sizeObserverElement[_strScrollLeft](scrollLeftValue)[_strScrollTop](constScroll);
                                        _cssDirectionDetectedCache = dir;
                                        result = true;
                                    }
                                    return result;
                                };
                                directionChanged();
                                addDestroyEventListener(targetElement, _strScroll, function (event) {
                                    if (directionChanged())
                                        update();
                                    COMPATIBILITY.prvD(event);
                                    COMPATIBILITY.stpP(event);
                                    return false;
                                });
                            }
                        }
                        //remove resize observer:
                        else {
                            if (_supportResizeObserver) {
                                var element = targetElement.contents()[0];
                                var resizeObserverObj = element[_strResizeObserverProperty];
                                if (resizeObserverObj) {
                                    resizeObserverObj.disconnect();
                                    delete element[_strResizeObserverProperty];
                                }
                            }
                            else {
                                remove(targetElement.children(_strDot + _classNameResizeObserverElement).eq(0));
                            }
                        }
                    }
                }

                /**
                 * Freezes or unfreezes the given resize observer.
                 * @param targetElement The element to which the target resize observer is applied.
                 * @param freeze True if the resize observer shall be frozen, false otherwise.
                 
                function freezeResizeObserver(targetElement, freeze) {
                    if (targetElement !== undefined) {
                        if(freeze) {
                            if (_supportResizeObserver) {
                                var element = targetElement.contents()[0];
                                element[_strResizeObserverProperty].unobserve(element);
                            }
                            else {
                                targetElement = targetElement.children(_strDot + _classNameResizeObserverElement).eq(0);
                                var w = targetElement.css(_strWidth);
                                var h = targetElement.css(_strHeight);
                                var css = {};
                                css[_strWidth] = w;
                                css[_strHeight] = h;
                                targetElement.css(css);
                            }
                        }
                        else {
                            if (_supportResizeObserver) {
                                var element = targetElement.contents()[0];
                                element[_strResizeObserverProperty].observe(element);
                            }
                            else {
                                var css = { };
                                css[_strHeight] = _strEmpty;
                                css[_strWidth] = _strEmpty;
                                targetElement.children(_strDot + _classNameResizeObserverElement).eq(0).css(css);
                            }
                        }
                    }
                }
                */


                //==== Mutation Observers ====//

                /**
                 * Creates MutationObservers for the host and content Element if they are supported.
                 */
                function createMutationObservers() {
                    if (_supportMutationObserver) {
                        var mutationObserverContentLag = 11;
                        var mutationObserver = COMPATIBILITY.mO();
                        var contentLastUpdate = COMPATIBILITY.now();
                        var mutationTarget;
                        var mutationAttrName;
                        var mutationIsClass;
                        var oldMutationVal;
                        var newClassVal;
                        var hostClassNameRegex;
                        var contentTimeout;
                        var now;
                        var sizeAuto;
                        var action;

                        _mutationObserverHostCallback = function (mutations) {

                            var doUpdate = false;
                            var doUpdateForce = false;
                            var mutation;
                            var mutatedAttrs = [];

                            if (_initialized && !_sleeping) {
                                each(mutations, function () {
                                    mutation = this;
                                    mutationTarget = mutation.target;
                                    mutationAttrName = mutation.attributeName;
                                    mutationIsClass = mutationAttrName === LEXICON.c;
                                    oldMutationVal = mutation.oldValue;
                                    newClassVal = mutationTarget.className;

                                    if (_domExists && mutationIsClass && !doUpdateForce) {
                                        // if old class value contains _classNameHostElementForeign and new class value doesn't
                                        if (oldMutationVal.indexOf(_classNameHostElementForeign) > -1 && newClassVal.indexOf(_classNameHostElementForeign) < 0) {
                                            hostClassNameRegex = createHostClassNameRegExp(true);
                                            _hostElementNative.className = newClassVal.split(_strSpace).concat(oldMutationVal.split(_strSpace).filter(function (name) {
                                                return name.match(hostClassNameRegex);
                                            })).join(_strSpace);
                                            doUpdate = doUpdateForce = true;
                                        }
                                    }

                                    if (!doUpdate) {
                                        doUpdate = mutationIsClass
                                            ? hostClassNamesChanged(oldMutationVal, newClassVal)
                                            : mutationAttrName === LEXICON.s
                                                ? oldMutationVal !== mutationTarget[LEXICON.s].cssText
                                                : true;
                                    }

                                    mutatedAttrs.push(mutationAttrName);
                                });

                                updateViewportAttrsFromTarget(mutatedAttrs);

                                if (doUpdate)
                                    _base.update(doUpdateForce || _strAuto);
                            }
                            return doUpdate;
                        };
                        _mutationObserverContentCallback = function (mutations) {
                            var doUpdate = false;
                            var mutation;

                            if (_initialized && !_sleeping) {
                                each(mutations, function () {
                                    mutation = this;
                                    doUpdate = isUnknownMutation(mutation);
                                    return !doUpdate;
                                });

                                if (doUpdate) {
                                    now = COMPATIBILITY.now();
                                    sizeAuto = (_heightAutoCache || _widthAutoCache);
                                    action = function () {
                                        if (!_destroyed) {
                                            contentLastUpdate = now;

                                            //if cols, rows or wrap attr was changed
                                            if (_isTextarea)
                                                textareaUpdate();

                                            if (sizeAuto)
                                                update();
                                            else
                                                _base.update(_strAuto);
                                        }
                                    };
                                    clearTimeout(contentTimeout);
                                    if (mutationObserverContentLag <= 0 || now - contentLastUpdate > mutationObserverContentLag || !sizeAuto)
                                        action();
                                    else
                                        contentTimeout = setTimeout(action, mutationObserverContentLag);
                                }
                            }
                            return doUpdate;
                        }

                        _mutationObserverHost = new mutationObserver(_mutationObserverHostCallback);
                        _mutationObserverContent = new mutationObserver(_mutationObserverContentCallback);
                    }
                }

                /**
                 * Connects the MutationObservers if they are supported.
                 */
                function connectMutationObservers() {
                    if (_supportMutationObserver && !_mutationObserversConnected) {
                        _mutationObserverHost.observe(_hostElementNative, {
                            attributes: true,
                            attributeOldValue: true,
                            attributeFilter: _mutationObserverAttrsHost
                        });

                        _mutationObserverContent.observe(_isTextarea ? _targetElementNative : _contentElementNative, {
                            attributes: true,
                            attributeOldValue: true,
                            subtree: !_isTextarea,
                            childList: !_isTextarea,
                            characterData: !_isTextarea,
                            attributeFilter: _isTextarea ? _mutationObserverAttrsTextarea : _mutationObserverAttrsHost
                        });

                        _mutationObserversConnected = true;
                    }
                }

                /**
                 * Disconnects the MutationObservers if they are supported.
                 */
                function disconnectMutationObservers() {
                    if (_supportMutationObserver && _mutationObserversConnected) {
                        _mutationObserverHost.disconnect();
                        _mutationObserverContent.disconnect();

                        _mutationObserversConnected = false;
                    }
                }


                //==== Events of elements ====//

                /**
                 * This method gets called every time the host element gets resized. IMPORTANT: Padding changes are detected too!!
                 * It refreshes the hostResizedEventArgs and the hostSizeResizeCache.
                 * If there are any size changes, the update method gets called.
                 */
                function hostOnResized() {
                    if (!_sleeping) {
                        var changed;
                        var hostSize = {
                            w: _sizeObserverElementNative[LEXICON.sW],
                            h: _sizeObserverElementNative[LEXICON.sH]
                        };

                        changed = checkCache(hostSize, _hostElementSizeChangeDetectedCache);
                        _hostElementSizeChangeDetectedCache = hostSize;
                        if (changed)
                            update({ _hostSizeChanged: true });
                    }
                }

                /**
                 * The mouse enter event of the host element. This event is only needed for the autoHide feature.
                 */
                function hostOnMouseEnter() {
                    if (_scrollbarsAutoHideLeave)
                        refreshScrollbarsAutoHide(true);
                }

                /**
                 * The mouse leave event of the host element. This event is only needed for the autoHide feature.
                 */
                function hostOnMouseLeave() {
                    if (_scrollbarsAutoHideLeave && !_bodyElement.hasClass(_classNameDragging))
                        refreshScrollbarsAutoHide(false);
                }

                /**
                 * The mouse move event of the host element. This event is only needed for the autoHide "move" feature.
                 */
                function hostOnMouseMove() {
                    if (_scrollbarsAutoHideMove) {
                        refreshScrollbarsAutoHide(true);
                        clearTimeout(_scrollbarsAutoHideMoveTimeoutId);
                        _scrollbarsAutoHideMoveTimeoutId = setTimeout(function () {
                            if (_scrollbarsAutoHideMove && !_destroyed)
                                refreshScrollbarsAutoHide(false);
                        }, 100);
                    }
                }

                /**
                 * Prevents text from deselection if attached to the document element on the mousedown event of a DOM element.
                 * @param event The select start event.
                 */
                function documentOnSelectStart(event) {
                    COMPATIBILITY.prvD(event);
                    return false;
                }

                /**	
                 * A callback which will be called after a element has loaded.	
                 */
                function updateOnLoadCallback(event) {
                    var elm = FRAMEWORK(event.target);

                    eachUpdateOnLoad(function (i, updateOnLoadSelector) {
                        if (elm.is(updateOnLoadSelector)) {
                            update({ _contentSizeChanged: true });
                        }
                    });
                }

                /**
                * Adds or removes mouse & touch events of the host element. (for handling auto-hiding of the scrollbars)
                * @param destroy Indicates whether the events shall be added or removed.
                */
                function setupHostMouseTouchEvents(destroy) {
                    if (!destroy)
                        setupHostMouseTouchEvents(true);

                    setupResponsiveEventListener(_hostElement,
                        _strMouseTouchMoveEvent.split(_strSpace)[0],
                        hostOnMouseMove,
                        (!_scrollbarsAutoHideMove || destroy), true);
                    setupResponsiveEventListener(_hostElement,
                        [_strMouseEnter, _strMouseLeave],
                        [hostOnMouseEnter, hostOnMouseLeave],
                        (!_scrollbarsAutoHideLeave || destroy), true);

                    //if the plugin is initialized and the mouse is over the host element, make the scrollbars visible
                    if (!_initialized && !destroy)
                        _hostElement.one('mouseover', hostOnMouseEnter);
                }


                //==== Update Detection ====//

                /**
                 * Measures the min width and min height of the body element and refreshes the related cache.
                 * @returns {boolean} True if the min width or min height has changed, false otherwise.
                 */
                function bodyMinSizeChanged() {
                    var bodyMinSize = {};
                    if (_isBody && _contentArrangeElement) {
                        bodyMinSize.w = parseToZeroOrNumber(_contentArrangeElement.css(_strMinMinus + _strWidth));
                        bodyMinSize.h = parseToZeroOrNumber(_contentArrangeElement.css(_strMinMinus + _strHeight));
                        bodyMinSize.c = checkCache(bodyMinSize, _bodyMinSizeCache);
                        bodyMinSize.f = true; //flag for "measured at least once"
                    }
                    _bodyMinSizeCache = bodyMinSize;
                    return !!bodyMinSize.c;
                }

                /**
                 * Returns true if the class names really changed (new class without plugin host prefix)
                 * @param oldClassNames The old ClassName string or array.
                 * @param newClassNames The new ClassName string or array.
                 * @returns {boolean} True if the class names has really changed, false otherwise.
                 */
                function hostClassNamesChanged(oldClassNames, newClassNames) {
                    var currClasses = typeof newClassNames == TYPES.s ? newClassNames.split(_strSpace) : [];
                    var oldClasses = typeof oldClassNames == TYPES.s ? oldClassNames.split(_strSpace) : [];
                    var diff = getArrayDifferences(oldClasses, currClasses);

                    // remove none theme from diff list to prevent update
                    var idx = inArray(_classNameThemeNone, diff);
                    var i;
                    var regex;

                    if (idx > -1)
                        diff.splice(idx, 1);

                    if (diff[LEXICON.l] > 0) {
                        regex = createHostClassNameRegExp(true, true);
                        for (i = 0; i < diff.length; i++) {
                            if (!diff[i].match(regex)) {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                /**
                 * Returns true if the given mutation is not from a from the plugin generated element. If the target element is a textarea the mutation is always unknown.
                 * @param mutation The mutation which shall be checked.
                 * @returns {boolean} True if the mutation is from a unknown element, false otherwise.
                 */
                function isUnknownMutation(mutation) {
                    var attributeName = mutation.attributeName;
                    var mutationTarget = mutation.target;
                    var mutationType = mutation.type;
                    var strClosest = 'closest';

                    if (mutationTarget === _contentElementNative)
                        return attributeName === null;
                    if (mutationType === 'attributes' && (attributeName === LEXICON.c || attributeName === LEXICON.s) && !_isTextarea) {
                        //ignore className changes by the plugin	
                        if (attributeName === LEXICON.c && FRAMEWORK(mutationTarget).hasClass(_classNameHostElement))
                            return hostClassNamesChanged(mutation.oldValue, mutationTarget.className);

                        //only do it of browser support it natively	
                        if (typeof mutationTarget[strClosest] != TYPES.f)
                            return true;
                        if (mutationTarget[strClosest](_strDot + _classNameResizeObserverElement) !== null ||
                            mutationTarget[strClosest](_strDot + _classNameScrollbar) !== null ||
                            mutationTarget[strClosest](_strDot + _classNameScrollbarCorner) !== null)
                            return false;
                    }
                    return true;
                }

                /**
                 * Returns true if the content size was changed since the last time this method was called.
                 * @returns {boolean} True if the content size was changed, false otherwise.
                 */
                function updateAutoContentSizeChanged() {
                    if (_sleeping)
                        return false;

                    var contentMeasureElement = getContentMeasureElement();
                    var textareaValueLength = _isTextarea && _widthAutoCache && !_textareaAutoWrappingCache ? _targetElement.val().length : 0;
                    var setCSS = !_mutationObserversConnected && _widthAutoCache && !_isTextarea;
                    var css = {};
                    var float;
                    var bodyMinSizeC;
                    var changed;
                    var contentElementScrollSize;

                    if (setCSS) {
                        float = _contentElement.css(_strFloat);
                        css[_strFloat] = _isRTL ? _strRight : _strLeft;
                        css[_strWidth] = _strAuto;
                        _contentElement.css(css);
                    }
                    contentElementScrollSize = {
                        w: contentMeasureElement[LEXICON.sW] + textareaValueLength,
                        h: contentMeasureElement[LEXICON.sH] + textareaValueLength
                    };
                    if (setCSS) {
                        css[_strFloat] = float;
                        css[_strWidth] = _strHundredPercent;
                        _contentElement.css(css);
                    }

                    bodyMinSizeC = bodyMinSizeChanged();
                    changed = checkCache(contentElementScrollSize, _contentElementScrollSizeChangeDetectedCache);

                    _contentElementScrollSizeChangeDetectedCache = contentElementScrollSize;

                    return changed || bodyMinSizeC;
                }

                /**
                 * Returns true when a attribute which the MutationObserver would observe has changed.  
                 * @returns {boolean} True if one of the attributes which a MutationObserver would observe has changed, false or undefined otherwise.
                 */
                function meaningfulAttrsChanged() {
                    if (_sleeping || _mutationObserversConnected)
                        return;

                    var elem;
                    var curr;
                    var cache;
                    var changedAttrs = [];
                    var checks = [
                        {
                            _elem: _hostElement,
                            _attrs: _mutationObserverAttrsHost.concat(':visible')
                        },
                        {
                            _elem: _isTextarea ? _targetElement : undefined,
                            _attrs: _mutationObserverAttrsTextarea
                        }
                    ];

                    each(checks, function (index, check) {
                        elem = check._elem;
                        if (elem) {
                            each(check._attrs, function (index, attr) {
                                curr = attr.charAt(0) === ':' ? elem.is(attr) : elem.attr(attr);
                                cache = _updateAutoCache[attr];

                                if (checkCache(curr, cache)) {
                                    changedAttrs.push(attr);
                                }

                                _updateAutoCache[attr] = curr;
                            });
                        }
                    });

                    updateViewportAttrsFromTarget(changedAttrs);

                    return changedAttrs[LEXICON.l] > 0;
                }

                /**
                 * Checks is a CSS Property of a child element is affecting the scroll size of the content.
                 * @param propertyName The CSS property name.
                 * @returns {boolean} True if the property is affecting the content scroll size, false otherwise.
                 */
                function isSizeAffectingCSSProperty(propertyName) {
                    if (!_initialized)
                        return true;
                    var flexGrow = 'flex-grow';
                    var flexShrink = 'flex-shrink';
                    var flexBasis = 'flex-basis';
                    var affectingPropsX = [
                        _strWidth,
                        _strMinMinus + _strWidth,
                        _strMaxMinus + _strWidth,
                        _strMarginMinus + _strLeft,
                        _strMarginMinus + _strRight,
                        _strLeft,
                        _strRight,
                        'font-weight',
                        'word-spacing',
                        flexGrow,
                        flexShrink,
                        flexBasis
                    ];
                    var affectingPropsXContentBox = [
                        _strPaddingMinus + _strLeft,
                        _strPaddingMinus + _strRight,
                        _strBorderMinus + _strLeft + _strWidth,
                        _strBorderMinus + _strRight + _strWidth
                    ];
                    var affectingPropsY = [
                        _strHeight,
                        _strMinMinus + _strHeight,
                        _strMaxMinus + _strHeight,
                        _strMarginMinus + _strTop,
                        _strMarginMinus + _strBottom,
                        _strTop,
                        _strBottom,
                        'line-height',
                        flexGrow,
                        flexShrink,
                        flexBasis
                    ];
                    var affectingPropsYContentBox = [
                        _strPaddingMinus + _strTop,
                        _strPaddingMinus + _strBottom,
                        _strBorderMinus + _strTop + _strWidth,
                        _strBorderMinus + _strBottom + _strWidth
                    ];
                    var _strS = 's';
                    var _strVS = 'v-s';
                    var checkX = _overflowBehaviorCache.x === _strS || _overflowBehaviorCache.x === _strVS;
                    var checkY = _overflowBehaviorCache.y === _strS || _overflowBehaviorCache.y === _strVS;
                    var sizeIsAffected = false;
                    var checkPropertyName = function (arr, name) {
                        for (var i = 0; i < arr[LEXICON.l]; i++) {
                            if (arr[i] === name)
                                return true;
                        }
                        return false;
                    };

                    if (checkY) {
                        sizeIsAffected = checkPropertyName(affectingPropsY, propertyName);
                        if (!sizeIsAffected && !_isBorderBox)
                            sizeIsAffected = checkPropertyName(affectingPropsYContentBox, propertyName);
                    }
                    if (checkX && !sizeIsAffected) {
                        sizeIsAffected = checkPropertyName(affectingPropsX, propertyName);
                        if (!sizeIsAffected && !_isBorderBox)
                            sizeIsAffected = checkPropertyName(affectingPropsXContentBox, propertyName);
                    }
                    return sizeIsAffected;
                }


                //==== Update ====//

                /**
                 * Sets the attribute values of the viewport element to the values from the target element.
                 * The value of a attribute is only set if the attribute is whitelisted.
                 * @attrs attrs The array of attributes which shall be set or undefined if all whitelisted shall be set.
                 */
                function updateViewportAttrsFromTarget(attrs) {
                    attrs = attrs || _viewportAttrsFromTarget;
                    each(attrs, function (index, attr) {
                        if (COMPATIBILITY.inA(attr, _viewportAttrsFromTarget) > -1) {
                            var targetAttr = _targetElement.attr(attr);
                            if (type(targetAttr) == TYPES.s) {
                                _viewportElement.attr(attr, targetAttr);
                            }
                            else {
                                _viewportElement.removeAttr(attr);
                            }
                        }
                    });
                }

                /**
                 * Updates the variables and size of the textarea element, and manages the scroll on new line or new character.
                 */
                function textareaUpdate() {
                    if (!_sleeping) {
                        var wrapAttrOff = !_textareaAutoWrappingCache;
                        var minWidth = _viewportSize.w;
                        var minHeight = _viewportSize.h;
                        var css = {};
                        var doMeasure = _widthAutoCache || wrapAttrOff;
                        var origWidth;
                        var width;
                        var origHeight;
                        var height;

                        //reset min size
                        css[_strMinMinus + _strWidth] = _strEmpty;
                        css[_strMinMinus + _strHeight] = _strEmpty;

                        //set width auto
                        css[_strWidth] = _strAuto;
                        _targetElement.css(css);

                        //measure width
                        origWidth = _targetElementNative[LEXICON.oW];
                        width = doMeasure ? MATH.max(origWidth, _targetElementNative[LEXICON.sW] - 1) : 1;
                        /*width += (_widthAutoCache ? _marginX + (!_isBorderBox ? wrapAttrOff ? 0 : _paddingX + _borderX : 0) : 0);*/

                        //set measured width
                        css[_strWidth] = _widthAutoCache ? _strAuto /*width*/ : _strHundredPercent;
                        css[_strMinMinus + _strWidth] = _strHundredPercent;

                        //set height auto
                        css[_strHeight] = _strAuto;
                        _targetElement.css(css);

                        //measure height
                        origHeight = _targetElementNative[LEXICON.oH];
                        height = MATH.max(origHeight, _targetElementNative[LEXICON.sH] - 1);

                        //append correct size values
                        css[_strWidth] = width;
                        css[_strHeight] = height;
                        _textareaCoverElement.css(css);

                        //apply min width / min height to prevent textarea collapsing
                        css[_strMinMinus + _strWidth] = minWidth /*+ (!_isBorderBox && _widthAutoCache ? _paddingX + _borderX : 0)*/;
                        css[_strMinMinus + _strHeight] = minHeight /*+ (!_isBorderBox && _heightAutoCache ? _paddingY + _borderY : 0)*/;
                        _targetElement.css(css);

                        return {
                            _originalWidth: origWidth,
                            _originalHeight: origHeight,
                            _dynamicWidth: width,
                            _dynamicHeight: height
                        };
                    }
                }

                /**
                 * Updates the plugin and DOM to the current options.
                 * This method should only be called if a update is 100% required.
                 * @param updateHints A objects which contains hints for this update:
                 * {
                 *   _hostSizeChanged : boolean,
                 *   _contentSizeChanged : boolean,
                 *   _force : boolean,                             == preventSwallowing
                 *   _changedOptions : { },                        == preventSwallowing && preventSleep
                *  }
                 */
                function update(updateHints) {
                    clearTimeout(_swallowedUpdateTimeout);
                    updateHints = updateHints || {};
                    _swallowedUpdateHints._hostSizeChanged |= updateHints._hostSizeChanged;
                    _swallowedUpdateHints._contentSizeChanged |= updateHints._contentSizeChanged;
                    _swallowedUpdateHints._force |= updateHints._force;

                    var now = COMPATIBILITY.now();
                    var hostSizeChanged = !!_swallowedUpdateHints._hostSizeChanged;
                    var contentSizeChanged = !!_swallowedUpdateHints._contentSizeChanged;
                    var force = !!_swallowedUpdateHints._force;
                    var changedOptions = updateHints._changedOptions;
                    var swallow = _swallowUpdateLag > 0 && _initialized && !_destroyed && !force && !changedOptions && (now - _lastUpdateTime) < _swallowUpdateLag && (!_heightAutoCache && !_widthAutoCache);
                    var displayIsHidden;

                    if (swallow)
                        _swallowedUpdateTimeout = setTimeout(update, _swallowUpdateLag);

                    //abort update due to:
                    //destroyed
                    //swallowing
                    //sleeping
                    //host is hidden or has false display
                    if (_destroyed || swallow || (_sleeping && !changedOptions) || (_initialized && !force && (displayIsHidden = _hostElement.is(':hidden'))) || _hostElement.css('display') === 'inline')
                        return;

                    _lastUpdateTime = now;
                    _swallowedUpdateHints = {};

                    //if scrollbar styling is possible and native scrollbars aren't overlaid the scrollbar styling will be applied which hides the native scrollbars completely.
                    if (_nativeScrollbarStyling && !(_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y)) {
                        //native scrollbars are hidden, so change the values to zero
                        _nativeScrollbarSize.x = 0;
                        _nativeScrollbarSize.y = 0;
                    }
                    else {
                        //refresh native scrollbar size (in case of zoom)
                        _nativeScrollbarSize = extendDeep({}, globals.nativeScrollbarSize);
                    }

                    // Scrollbar padding is needed for firefox, because firefox hides scrollbar automatically if the size of the div is too small.
                    // The calculation: [scrollbar size +3 *3]
                    // (+3 because of possible decoration e.g. borders, margins etc., but only if native scrollbar is NOT a overlaid scrollbar)
                    // (*3 because (1)increase / (2)decrease -button and (3)resize handle)
                    _nativeScrollbarMinSize = {
                        x: (_nativeScrollbarSize.x + (_nativeScrollbarIsOverlaid.x ? 0 : 3)) * 3,
                        y: (_nativeScrollbarSize.y + (_nativeScrollbarIsOverlaid.y ? 0 : 3)) * 3
                    };

                    changedOptions = changedOptions || {};
                    //freezeResizeObserver(_sizeObserverElement, true);
                    //freezeResizeObserver(_sizeAutoObserverElement, true);

                    var checkCacheAutoForce = function () {
                        return checkCache.apply(this, [].slice.call(arguments).concat([force]));
                    };

                    //save current scroll offset
                    var currScroll = {
                        x: _viewportElement[_strScrollLeft](),
                        y: _viewportElement[_strScrollTop]()
                    };

                    var currentPreparedOptionsScrollbars = _currentPreparedOptions.scrollbars;
                    var currentPreparedOptionsTextarea = _currentPreparedOptions.textarea;

                    //scrollbars visibility:
                    var scrollbarsVisibility = currentPreparedOptionsScrollbars.visibility;
                    var scrollbarsVisibilityChanged = checkCacheAutoForce(scrollbarsVisibility, _scrollbarsVisibilityCache);

                    //scrollbars autoHide:
                    var scrollbarsAutoHide = currentPreparedOptionsScrollbars.autoHide;
                    var scrollbarsAutoHideChanged = checkCacheAutoForce(scrollbarsAutoHide, _scrollbarsAutoHideCache);

                    //scrollbars click scrolling
                    var scrollbarsClickScrolling = currentPreparedOptionsScrollbars.clickScrolling;
                    var scrollbarsClickScrollingChanged = checkCacheAutoForce(scrollbarsClickScrolling, _scrollbarsClickScrollingCache);

                    //scrollbars drag scrolling
                    var scrollbarsDragScrolling = currentPreparedOptionsScrollbars.dragScrolling;
                    var scrollbarsDragScrollingChanged = checkCacheAutoForce(scrollbarsDragScrolling, _scrollbarsDragScrollingCache);

                    //className
                    var className = _currentPreparedOptions.className;
                    var classNameChanged = checkCacheAutoForce(className, _classNameCache);

                    //resize
                    var resize = _currentPreparedOptions.resize;
                    var resizeChanged = checkCacheAutoForce(resize, _resizeCache) && !_isBody; //body can't be resized since the window itself acts as resize possibility.

                    //paddingAbsolute
                    var paddingAbsolute = _currentPreparedOptions.paddingAbsolute;
                    var paddingAbsoluteChanged = checkCacheAutoForce(paddingAbsolute, _paddingAbsoluteCache);

                    //clipAlways
                    var clipAlways = _currentPreparedOptions.clipAlways;
                    var clipAlwaysChanged = checkCacheAutoForce(clipAlways, _clipAlwaysCache);

                    //sizeAutoCapable
                    var sizeAutoCapable = _currentPreparedOptions.sizeAutoCapable && !_isBody; //body can never be size auto, because it shall be always as big as the viewport.
                    var sizeAutoCapableChanged = checkCacheAutoForce(sizeAutoCapable, _sizeAutoCapableCache);

                    //showNativeScrollbars
                    var ignoreOverlayScrollbarHiding = _currentPreparedOptions.nativeScrollbarsOverlaid.showNativeScrollbars;
                    var ignoreOverlayScrollbarHidingChanged = checkCacheAutoForce(ignoreOverlayScrollbarHiding, _ignoreOverlayScrollbarHidingCache);

                    //autoUpdate
                    var autoUpdate = _currentPreparedOptions.autoUpdate;
                    var autoUpdateChanged = checkCacheAutoForce(autoUpdate, _autoUpdateCache);

                    //overflowBehavior
                    var overflowBehavior = _currentPreparedOptions.overflowBehavior;
                    var overflowBehaviorChanged = checkCacheAutoForce(overflowBehavior, _overflowBehaviorCache, force);

                    //dynWidth:
                    var textareaDynWidth = currentPreparedOptionsTextarea.dynWidth;
                    var textareaDynWidthChanged = checkCacheAutoForce(_textareaDynWidthCache, textareaDynWidth);

                    //dynHeight:
                    var textareaDynHeight = currentPreparedOptionsTextarea.dynHeight;
                    var textareaDynHeightChanged = checkCacheAutoForce(_textareaDynHeightCache, textareaDynHeight);

                    //scrollbars visibility
                    _scrollbarsAutoHideNever = scrollbarsAutoHide === 'n';
                    _scrollbarsAutoHideScroll = scrollbarsAutoHide === 's';
                    _scrollbarsAutoHideMove = scrollbarsAutoHide === 'm';
                    _scrollbarsAutoHideLeave = scrollbarsAutoHide === 'l';

                    //scrollbars autoHideDelay
                    _scrollbarsAutoHideDelay = currentPreparedOptionsScrollbars.autoHideDelay;

                    //old className
                    _oldClassName = _classNameCache;

                    //resize
                    _resizeNone = resize === 'n';
                    _resizeBoth = resize === 'b';
                    _resizeHorizontal = resize === 'h';
                    _resizeVertical = resize === 'v';

                    //normalizeRTL
                    _normalizeRTLCache = _currentPreparedOptions.normalizeRTL;

                    //ignore overlay scrollbar hiding
                    ignoreOverlayScrollbarHiding = ignoreOverlayScrollbarHiding && (_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y);

                    //refresh options cache
                    _scrollbarsVisibilityCache = scrollbarsVisibility;
                    _scrollbarsAutoHideCache = scrollbarsAutoHide;
                    _scrollbarsClickScrollingCache = scrollbarsClickScrolling;
                    _scrollbarsDragScrollingCache = scrollbarsDragScrolling;
                    _classNameCache = className;
                    _resizeCache = resize;
                    _paddingAbsoluteCache = paddingAbsolute;
                    _clipAlwaysCache = clipAlways;
                    _sizeAutoCapableCache = sizeAutoCapable;
                    _ignoreOverlayScrollbarHidingCache = ignoreOverlayScrollbarHiding;
                    _autoUpdateCache = autoUpdate;
                    _overflowBehaviorCache = extendDeep({}, overflowBehavior);
                    _textareaDynWidthCache = textareaDynWidth;
                    _textareaDynHeightCache = textareaDynHeight;
                    _hasOverflowCache = _hasOverflowCache || { x: false, y: false };

                    //set correct class name to the host element
                    if (classNameChanged) {
                        removeClass(_hostElement, _oldClassName + _strSpace + _classNameThemeNone);
                        addClass(_hostElement, className !== undefined && className !== null && className.length > 0 ? className : _classNameThemeNone);
                    }

                    //set correct auto Update
                    if (autoUpdateChanged) {
                        if (autoUpdate === true || (autoUpdate === null && _autoUpdateRecommended)) {
                            disconnectMutationObservers();
                            autoUpdateLoop.add(_base);
                        }
                        else {
                            autoUpdateLoop.remove(_base);
                            connectMutationObservers();
                        }
                    }

                    //activate or deactivate size auto capability
                    if (sizeAutoCapableChanged) {
                        if (sizeAutoCapable) {
                            if (_contentGlueElement) {
                                _contentGlueElement.show();
                            }
                            else {
                                _contentGlueElement = FRAMEWORK(generateDiv(_classNameContentGlueElement));
                                _paddingElement.before(_contentGlueElement);
                            }
                            if (_sizeAutoObserverAdded) {
                                _sizeAutoObserverElement.show();
                            }
                            else {
                                _sizeAutoObserverElement = FRAMEWORK(generateDiv(_classNameSizeAutoObserverElement));
                                _sizeAutoObserverElementNative = _sizeAutoObserverElement[0];

                                _contentGlueElement.before(_sizeAutoObserverElement);
                                var oldSize = { w: -1, h: -1 };
                                setupResizeObserver(_sizeAutoObserverElement, function () {
                                    var newSize = {
                                        w: _sizeAutoObserverElementNative[LEXICON.oW],
                                        h: _sizeAutoObserverElementNative[LEXICON.oH]
                                    };
                                    if (checkCache(newSize, oldSize)) {
                                        if (_initialized && (_heightAutoCache && newSize.h > 0) || (_widthAutoCache && newSize.w > 0)) {
                                            update();
                                        }
                                        else if (_initialized && (!_heightAutoCache && newSize.h === 0) || (!_widthAutoCache && newSize.w === 0)) {
                                            update();
                                        }
                                    }
                                    oldSize = newSize;
                                });
                                _sizeAutoObserverAdded = true;
                                //fix heightAuto detector bug if height is fixed but contentHeight is 0.
                                //the probability this bug will ever happen is very very low, thats why its ok if we use calc which isn't supported in IE8.
                                if (_cssCalc !== null)
                                    _sizeAutoObserverElement.css(_strHeight, _cssCalc + '(100% + 1px)');
                            }
                        }
                        else {
                            if (_sizeAutoObserverAdded)
                                _sizeAutoObserverElement.hide();
                            if (_contentGlueElement)
                                _contentGlueElement.hide();
                        }
                    }

                    //if force, update all resizeObservers too
                    if (force) {
                        _sizeObserverElement.find('*').trigger(_strScroll);
                        if (_sizeAutoObserverAdded)
                            _sizeAutoObserverElement.find('*').trigger(_strScroll);
                    }

                    //display hidden:
                    displayIsHidden = displayIsHidden === undefined ? _hostElement.is(':hidden') : displayIsHidden;

                    //textarea AutoWrapping:
                    var textareaAutoWrapping = _isTextarea ? _targetElement.attr('wrap') !== 'off' : false;
                    var textareaAutoWrappingChanged = checkCacheAutoForce(textareaAutoWrapping, _textareaAutoWrappingCache);

                    //detect direction:
                    var cssDirection = _hostElement.css('direction');
                    var cssDirectionChanged = checkCacheAutoForce(cssDirection, _cssDirectionCache);

                    //detect box-sizing:
                    var boxSizing = _hostElement.css('box-sizing');
                    var boxSizingChanged = checkCacheAutoForce(boxSizing, _cssBoxSizingCache);

                    //detect padding:
                    var padding = getTopRightBottomLeftHost(_strPaddingMinus);

                    //width + height auto detecting var:
                    var sizeAutoObserverElementBCRect;
                    //exception occurs in IE8 sometimes (unknown exception)
                    try {
                        sizeAutoObserverElementBCRect = _sizeAutoObserverAdded ? _sizeAutoObserverElementNative[LEXICON.bCR]() : null;
                    } catch (ex) {
                        return;
                    }

                    _isRTL = cssDirection === 'rtl';
                    _isBorderBox = (boxSizing === 'border-box');
                    var isRTLLeft = _isRTL ? _strLeft : _strRight;
                    var isRTLRight = _isRTL ? _strRight : _strLeft;

                    //detect width auto:
                    var widthAutoResizeDetection = false;
                    var widthAutoObserverDetection = (_sizeAutoObserverAdded && (_hostElement.css(_strFloat) !== 'none' /*|| _isTextarea */)) ? (MATH.round(sizeAutoObserverElementBCRect.right - sizeAutoObserverElementBCRect.left) === 0) && (!paddingAbsolute ? (_hostElementNative[LEXICON.cW] - _paddingX) > 0 : true) : false;
                    if (sizeAutoCapable && !widthAutoObserverDetection) {
                        var tmpCurrHostWidth = _hostElementNative[LEXICON.oW];
                        var tmpCurrContentGlueWidth = _contentGlueElement.css(_strWidth);
                        _contentGlueElement.css(_strWidth, _strAuto);

                        var tmpNewHostWidth = _hostElementNative[LEXICON.oW];
                        _contentGlueElement.css(_strWidth, tmpCurrContentGlueWidth);
                        widthAutoResizeDetection = tmpCurrHostWidth !== tmpNewHostWidth;
                        if (!widthAutoResizeDetection) {
                            _contentGlueElement.css(_strWidth, tmpCurrHostWidth + 1);
                            tmpNewHostWidth = _hostElementNative[LEXICON.oW];
                            _contentGlueElement.css(_strWidth, tmpCurrContentGlueWidth);
                            widthAutoResizeDetection = tmpCurrHostWidth !== tmpNewHostWidth;
                        }
                    }
                    var widthAuto = (widthAutoObserverDetection || widthAutoResizeDetection) && sizeAutoCapable && !displayIsHidden;
                    var widthAutoChanged = checkCacheAutoForce(widthAuto, _widthAutoCache);
                    var wasWidthAuto = !widthAuto && _widthAutoCache;

                    //detect height auto:
                    var heightAuto = _sizeAutoObserverAdded && sizeAutoCapable && !displayIsHidden ? (MATH.round(sizeAutoObserverElementBCRect.bottom - sizeAutoObserverElementBCRect.top) === 0) /* && (!paddingAbsolute && (_msieVersion > 9 || !_msieVersion) ? true : true) */ : false;
                    var heightAutoChanged = checkCacheAutoForce(heightAuto, _heightAutoCache);
                    var wasHeightAuto = !heightAuto && _heightAutoCache;

                    //detect border:
                    //we need the border only if border box and auto size
                    var updateBorderX = (widthAuto && _isBorderBox) || !_isBorderBox;
                    var updateBorderY = (heightAuto && _isBorderBox) || !_isBorderBox;
                    var border = getTopRightBottomLeftHost(_strBorderMinus, '-' + _strWidth, !updateBorderX, !updateBorderY)

                    //detect margin:
                    var margin = getTopRightBottomLeftHost(_strMarginMinus);

                    //vars to apply correct css
                    var contentElementCSS = {};
                    var contentGlueElementCSS = {};

                    //funcs
                    var getHostSize = function () {
                        //has to be clientSize because offsetSize respect borders
                        return {
                            w: _hostElementNative[LEXICON.cW],
                            h: _hostElementNative[LEXICON.cH]
                        };
                    };
                    var getViewportSize = function () {
                        //viewport size is padding container because it never has padding, margin and a border
                        //determine zoom rounding error -> sometimes scrollWidth/Height is smaller than clientWidth/Height
                        //if this happens add the difference to the viewportSize to compensate the rounding error
                        return {
                            w: _paddingElementNative[LEXICON.oW] + MATH.max(0, _contentElementNative[LEXICON.cW] - _contentElementNative[LEXICON.sW]),
                            h: _paddingElementNative[LEXICON.oH] + MATH.max(0, _contentElementNative[LEXICON.cH] - _contentElementNative[LEXICON.sH])
                        };
                    };

                    //set info for padding
                    var paddingAbsoluteX = _paddingX = padding.l + padding.r;
                    var paddingAbsoluteY = _paddingY = padding.t + padding.b;
                    paddingAbsoluteX *= paddingAbsolute ? 1 : 0;
                    paddingAbsoluteY *= paddingAbsolute ? 1 : 0;
                    padding.c = checkCacheAutoForce(padding, _cssPaddingCache);

                    //set info for border
                    _borderX = border.l + border.r;
                    _borderY = border.t + border.b;
                    border.c = checkCacheAutoForce(border, _cssBorderCache);

                    //set info for margin
                    _marginX = margin.l + margin.r;
                    _marginY = margin.t + margin.b;
                    margin.c = checkCacheAutoForce(margin, _cssMarginCache);

                    //refresh cache
                    _textareaAutoWrappingCache = textareaAutoWrapping;
                    _cssDirectionCache = cssDirection;
                    _cssBoxSizingCache = boxSizing;
                    _widthAutoCache = widthAuto;
                    _heightAutoCache = heightAuto;
                    _cssPaddingCache = padding;
                    _cssBorderCache = border;
                    _cssMarginCache = margin;

                    //IEFix direction changed
                    if (cssDirectionChanged && _sizeAutoObserverAdded)
                        _sizeAutoObserverElement.css(_strFloat, isRTLRight);

                    //apply padding:
                    if (padding.c || cssDirectionChanged || paddingAbsoluteChanged || widthAutoChanged || heightAutoChanged || boxSizingChanged || sizeAutoCapableChanged) {
                        var paddingElementCSS = {};
                        var textareaCSS = {};
                        var paddingValues = [padding.t, padding.r, padding.b, padding.l];

                        setTopRightBottomLeft(contentGlueElementCSS, _strMarginMinus, [-padding.t, -padding.r, -padding.b, -padding.l]);
                        if (paddingAbsolute) {
                            setTopRightBottomLeft(paddingElementCSS, _strEmpty, paddingValues);
                            setTopRightBottomLeft(_isTextarea ? textareaCSS : contentElementCSS, _strPaddingMinus);
                        }
                        else {
                            setTopRightBottomLeft(paddingElementCSS, _strEmpty);
                            setTopRightBottomLeft(_isTextarea ? textareaCSS : contentElementCSS, _strPaddingMinus, paddingValues);
                        }

                        _paddingElement.css(paddingElementCSS);
                        _targetElement.css(textareaCSS);
                    }

                    //viewport size is padding container because it never has padding, margin and a border.
                    _viewportSize = getViewportSize();

                    //update Textarea
                    var textareaSize = _isTextarea ? textareaUpdate() : false;
                    var textareaSizeChanged = _isTextarea && checkCacheAutoForce(textareaSize, _textareaSizeCache);
                    var textareaDynOrigSize = _isTextarea && textareaSize ? {
                        w: textareaDynWidth ? textareaSize._dynamicWidth : textareaSize._originalWidth,
                        h: textareaDynHeight ? textareaSize._dynamicHeight : textareaSize._originalHeight
                    } : {};
                    _textareaSizeCache = textareaSize;

                    //fix height auto / width auto in cooperation with current padding & boxSizing behavior:
                    if (heightAuto && (heightAutoChanged || paddingAbsoluteChanged || boxSizingChanged || padding.c || border.c)) {
                        contentElementCSS[_strHeight] = _strAuto;
                    }
                    else if (heightAutoChanged || paddingAbsoluteChanged) {
                        contentElementCSS[_strHeight] = _strHundredPercent;
                    }
                    if (widthAuto && (widthAutoChanged || paddingAbsoluteChanged || boxSizingChanged || padding.c || border.c || cssDirectionChanged)) {
                        contentElementCSS[_strWidth] = _strAuto;
                        contentGlueElementCSS[_strMaxMinus + _strWidth] = _strHundredPercent; //IE Fix
                    }
                    else if (widthAutoChanged || paddingAbsoluteChanged) {
                        contentElementCSS[_strWidth] = _strHundredPercent;
                        contentElementCSS[_strFloat] = _strEmpty;
                        contentGlueElementCSS[_strMaxMinus + _strWidth] = _strEmpty; //IE Fix
                    }
                    if (widthAuto) {
                        //textareaDynOrigSize.w || _strAuto :: doesnt works because applied margin will shift width
                        contentGlueElementCSS[_strWidth] = _strAuto;

                        contentElementCSS[_strWidth] = VENDORS._cssPropertyValue(_strWidth, 'max-content intrinsic') || _strAuto;
                        contentElementCSS[_strFloat] = isRTLRight;
                    }
                    else {
                        contentGlueElementCSS[_strWidth] = _strEmpty;
                    }
                    if (heightAuto) {
                        //textareaDynOrigSize.h || _contentElementNative[LEXICON.cH] :: use for anti scroll jumping
                        contentGlueElementCSS[_strHeight] = textareaDynOrigSize.h || _contentElementNative[LEXICON.cH];
                    }
                    else {
                        contentGlueElementCSS[_strHeight] = _strEmpty;
                    }
                    if (sizeAutoCapable)
                        _contentGlueElement.css(contentGlueElementCSS);
                    _contentElement.css(contentElementCSS);

                    //CHECKPOINT HERE ~
                    contentElementCSS = {};
                    contentGlueElementCSS = {};

                    //if [content(host) client / scroll size, or target element direction, or content(host) max-sizes] changed, or force is true
                    if (hostSizeChanged || contentSizeChanged || textareaSizeChanged || cssDirectionChanged || boxSizingChanged || paddingAbsoluteChanged || widthAutoChanged || widthAuto || heightAutoChanged || heightAuto || ignoreOverlayScrollbarHidingChanged || overflowBehaviorChanged || clipAlwaysChanged || resizeChanged || scrollbarsVisibilityChanged || scrollbarsAutoHideChanged || scrollbarsDragScrollingChanged || scrollbarsClickScrollingChanged || textareaDynWidthChanged || textareaDynHeightChanged || textareaAutoWrappingChanged) {
                        var strOverflow = 'overflow';
                        var strOverflowX = strOverflow + '-x';
                        var strOverflowY = strOverflow + '-y';
                        var strHidden = 'hidden';
                        var strVisible = 'visible';

                        //Reset the viewport (very important for natively overlaid scrollbars and zoom change
                        //don't change the overflow prop as it is very expensive and affects performance !A LOT!
                        if (!_nativeScrollbarStyling) {
                            var viewportElementResetCSS = {};
                            var resetXTmp = _hasOverflowCache.y && _hideOverflowCache.ys && !ignoreOverlayScrollbarHiding ? (_nativeScrollbarIsOverlaid.y ? _viewportElement.css(isRTLLeft) : -_nativeScrollbarSize.y) : 0;
                            var resetBottomTmp = _hasOverflowCache.x && _hideOverflowCache.xs && !ignoreOverlayScrollbarHiding ? (_nativeScrollbarIsOverlaid.x ? _viewportElement.css(_strBottom) : -_nativeScrollbarSize.x) : 0;
                            setTopRightBottomLeft(viewportElementResetCSS, _strEmpty);
                            _viewportElement.css(viewportElementResetCSS);
                        }

                        //measure several sizes:
                        var contentMeasureElement = getContentMeasureElement();
                        //in Firefox content element has to have overflow hidden, else element margins aren't calculated properly, this element prevents this bug, but only if scrollbars aren't overlaid
                        var contentSize = {
                            //use clientSize because natively overlaidScrollbars add borders
                            w: textareaDynOrigSize.w || contentMeasureElement[LEXICON.cW],
                            h: textareaDynOrigSize.h || contentMeasureElement[LEXICON.cH]
                        };
                        var scrollSize = {
                            w: contentMeasureElement[LEXICON.sW],
                            h: contentMeasureElement[LEXICON.sH]
                        };

                        //apply the correct viewport style and measure viewport size
                        if (!_nativeScrollbarStyling) {
                            viewportElementResetCSS[_strBottom] = wasHeightAuto ? _strEmpty : resetBottomTmp;
                            viewportElementResetCSS[isRTLLeft] = wasWidthAuto ? _strEmpty : resetXTmp;
                            _viewportElement.css(viewportElementResetCSS);
                        }
                        _viewportSize = getViewportSize();

                        //measure and correct several sizes
                        var hostSize = getHostSize();
                        var hostAbsoluteRectSize = {
                            w: hostSize.w - _marginX - _borderX - (_isBorderBox ? 0 : _paddingX),
                            h: hostSize.h - _marginY - _borderY - (_isBorderBox ? 0 : _paddingY)
                        };
                        var contentGlueSize = {
                            //client/scrollSize + AbsolutePadding -> because padding is only applied to the paddingElement if its absolute, so you have to add it manually
                            //hostSize is clientSize -> so padding should be added manually, right? FALSE! Because content glue is inside hostElement, so we don't have to worry about padding
                            w: MATH.max((widthAuto ? contentSize.w : scrollSize.w) + paddingAbsoluteX, hostAbsoluteRectSize.w),
                            h: MATH.max((heightAuto ? contentSize.h : scrollSize.h) + paddingAbsoluteY, hostAbsoluteRectSize.h)
                        };
                        contentGlueSize.c = checkCacheAutoForce(contentGlueSize, _contentGlueSizeCache);
                        _contentGlueSizeCache = contentGlueSize;

                        //apply correct contentGlue size
                        if (sizeAutoCapable) {
                            //size contentGlue correctly to make sure the element has correct size if the sizing switches to auto
                            if (contentGlueSize.c || (heightAuto || widthAuto)) {
                                contentGlueElementCSS[_strWidth] = contentGlueSize.w;
                                contentGlueElementCSS[_strHeight] = contentGlueSize.h;

                                //textarea-sizes are already calculated correctly at this point
                                if (!_isTextarea) {
                                    contentSize = {
                                        //use clientSize because natively overlaidScrollbars add borders
                                        w: contentMeasureElement[LEXICON.cW],
                                        h: contentMeasureElement[LEXICON.cH]
                                    };
                                }
                            }
                            var textareaCoverCSS = {};
                            var setContentGlueElementCSSfunction = function (horizontal) {
                                var scrollbarVars = getScrollbarVars(horizontal);
                                var wh = scrollbarVars._w_h;
                                var strWH = scrollbarVars._width_height;
                                var autoSize = horizontal ? widthAuto : heightAuto;
                                var borderSize = horizontal ? _borderX : _borderY;
                                var paddingSize = horizontal ? _paddingX : _paddingY;
                                var marginSize = horizontal ? _marginX : _marginY;
                                var viewportSize = _viewportSize[wh] - borderSize - marginSize - (_isBorderBox ? 0 : paddingSize);

                                //make contentGlue size -1 if element is not auto sized, to make sure that a resize event happens when the element shrinks
                                if (!autoSize || (!autoSize && border.c))
                                    contentGlueElementCSS[strWH] = hostAbsoluteRectSize[wh] - 1;

                                //if size is auto and host is smaller than size as min size, make content glue size -1 to make sure size changes will be detected (this is only needed if padding is 0)
                                if (autoSize && (contentSize[wh] < viewportSize) && (horizontal && _isTextarea ? !textareaAutoWrapping : true)) {
                                    if (_isTextarea)
                                        textareaCoverCSS[strWH] = parseToZeroOrNumber(_textareaCoverElement.css(strWH)) - 1;
                                    contentGlueElementCSS[strWH] -= 1;
                                }

                                //make sure content glue size is at least 1
                                if (contentSize[wh] > 0)
                                    contentGlueElementCSS[strWH] = MATH.max(1, contentGlueElementCSS[strWH]);
                            };
                            setContentGlueElementCSSfunction(true);
                            setContentGlueElementCSSfunction(false);

                            if (_isTextarea)
                                _textareaCoverElement.css(textareaCoverCSS);
                            _contentGlueElement.css(contentGlueElementCSS);
                        }
                        if (widthAuto)
                            contentElementCSS[_strWidth] = _strHundredPercent;
                        if (widthAuto && !_isBorderBox && !_mutationObserversConnected)
                            contentElementCSS[_strFloat] = 'none';

                        //apply and reset content style
                        _contentElement.css(contentElementCSS);
                        contentElementCSS = {};

                        //measure again, but this time all correct sizes:
                        var contentScrollSize = {
                            w: contentMeasureElement[LEXICON.sW],
                            h: contentMeasureElement[LEXICON.sH],
                        };
                        contentScrollSize.c = contentSizeChanged = checkCacheAutoForce(contentScrollSize, _contentScrollSizeCache);
                        _contentScrollSizeCache = contentScrollSize;

                        //refresh viewport size after correct measuring
                        _viewportSize = getViewportSize();

                        hostSize = getHostSize();
                        hostSizeChanged = checkCacheAutoForce(hostSize, _hostSizeCache);
                        _hostSizeCache = hostSize;

                        var hideOverflowForceTextarea = _isTextarea && (_viewportSize.w === 0 || _viewportSize.h === 0);
                        var previousOverflowAmount = _overflowAmountCache;
                        var overflowBehaviorIsVS = {};
                        var overflowBehaviorIsVH = {};
                        var overflowBehaviorIsS = {};
                        var overflowAmount = {};
                        var hasOverflow = {};
                        var hideOverflow = {};
                        var canScroll = {};
                        var viewportRect = _paddingElementNative[LEXICON.bCR]();
                        var setOverflowVariables = function (horizontal) {
                            var scrollbarVars = getScrollbarVars(horizontal);
                            var scrollbarVarsInverted = getScrollbarVars(!horizontal);
                            var xyI = scrollbarVarsInverted._x_y;
                            var xy = scrollbarVars._x_y;
                            var wh = scrollbarVars._w_h;
                            var widthHeight = scrollbarVars._width_height;
                            var scrollMax = _strScroll + scrollbarVars._Left_Top + 'Max';
                            var fractionalOverflowAmount = viewportRect[widthHeight] ? MATH.abs(viewportRect[widthHeight] - _viewportSize[wh]) : 0;
                            var checkFractionalOverflowAmount = previousOverflowAmount && previousOverflowAmount[xy] > 0 && _viewportElementNative[scrollMax] === 0;
                            overflowBehaviorIsVS[xy] = overflowBehavior[xy] === 'v-s';
                            overflowBehaviorIsVH[xy] = overflowBehavior[xy] === 'v-h';
                            overflowBehaviorIsS[xy] = overflowBehavior[xy] === 's';
                            overflowAmount[xy] = MATH.max(0, MATH.round((contentScrollSize[wh] - _viewportSize[wh]) * 100) / 100);
                            overflowAmount[xy] *= (hideOverflowForceTextarea || (checkFractionalOverflowAmount && fractionalOverflowAmount > 0 && fractionalOverflowAmount < 1)) ? 0 : 1;
                            hasOverflow[xy] = overflowAmount[xy] > 0;

                            //hideOverflow:
                            //x || y : true === overflow is hidden by "overflow: scroll" OR "overflow: hidden"
                            //xs || ys : true === overflow is hidden by "overflow: scroll"
                            hideOverflow[xy] = overflowBehaviorIsVS[xy] || overflowBehaviorIsVH[xy] ? (hasOverflow[xyI] && !overflowBehaviorIsVS[xyI] && !overflowBehaviorIsVH[xyI]) : hasOverflow[xy];
                            hideOverflow[xy + 's'] = hideOverflow[xy] ? (overflowBehaviorIsS[xy] || overflowBehaviorIsVS[xy]) : false;

                            canScroll[xy] = hasOverflow[xy] && hideOverflow[xy + 's'];
                        };
                        setOverflowVariables(true);
                        setOverflowVariables(false);

                        overflowAmount.c = checkCacheAutoForce(overflowAmount, _overflowAmountCache);
                        _overflowAmountCache = overflowAmount;
                        hasOverflow.c = checkCacheAutoForce(hasOverflow, _hasOverflowCache);
                        _hasOverflowCache = hasOverflow;
                        hideOverflow.c = checkCacheAutoForce(hideOverflow, _hideOverflowCache);
                        _hideOverflowCache = hideOverflow;

                        //if native scrollbar is overlay at x OR y axis, prepare DOM
                        if (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y) {
                            var borderDesign = 'px solid transparent';
                            var contentArrangeElementCSS = {};
                            var arrangeContent = {};
                            var arrangeChanged = force;
                            var setContentElementCSS;

                            if (hasOverflow.x || hasOverflow.y) {
                                arrangeContent.w = _nativeScrollbarIsOverlaid.y && hasOverflow.y ? contentScrollSize.w + _overlayScrollbarDummySize.y : _strEmpty;
                                arrangeContent.h = _nativeScrollbarIsOverlaid.x && hasOverflow.x ? contentScrollSize.h + _overlayScrollbarDummySize.x : _strEmpty;
                                arrangeChanged = checkCacheAutoForce(arrangeContent, _arrangeContentSizeCache);
                                _arrangeContentSizeCache = arrangeContent;
                            }

                            if (hasOverflow.c || hideOverflow.c || contentScrollSize.c || cssDirectionChanged || widthAutoChanged || heightAutoChanged || widthAuto || heightAuto || ignoreOverlayScrollbarHidingChanged) {
                                contentElementCSS[_strMarginMinus + isRTLRight] = contentElementCSS[_strBorderMinus + isRTLRight] = _strEmpty;
                                setContentElementCSS = function (horizontal) {
                                    var scrollbarVars = getScrollbarVars(horizontal);
                                    var scrollbarVarsInverted = getScrollbarVars(!horizontal);
                                    var xy = scrollbarVars._x_y;
                                    var strDirection = horizontal ? _strBottom : isRTLLeft;
                                    var invertedAutoSize = horizontal ? heightAuto : widthAuto;

                                    if (_nativeScrollbarIsOverlaid[xy] && hasOverflow[xy] && hideOverflow[xy + 's']) {
                                        contentElementCSS[_strMarginMinus + strDirection] = invertedAutoSize ? (ignoreOverlayScrollbarHiding ? _strEmpty : _overlayScrollbarDummySize[xy]) : _strEmpty;
                                        contentElementCSS[_strBorderMinus + strDirection] = ((horizontal ? !invertedAutoSize : true) && !ignoreOverlayScrollbarHiding) ? (_overlayScrollbarDummySize[xy] + borderDesign) : _strEmpty;
                                    }
                                    else {
                                        arrangeContent[scrollbarVarsInverted._w_h] =
                                            contentElementCSS[_strMarginMinus + strDirection] =
                                            contentElementCSS[_strBorderMinus + strDirection] = _strEmpty;
                                        arrangeChanged = true;
                                    }
                                };

                                if (_nativeScrollbarStyling) {
                                    addRemoveClass(_viewportElement, _classNameViewportNativeScrollbarsInvisible, !ignoreOverlayScrollbarHiding)
                                }
                                else {
                                    setContentElementCSS(true);
                                    setContentElementCSS(false);
                                }
                            }
                            if (ignoreOverlayScrollbarHiding) {
                                arrangeContent.w = arrangeContent.h = _strEmpty;
                                arrangeChanged = true;
                            }
                            if (arrangeChanged && !_nativeScrollbarStyling) {
                                contentArrangeElementCSS[_strWidth] = hideOverflow.y ? arrangeContent.w : _strEmpty;
                                contentArrangeElementCSS[_strHeight] = hideOverflow.x ? arrangeContent.h : _strEmpty;

                                if (!_contentArrangeElement) {
                                    _contentArrangeElement = FRAMEWORK(generateDiv(_classNameContentArrangeElement));
                                    _viewportElement.prepend(_contentArrangeElement);
                                }
                                _contentArrangeElement.css(contentArrangeElementCSS);
                            }
                            _contentElement.css(contentElementCSS);
                        }

                        var viewportElementCSS = {};
                        var paddingElementCSS = {};
                        var setViewportCSS;
                        if (hostSizeChanged || hasOverflow.c || hideOverflow.c || contentScrollSize.c || overflowBehaviorChanged || boxSizingChanged || ignoreOverlayScrollbarHidingChanged || cssDirectionChanged || clipAlwaysChanged || heightAutoChanged) {
                            viewportElementCSS[isRTLRight] = _strEmpty;
                            setViewportCSS = function (horizontal) {
                                var scrollbarVars = getScrollbarVars(horizontal);
                                var scrollbarVarsInverted = getScrollbarVars(!horizontal);
                                var xy = scrollbarVars._x_y;
                                var XY = scrollbarVars._X_Y;
                                var strDirection = horizontal ? _strBottom : isRTLLeft;

                                var reset = function () {
                                    viewportElementCSS[strDirection] = _strEmpty;
                                    _contentBorderSize[scrollbarVarsInverted._w_h] = 0;
                                };
                                if (hasOverflow[xy] && hideOverflow[xy + 's']) {
                                    viewportElementCSS[strOverflow + XY] = _strScroll;
                                    if (ignoreOverlayScrollbarHiding || _nativeScrollbarStyling) {
                                        reset();
                                    }
                                    else {
                                        viewportElementCSS[strDirection] = -(_nativeScrollbarIsOverlaid[xy] ? _overlayScrollbarDummySize[xy] : _nativeScrollbarSize[xy]);
                                        _contentBorderSize[scrollbarVarsInverted._w_h] = _nativeScrollbarIsOverlaid[xy] ? _overlayScrollbarDummySize[scrollbarVarsInverted._x_y] : 0;
                                    }
                                } else {
                                    viewportElementCSS[strOverflow + XY] = _strEmpty;
                                    reset();
                                }
                            };
                            setViewportCSS(true);
                            setViewportCSS(false);

                            // if the scroll container is too small and if there is any overflow with no overlay scrollbar (and scrollbar styling isn't possible), 
                            // make viewport element greater in size (Firefox hide Scrollbars fix)
                            // because firefox starts hiding scrollbars on too small elements
                            // with this behavior the overflow calculation may be incorrect or the scrollbars would appear suddenly
                            // https://bugzilla.mozilla.org/show_bug.cgi?id=292284
                            if (!_nativeScrollbarStyling
                                && (_viewportSize.h < _nativeScrollbarMinSize.x || _viewportSize.w < _nativeScrollbarMinSize.y)
                                && ((hasOverflow.x && hideOverflow.x && !_nativeScrollbarIsOverlaid.x) || (hasOverflow.y && hideOverflow.y && !_nativeScrollbarIsOverlaid.y))) {
                                viewportElementCSS[_strPaddingMinus + _strTop] = _nativeScrollbarMinSize.x;
                                viewportElementCSS[_strMarginMinus + _strTop] = -_nativeScrollbarMinSize.x;

                                viewportElementCSS[_strPaddingMinus + isRTLRight] = _nativeScrollbarMinSize.y;
                                viewportElementCSS[_strMarginMinus + isRTLRight] = -_nativeScrollbarMinSize.y;
                            }
                            else {
                                viewportElementCSS[_strPaddingMinus + _strTop] =
                                    viewportElementCSS[_strMarginMinus + _strTop] =
                                    viewportElementCSS[_strPaddingMinus + isRTLRight] =
                                    viewportElementCSS[_strMarginMinus + isRTLRight] = _strEmpty;
                            }
                            viewportElementCSS[_strPaddingMinus + isRTLLeft] =
                                viewportElementCSS[_strMarginMinus + isRTLLeft] = _strEmpty;

                            //if there is any overflow (x OR y axis) and this overflow shall be hidden, make overflow hidden, else overflow visible
                            if ((hasOverflow.x && hideOverflow.x) || (hasOverflow.y && hideOverflow.y) || hideOverflowForceTextarea) {
                                //only hide if is Textarea
                                if (_isTextarea && hideOverflowForceTextarea) {
                                    paddingElementCSS[strOverflowX] =
                                        paddingElementCSS[strOverflowY] = strHidden;
                                }
                            }
                            else {
                                if (!clipAlways || (overflowBehaviorIsVH.x || overflowBehaviorIsVS.x || overflowBehaviorIsVH.y || overflowBehaviorIsVS.y)) {
                                    //only un-hide if Textarea
                                    if (_isTextarea) {
                                        paddingElementCSS[strOverflowX] =
                                            paddingElementCSS[strOverflowY] = _strEmpty;
                                    }
                                    viewportElementCSS[strOverflowX] =
                                        viewportElementCSS[strOverflowY] = strVisible;
                                }
                            }

                            _paddingElement.css(paddingElementCSS);
                            _viewportElement.css(viewportElementCSS);
                            viewportElementCSS = {};

                            //force soft redraw in webkit because without the scrollbars will may appear because DOM wont be redrawn under special conditions
                            if ((hasOverflow.c || boxSizingChanged || widthAutoChanged || heightAutoChanged) && !(_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y)) {
                                var elementStyle = _contentElementNative[LEXICON.s];
                                var dump;
                                elementStyle.webkitTransform = 'scale(1)';
                                elementStyle.display = 'run-in';
                                dump = _contentElementNative[LEXICON.oH];
                                elementStyle.display = _strEmpty; //|| dump; //use dump to prevent it from deletion if minify
                                elementStyle.webkitTransform = _strEmpty;
                            }
                            /*
                            //force hard redraw in webkit if native overlaid scrollbars shall appear
                            if (ignoreOverlayScrollbarHidingChanged && ignoreOverlayScrollbarHiding) {
                                _hostElement.hide();
                                var dump = _hostElementNative[LEXICON.oH];
                                _hostElement.show();
                            }
                            */
                        }

                        //change to direction RTL and width auto Bugfix in Webkit
                        //without this fix, the DOM still thinks the scrollbar is LTR and thus the content is shifted to the left
                        contentElementCSS = {};
                        if (cssDirectionChanged || widthAutoChanged || heightAutoChanged) {
                            if (_isRTL && widthAuto) {
                                var floatTmp = _contentElement.css(_strFloat);
                                var posLeftWithoutFloat = MATH.round(_contentElement.css(_strFloat, _strEmpty).css(_strLeft, _strEmpty).position().left);
                                _contentElement.css(_strFloat, floatTmp);
                                var posLeftWithFloat = MATH.round(_contentElement.position().left);

                                if (posLeftWithoutFloat !== posLeftWithFloat)
                                    contentElementCSS[_strLeft] = posLeftWithoutFloat;
                            }
                            else {
                                contentElementCSS[_strLeft] = _strEmpty;
                            }
                        }
                        _contentElement.css(contentElementCSS);

                        //handle scroll position
                        if (_isTextarea && contentSizeChanged) {
                            var textareaInfo = getTextareaInfo();
                            if (textareaInfo) {
                                var textareaRowsChanged = _textareaInfoCache === undefined ? true : textareaInfo._rows !== _textareaInfoCache._rows;
                                var cursorRow = textareaInfo._cursorRow;
                                var cursorCol = textareaInfo._cursorColumn;
                                var widestRow = textareaInfo._widestRow;
                                var lastRow = textareaInfo._rows;
                                var lastCol = textareaInfo._columns;
                                var cursorPos = textareaInfo._cursorPosition;
                                var cursorMax = textareaInfo._cursorMax;
                                var cursorIsLastPosition = (cursorPos >= cursorMax && _textareaHasFocus);
                                var textareaScrollAmount = {
                                    x: (!textareaAutoWrapping && (cursorCol === lastCol && cursorRow === widestRow)) ? _overflowAmountCache.x : -1,
                                    y: (textareaAutoWrapping ? cursorIsLastPosition || textareaRowsChanged && (previousOverflowAmount ? (currScroll.y === previousOverflowAmount.y) : false) : (cursorIsLastPosition || textareaRowsChanged) && cursorRow === lastRow) ? _overflowAmountCache.y : -1
                                };
                                currScroll.x = textareaScrollAmount.x > -1 ? (_isRTL && _normalizeRTLCache && _rtlScrollBehavior.i ? 0 : textareaScrollAmount.x) : currScroll.x; //if inverted, scroll to 0 -> normalized this means to max scroll offset.
                                currScroll.y = textareaScrollAmount.y > -1 ? textareaScrollAmount.y : currScroll.y;
                            }
                            _textareaInfoCache = textareaInfo;
                        }
                        if (_isRTL && _rtlScrollBehavior.i && _nativeScrollbarIsOverlaid.y && hasOverflow.x && _normalizeRTLCache)
                            currScroll.x += _contentBorderSize.w || 0;
                        if (widthAuto)
                            _hostElement[_strScrollLeft](0);
                        if (heightAuto)
                            _hostElement[_strScrollTop](0);
                        _viewportElement[_strScrollLeft](currScroll.x)[_strScrollTop](currScroll.y);

                        //scrollbars management:
                        var scrollbarsVisibilityVisible = scrollbarsVisibility === 'v';
                        var scrollbarsVisibilityHidden = scrollbarsVisibility === 'h';
                        var scrollbarsVisibilityAuto = scrollbarsVisibility === 'a';
                        var refreshScrollbarsVisibility = function (showX, showY) {
                            showY = showY === undefined ? showX : showY;
                            refreshScrollbarAppearance(true, showX, canScroll.x)
                            refreshScrollbarAppearance(false, showY, canScroll.y)
                        };

                        //manage class name which indicates scrollable overflow
                        addRemoveClass(_hostElement, _classNameHostOverflow, hideOverflow.x || hideOverflow.y);
                        addRemoveClass(_hostElement, _classNameHostOverflowX, hideOverflow.x);
                        addRemoveClass(_hostElement, _classNameHostOverflowY, hideOverflow.y);

                        //add or remove rtl class name for styling purposes except when its body, then the scrollbar stays
                        if (cssDirectionChanged && !_isBody) {
                            addRemoveClass(_hostElement, _classNameHostRTL, _isRTL);
                        }

                        //manage the resize feature (CSS3 resize "polyfill" for this plugin)
                        if (_isBody)
                            addClass(_hostElement, _classNameHostResizeDisabled);
                        if (resizeChanged) {
                            addRemoveClass(_hostElement, _classNameHostResizeDisabled, _resizeNone);
                            addRemoveClass(_scrollbarCornerElement, _classNameScrollbarCornerResize, !_resizeNone);
                            addRemoveClass(_scrollbarCornerElement, _classNameScrollbarCornerResizeB, _resizeBoth);
                            addRemoveClass(_scrollbarCornerElement, _classNameScrollbarCornerResizeH, _resizeHorizontal);
                            addRemoveClass(_scrollbarCornerElement, _classNameScrollbarCornerResizeV, _resizeVertical);
                        }

                        //manage the scrollbars general visibility + the scrollbar interactivity (unusable class name)
                        if (scrollbarsVisibilityChanged || overflowBehaviorChanged || hideOverflow.c || hasOverflow.c || ignoreOverlayScrollbarHidingChanged) {
                            if (ignoreOverlayScrollbarHiding) {
                                if (ignoreOverlayScrollbarHidingChanged) {
                                    removeClass(_hostElement, _classNameHostScrolling);
                                    if (ignoreOverlayScrollbarHiding) {
                                        refreshScrollbarsVisibility(false);
                                    }
                                }
                            }
                            else if (scrollbarsVisibilityAuto) {
                                refreshScrollbarsVisibility(canScroll.x, canScroll.y);
                            }
                            else if (scrollbarsVisibilityVisible) {
                                refreshScrollbarsVisibility(true);
                            }
                            else if (scrollbarsVisibilityHidden) {
                                refreshScrollbarsVisibility(false);
                            }
                        }

                        //manage the scrollbars auto hide feature (auto hide them after specific actions)
                        if (scrollbarsAutoHideChanged || ignoreOverlayScrollbarHidingChanged) {
                            setupHostMouseTouchEvents(!_scrollbarsAutoHideLeave && !_scrollbarsAutoHideMove);
                            refreshScrollbarsAutoHide(_scrollbarsAutoHideNever, !_scrollbarsAutoHideNever);
                        }

                        //manage scrollbars handle length & offset - don't remove!
                        if (hostSizeChanged || overflowAmount.c || heightAutoChanged || widthAutoChanged || resizeChanged || boxSizingChanged || paddingAbsoluteChanged || ignoreOverlayScrollbarHidingChanged || cssDirectionChanged) {
                            refreshScrollbarHandleLength(true);
                            refreshScrollbarHandleOffset(true);
                            refreshScrollbarHandleLength(false);
                            refreshScrollbarHandleOffset(false);
                        }

                        //manage interactivity
                        if (scrollbarsClickScrollingChanged)
                            refreshScrollbarsInteractive(true, scrollbarsClickScrolling);
                        if (scrollbarsDragScrollingChanged)
                            refreshScrollbarsInteractive(false, scrollbarsDragScrolling);

                        //callbacks:
                        dispatchCallback('onDirectionChanged', {
                            isRTL: _isRTL,
                            dir: cssDirection
                        }, cssDirectionChanged);
                        dispatchCallback('onHostSizeChanged', {
                            width: _hostSizeCache.w,
                            height: _hostSizeCache.h
                        }, hostSizeChanged);
                        dispatchCallback('onContentSizeChanged', {
                            width: _contentScrollSizeCache.w,
                            height: _contentScrollSizeCache.h
                        }, contentSizeChanged);
                        dispatchCallback('onOverflowChanged', {
                            x: hasOverflow.x,
                            y: hasOverflow.y,
                            xScrollable: hideOverflow.xs,
                            yScrollable: hideOverflow.ys,
                            clipped: hideOverflow.x || hideOverflow.y
                        }, hasOverflow.c || hideOverflow.c);
                        dispatchCallback('onOverflowAmountChanged', {
                            x: overflowAmount.x,
                            y: overflowAmount.y
                        }, overflowAmount.c);
                    }

                    //fix body min size
                    if (_isBody && _bodyMinSizeCache && (_hasOverflowCache.c || _bodyMinSizeCache.c)) {
                        //its possible that no min size was measured until now, because the content arrange element was just added now, in this case, measure now the min size.
                        if (!_bodyMinSizeCache.f)
                            bodyMinSizeChanged();
                        if (_nativeScrollbarIsOverlaid.y && _hasOverflowCache.x)
                            _contentElement.css(_strMinMinus + _strWidth, _bodyMinSizeCache.w + _overlayScrollbarDummySize.y);
                        if (_nativeScrollbarIsOverlaid.x && _hasOverflowCache.y)
                            _contentElement.css(_strMinMinus + _strHeight, _bodyMinSizeCache.h + _overlayScrollbarDummySize.x);
                        _bodyMinSizeCache.c = false;
                    }

                    if (_initialized && changedOptions.updateOnLoad) {
                        updateElementsOnLoad();
                    }

                    //freezeResizeObserver(_sizeObserverElement, false);
                    //freezeResizeObserver(_sizeAutoObserverElement, false);

                    dispatchCallback('onUpdated', { forced: force });
                }

                /**
                 * Updates the found elements of which the load event shall be handled.
                 */
                function updateElementsOnLoad() {
                    if (!_isTextarea) {
                        eachUpdateOnLoad(function (i, updateOnLoadSelector) {
                            _contentElement.find(updateOnLoadSelector).each(function (i, el) {
                                // if element doesn't have a updateOnLoadCallback applied
                                if (COMPATIBILITY.inA(el, _updateOnLoadElms) < 0) {
                                    _updateOnLoadElms.push(el);
                                    FRAMEWORK(el)
                                        .off(_updateOnLoadEventName, updateOnLoadCallback)
                                        .on(_updateOnLoadEventName, updateOnLoadCallback);
                                }
                            });
                        });
                    }
                }

                //==== Options ====//

                /**
                 * Sets new options but doesn't call the update method.
                 * @param newOptions The object which contains the new options.
                 * @returns {*} A object which contains the changed options.
                 */
                function setOptions(newOptions) {
                    var validatedOpts = _pluginsOptions._validate(newOptions, _pluginsOptions._template, true, _currentOptions)

                    _currentOptions = extendDeep({}, _currentOptions, validatedOpts._default);
                    _currentPreparedOptions = extendDeep({}, _currentPreparedOptions, validatedOpts._prepared);

                    return validatedOpts._prepared;
                }


                //==== Structure ====//

                /**
                 * Builds or destroys the wrapper and helper DOM elements.
                 * @param destroy Indicates whether the DOM shall be build or destroyed.
                 */
                /**
                 * Builds or destroys the wrapper and helper DOM elements.
                 * @param destroy Indicates whether the DOM shall be build or destroyed.
                 */
                function setupStructureDOM(destroy) {
                    var strParent = 'parent';
                    var classNameResizeObserverHost = 'os-resize-observer-host';
                    var classNameTextareaElementFull = _classNameTextareaElement + _strSpace + _classNameTextInherit;
                    var textareaClass = _isTextarea ? _strSpace + _classNameTextInherit : _strEmpty;
                    var adoptAttrs = _currentPreparedOptions.textarea.inheritedAttrs;
                    var adoptAttrsMap = {};
                    var applyAdoptedAttrs = function () {
                        var applyAdoptedAttrsElm = destroy ? _targetElement : _hostElement;
                        each(adoptAttrsMap, function (key, value) {
                            if (type(value) == TYPES.s) {
                                if (key == LEXICON.c)
                                    applyAdoptedAttrsElm.addClass(value);
                                else
                                    applyAdoptedAttrsElm.attr(key, value);
                            }
                        });
                    };
                    var hostElementClassNames = [
                        _classNameHostElement,
                        _classNameHostElementForeign,
                        _classNameHostTextareaElement,
                        _classNameHostResizeDisabled,
                        _classNameHostRTL,
                        _classNameHostScrollbarHorizontalHidden,
                        _classNameHostScrollbarVerticalHidden,
                        _classNameHostTransition,
                        _classNameHostScrolling,
                        _classNameHostOverflow,
                        _classNameHostOverflowX,
                        _classNameHostOverflowY,
                        _classNameThemeNone,
                        _classNameTextareaElement,
                        _classNameTextInherit,
                        _classNameCache].join(_strSpace);
                    var hostElementCSS = {};

                    //get host element as first element, because that's the most upper element and required for the other elements
                    _hostElement = _hostElement || (_isTextarea ? (_domExists ? _targetElement[strParent]()[strParent]()[strParent]()[strParent]() : FRAMEWORK(generateDiv(_classNameHostTextareaElement))) : _targetElement);
                    _contentElement = _contentElement || selectOrGenerateDivByClass(_classNameContentElement + textareaClass);
                    _viewportElement = _viewportElement || selectOrGenerateDivByClass(_classNameViewportElement + textareaClass);
                    _paddingElement = _paddingElement || selectOrGenerateDivByClass(_classNamePaddingElement + textareaClass);
                    _sizeObserverElement = _sizeObserverElement || selectOrGenerateDivByClass(classNameResizeObserverHost);
                    _textareaCoverElement = _textareaCoverElement || (_isTextarea ? selectOrGenerateDivByClass(_classNameTextareaCoverElement) : undefined);

                    //add this class to workaround class changing issues with UI frameworks especially Vue
                    if (_domExists)
                        addClass(_hostElement, _classNameHostElementForeign);

                    //on destroy, remove all generated class names from the host element before collecting the adopted attributes 
                    //to prevent adopting generated class names
                    if (destroy)
                        removeClass(_hostElement, hostElementClassNames);

                    //collect all adopted attributes
                    adoptAttrs = type(adoptAttrs) == TYPES.s ? adoptAttrs.split(_strSpace) : adoptAttrs;
                    if (COMPATIBILITY.isA(adoptAttrs) && _isTextarea) {
                        each(adoptAttrs, function (i, v) {
                            if (type(v) == TYPES.s) {
                                adoptAttrsMap[v] = destroy ? _hostElement.attr(v) : _targetElement.attr(v);
                            }
                        });
                    }

                    if (!destroy) {
                        if (_isTextarea) {
                            if (!_currentPreparedOptions.sizeAutoCapable) {
                                hostElementCSS[_strWidth] = _targetElement.css(_strWidth);
                                hostElementCSS[_strHeight] = _targetElement.css(_strHeight);
                            }

                            if (!_domExists)
                                _targetElement.addClass(_classNameTextInherit).wrap(_hostElement);

                            //jQuery clones elements in wrap functions, so we have to select them again
                            _hostElement = _targetElement[strParent]().css(hostElementCSS);
                        }

                        if (!_domExists) {
                            //add the correct class to the target element
                            addClass(_targetElement, _isTextarea ? classNameTextareaElementFull : _classNameHostElement);

                            //wrap the content into the generated elements to create the required DOM
                            _hostElement.wrapInner(_contentElement)
                                .wrapInner(_viewportElement)
                                .wrapInner(_paddingElement)
                                .prepend(_sizeObserverElement);

                            //jQuery clones elements in wrap functions, so we have to select them again
                            _contentElement = findFirst(_hostElement, _strDot + _classNameContentElement);
                            _viewportElement = findFirst(_hostElement, _strDot + _classNameViewportElement);
                            _paddingElement = findFirst(_hostElement, _strDot + _classNamePaddingElement);

                            if (_isTextarea) {
                                _contentElement.prepend(_textareaCoverElement);
                                applyAdoptedAttrs();
                            }
                        }

                        if (_nativeScrollbarStyling)
                            addClass(_viewportElement, _classNameViewportNativeScrollbarsInvisible);
                        if (_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y)
                            addClass(_viewportElement, _classNameViewportNativeScrollbarsOverlaid);
                        if (_isBody)
                            addClass(_htmlElement, _classNameHTMLElement);

                        _sizeObserverElementNative = _sizeObserverElement[0];
                        _hostElementNative = _hostElement[0];
                        _paddingElementNative = _paddingElement[0];
                        _viewportElementNative = _viewportElement[0];
                        _contentElementNative = _contentElement[0];

                        updateViewportAttrsFromTarget();
                    }
                    else {
                        if (_domExists && _initialized) {
                            //clear size observer
                            _sizeObserverElement.children().remove();

                            //remove the style property and classes from already generated elements
                            each([_paddingElement, _viewportElement, _contentElement, _textareaCoverElement], function (i, elm) {
                                if (elm) {
                                    removeClass(elm.removeAttr(LEXICON.s), _classNamesDynamicDestroy);
                                }
                            });

                            //add classes to the host element which was removed previously to match the expected DOM
                            addClass(_hostElement, _isTextarea ? _classNameHostTextareaElement : _classNameHostElement);
                        }
                        else {
                            //remove size observer
                            remove(_sizeObserverElement);

                            //unwrap the content to restore DOM
                            _contentElement.contents()
                                .unwrap()
                                .unwrap()
                                .unwrap();

                            if (_isTextarea) {
                                _targetElement.unwrap();
                                remove(_hostElement);
                                remove(_textareaCoverElement);
                                applyAdoptedAttrs();
                            }
                        }

                        if (_isTextarea)
                            _targetElement.removeAttr(LEXICON.s);

                        if (_isBody)
                            removeClass(_htmlElement, _classNameHTMLElement);
                    }
                }

                /**
                 * Adds or removes all wrapper elements interactivity events.
                 * @param destroy Indicates whether the Events shall be added or removed.
                 */
                function setupStructureEvents() {
                    var textareaKeyDownRestrictedKeyCodes = [
                        112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123,    //F1 to F12
                        33, 34,                                                   //page up, page down
                        37, 38, 39, 40,                                           //left, up, right, down arrows
                        16, 17, 18, 19, 20, 144                                   //Shift, Ctrl, Alt, Pause, CapsLock, NumLock
                    ];
                    var textareaKeyDownKeyCodesList = [];
                    var textareaUpdateIntervalID;
                    var scrollStopTimeoutId;
                    var scrollStopDelay = 175;
                    var strFocus = 'focus';

                    function updateTextarea(doClearInterval) {
                        textareaUpdate();
                        _base.update(_strAuto);
                        if (doClearInterval && _autoUpdateRecommended)
                            clearInterval(textareaUpdateIntervalID);
                    }
                    function textareaOnScroll(event) {
                        _targetElement[_strScrollLeft](_rtlScrollBehavior.i && _normalizeRTLCache ? 9999999 : 0);
                        _targetElement[_strScrollTop](0);
                        COMPATIBILITY.prvD(event);
                        COMPATIBILITY.stpP(event);
                        return false;
                    }
                    function textareaOnDrop(event) {
                        setTimeout(function () {
                            if (!_destroyed)
                                updateTextarea();
                        }, 50);
                    }
                    function textareaOnFocus() {
                        _textareaHasFocus = true;
                        addClass(_hostElement, strFocus);
                    }
                    function textareaOnFocusout() {
                        _textareaHasFocus = false;
                        textareaKeyDownKeyCodesList = [];
                        removeClass(_hostElement, strFocus);
                        updateTextarea(true);
                    }
                    function textareaOnKeyDown(event) {
                        var keyCode = event.keyCode;

                        if (inArray(keyCode, textareaKeyDownRestrictedKeyCodes) < 0) {
                            if (!textareaKeyDownKeyCodesList[LEXICON.l]) {
                                updateTextarea();
                                textareaUpdateIntervalID = setInterval(updateTextarea, 1000 / 60);
                            }
                            if (inArray(keyCode, textareaKeyDownKeyCodesList) < 0)
                                textareaKeyDownKeyCodesList.push(keyCode);
                        }
                    }
                    function textareaOnKeyUp(event) {
                        var keyCode = event.keyCode;
                        var index = inArray(keyCode, textareaKeyDownKeyCodesList);

                        if (inArray(keyCode, textareaKeyDownRestrictedKeyCodes) < 0) {
                            if (index > -1)
                                textareaKeyDownKeyCodesList.splice(index, 1);
                            if (!textareaKeyDownKeyCodesList[LEXICON.l])
                                updateTextarea(true);
                        }
                    }
                    function contentOnTransitionEnd(event) {
                        if (_autoUpdateCache === true)
                            return;
                        event = event.originalEvent || event;
                        if (isSizeAffectingCSSProperty(event.propertyName))
                            _base.update(_strAuto);
                    }
                    function viewportOnScroll(event) {
                        if (!_sleeping) {
                            if (scrollStopTimeoutId !== undefined)
                                clearTimeout(scrollStopTimeoutId);
                            else {
                                if (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove)
                                    refreshScrollbarsAutoHide(true);

                                if (!nativeOverlayScrollbarsAreActive())
                                    addClass(_hostElement, _classNameHostScrolling);

                                dispatchCallback('onScrollStart', event);
                            }

                            //if a scrollbars handle gets dragged, the mousemove event is responsible for refreshing the handle offset
                            //because if CSS scroll-snap is used, the handle offset gets only refreshed on every snap point
                            //this looks laggy & clunky, it looks much better if the offset refreshes with the mousemove
                            if (!_scrollbarsHandlesDefineScrollPos) {
                                refreshScrollbarHandleOffset(true);
                                refreshScrollbarHandleOffset(false);
                            }
                            dispatchCallback('onScroll', event);

                            scrollStopTimeoutId = setTimeout(function () {
                                if (!_destroyed) {
                                    //OnScrollStop:
                                    clearTimeout(scrollStopTimeoutId);
                                    scrollStopTimeoutId = undefined;

                                    if (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove)
                                        refreshScrollbarsAutoHide(false);

                                    if (!nativeOverlayScrollbarsAreActive())
                                        removeClass(_hostElement, _classNameHostScrolling);

                                    dispatchCallback('onScrollStop', event);
                                }
                            }, scrollStopDelay);
                        }
                    }


                    if (_isTextarea) {
                        if (_msieVersion > 9 || !_autoUpdateRecommended) {
                            addDestroyEventListener(_targetElement, 'input', updateTextarea);
                        }
                        else {
                            addDestroyEventListener(_targetElement,
                                [_strKeyDownEvent, _strKeyUpEvent],
                                [textareaOnKeyDown, textareaOnKeyUp]);
                        }

                        addDestroyEventListener(_targetElement,
                            [_strScroll, 'drop', strFocus, strFocus + 'out'],
                            [textareaOnScroll, textareaOnDrop, textareaOnFocus, textareaOnFocusout]);
                    }
                    else {
                        addDestroyEventListener(_contentElement, _strTransitionEndEvent, contentOnTransitionEnd);
                    }
                    addDestroyEventListener(_viewportElement, _strScroll, viewportOnScroll, true);
                }


                //==== Scrollbars ====//

                /**
                 * Builds or destroys all scrollbar DOM elements (scrollbar, track, handle)
                 * @param destroy Indicates whether the DOM shall be build or destroyed.
                 */
                function setupScrollbarsDOM(destroy) {
                    var selectOrGenerateScrollbarDOM = function (isHorizontal) {
                        var scrollbarClassName = isHorizontal ? _classNameScrollbarHorizontal : _classNameScrollbarVertical;
                        var scrollbar = selectOrGenerateDivByClass(_classNameScrollbar + _strSpace + scrollbarClassName, true);
                        var track = selectOrGenerateDivByClass(_classNameScrollbarTrack, scrollbar);
                        var handle = selectOrGenerateDivByClass(_classNameScrollbarHandle, scrollbar);

                        if (!_domExists && !destroy) {
                            scrollbar.append(track);
                            track.append(handle);
                        }

                        return {
                            _scrollbar: scrollbar,
                            _track: track,
                            _handle: handle
                        };
                    };
                    function resetScrollbarDOM(isHorizontal) {
                        var scrollbarVars = getScrollbarVars(isHorizontal);
                        var scrollbar = scrollbarVars._scrollbar;
                        var track = scrollbarVars._track;
                        var handle = scrollbarVars._handle;

                        if (_domExists && _initialized) {
                            each([scrollbar, track, handle], function (i, elm) {
                                removeClass(elm.removeAttr(LEXICON.s), _classNamesDynamicDestroy);
                            });
                        }
                        else {
                            remove(scrollbar || selectOrGenerateScrollbarDOM(isHorizontal)._scrollbar);
                        }
                    }
                    var horizontalElements;
                    var verticalElements;

                    if (!destroy) {
                        horizontalElements = selectOrGenerateScrollbarDOM(true);
                        verticalElements = selectOrGenerateScrollbarDOM();

                        _scrollbarHorizontalElement = horizontalElements._scrollbar;
                        _scrollbarHorizontalTrackElement = horizontalElements._track;
                        _scrollbarHorizontalHandleElement = horizontalElements._handle;
                        _scrollbarVerticalElement = verticalElements._scrollbar;
                        _scrollbarVerticalTrackElement = verticalElements._track;
                        _scrollbarVerticalHandleElement = verticalElements._handle;

                        if (!_domExists) {
                            _paddingElement.after(_scrollbarVerticalElement);
                            _paddingElement.after(_scrollbarHorizontalElement);
                        }
                    }
                    else {
                        resetScrollbarDOM(true);
                        resetScrollbarDOM();
                    }
                }

                /**
                 * Initializes all scrollbar interactivity events. (track and handle dragging, clicking, scrolling)
                 * @param isHorizontal True if the target scrollbar is the horizontal scrollbar, false if the target scrollbar is the vertical scrollbar.
                 */
                function setupScrollbarEvents(isHorizontal) {
                    var scrollbarVars = getScrollbarVars(isHorizontal);
                    var scrollbarVarsInfo = scrollbarVars._info;
                    var insideIFrame = _windowElementNative.top !== _windowElementNative;
                    var xy = scrollbarVars._x_y;
                    var XY = scrollbarVars._X_Y;
                    var scroll = _strScroll + scrollbarVars._Left_Top;
                    var strActive = 'active';
                    var strSnapHandle = 'snapHandle';
                    var strClickEvent = 'click';
                    var scrollDurationFactor = 1;
                    var increaseDecreaseScrollAmountKeyCodes = [16, 17]; //shift, ctrl
                    var trackTimeout;
                    var mouseDownScroll;
                    var mouseDownOffset;
                    var mouseDownInvertedScale;

                    function getPointerPosition(event) {
                        return _msieVersion && insideIFrame ? event['screen' + XY] : COMPATIBILITY.page(event)[xy]; //use screen coordinates in EDGE & IE because the page values are incorrect in frames.
                    }
                    function getPreparedScrollbarsOption(name) {
                        return _currentPreparedOptions.scrollbars[name];
                    }
                    function increaseTrackScrollAmount() {
                        scrollDurationFactor = 0.5;
                    }
                    function decreaseTrackScrollAmount() {
                        scrollDurationFactor = 1;
                    }
                    function stopClickEventPropagation(event) {
                        COMPATIBILITY.stpP(event);
                    }
                    function documentKeyDown(event) {
                        if (inArray(event.keyCode, increaseDecreaseScrollAmountKeyCodes) > -1)
                            increaseTrackScrollAmount();
                    }
                    function documentKeyUp(event) {
                        if (inArray(event.keyCode, increaseDecreaseScrollAmountKeyCodes) > -1)
                            decreaseTrackScrollAmount();
                    }
                    function onMouseTouchDownContinue(event) {
                        var originalEvent = event.originalEvent || event;
                        var isTouchEvent = originalEvent.touches !== undefined;
                        return _sleeping || _destroyed || nativeOverlayScrollbarsAreActive() || !_scrollbarsDragScrollingCache || (isTouchEvent && !getPreparedScrollbarsOption('touchSupport')) ? false : COMPATIBILITY.mBtn(event) === 1 || isTouchEvent;
                    }
                    function documentDragMove(event) {
                        if (onMouseTouchDownContinue(event)) {
                            var trackLength = scrollbarVarsInfo._trackLength;
                            var handleLength = scrollbarVarsInfo._handleLength;
                            var scrollRange = scrollbarVarsInfo._maxScroll;
                            var scrollRaw = (getPointerPosition(event) - mouseDownOffset) * mouseDownInvertedScale;
                            var scrollDeltaPercent = scrollRaw / (trackLength - handleLength);
                            var scrollDelta = (scrollRange * scrollDeltaPercent);
                            scrollDelta = isFinite(scrollDelta) ? scrollDelta : 0;
                            if (_isRTL && isHorizontal && !_rtlScrollBehavior.i)
                                scrollDelta *= -1;

                            _viewportElement[scroll](MATH.round(mouseDownScroll + scrollDelta));

                            if (_scrollbarsHandlesDefineScrollPos)
                                refreshScrollbarHandleOffset(isHorizontal, mouseDownScroll + scrollDelta);

                            if (!_supportPassiveEvents)
                                COMPATIBILITY.prvD(event);
                        }
                        else
                            documentMouseTouchUp(event);
                    }
                    function documentMouseTouchUp(event) {
                        event = event || event.originalEvent;

                        setupResponsiveEventListener(_documentElement,
                            [_strMouseTouchMoveEvent, _strMouseTouchUpEvent, _strKeyDownEvent, _strKeyUpEvent, _strSelectStartEvent],
                            [documentDragMove, documentMouseTouchUp, documentKeyDown, documentKeyUp, documentOnSelectStart],
                            true);
                        COMPATIBILITY.rAF()(function() {
                            setupResponsiveEventListener(_documentElement, strClickEvent, stopClickEventPropagation, true, { _capture: true });
                        });
                        
                            
                        if (_scrollbarsHandlesDefineScrollPos)
                            refreshScrollbarHandleOffset(isHorizontal, true);

                        _scrollbarsHandlesDefineScrollPos = false;
                        removeClass(_bodyElement, _classNameDragging);
                        removeClass(scrollbarVars._handle, strActive);
                        removeClass(scrollbarVars._track, strActive);
                        removeClass(scrollbarVars._scrollbar, strActive);

                        mouseDownScroll = undefined;
                        mouseDownOffset = undefined;
                        mouseDownInvertedScale = 1;

                        decreaseTrackScrollAmount();

                        if (trackTimeout !== undefined) {
                            _base.scrollStop();
                            clearTimeout(trackTimeout);
                            trackTimeout = undefined;
                        }

                        if (event) {
                            var rect = _hostElementNative[LEXICON.bCR]();
                            var mouseInsideHost = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

                            //if mouse is outside host element
                            if (!mouseInsideHost)
                                hostOnMouseLeave();

                            if (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove)
                                refreshScrollbarsAutoHide(false);
                        }
                    }
                    function onHandleMouseTouchDown(event) {
                        if (onMouseTouchDownContinue(event))
                            onHandleMouseTouchDownAction(event);
                    }
                    function onHandleMouseTouchDownAction(event) {
                        mouseDownScroll = _viewportElement[scroll]();
                        mouseDownScroll = isNaN(mouseDownScroll) ? 0 : mouseDownScroll;
                        if (_isRTL && isHorizontal && !_rtlScrollBehavior.n || !_isRTL)
                            mouseDownScroll = mouseDownScroll < 0 ? 0 : mouseDownScroll;

                        mouseDownInvertedScale = getHostElementInvertedScale()[xy];
                        mouseDownOffset = getPointerPosition(event);

                        _scrollbarsHandlesDefineScrollPos = !getPreparedScrollbarsOption(strSnapHandle);
                        addClass(_bodyElement, _classNameDragging);
                        addClass(scrollbarVars._handle, strActive);
                        addClass(scrollbarVars._scrollbar, strActive);

                        setupResponsiveEventListener(_documentElement,
                            [_strMouseTouchMoveEvent, _strMouseTouchUpEvent, _strSelectStartEvent],
                            [documentDragMove, documentMouseTouchUp, documentOnSelectStart]);
                        COMPATIBILITY.rAF()(function() {
                            setupResponsiveEventListener(_documentElement, strClickEvent, stopClickEventPropagation, false, { _capture: true });
                        });
                        

                        if (_msieVersion || !_documentMixed)
                            COMPATIBILITY.prvD(event);
                        COMPATIBILITY.stpP(event);
                    }
                    function onTrackMouseTouchDown(event) {
                        if (onMouseTouchDownContinue(event)) {
                            var handleToViewportRatio = scrollbarVars._info._handleLength / Math.round(MATH.min(1, _viewportSize[scrollbarVars._w_h] / _contentScrollSizeCache[scrollbarVars._w_h]) * scrollbarVars._info._trackLength);
                            var scrollDistance = MATH.round(_viewportSize[scrollbarVars._w_h] * handleToViewportRatio);
                            var scrollBaseDuration = 270 * handleToViewportRatio;
                            var scrollFirstIterationDelay = 400 * handleToViewportRatio;
                            var trackOffset = scrollbarVars._track.offset()[scrollbarVars._left_top];
                            var ctrlKey = event.ctrlKey;
                            var instantScroll = event.shiftKey;
                            var instantScrollTransition = instantScroll && ctrlKey;
                            var isFirstIteration = true;
                            var easing = 'linear';
                            var decreaseScroll;
                            var finishedCondition;
                            var scrollActionFinsished = function (transition) {
                                if (_scrollbarsHandlesDefineScrollPos)
                                    refreshScrollbarHandleOffset(isHorizontal, transition);
                            };
                            var scrollActionInstantFinished = function () {
                                scrollActionFinsished();
                                onHandleMouseTouchDownAction(event);
                            };
                            var scrollAction = function () {
                                if (!_destroyed) {
                                    var mouseOffset = (mouseDownOffset - trackOffset) * mouseDownInvertedScale;
                                    var handleOffset = scrollbarVarsInfo._handleOffset;
                                    var trackLength = scrollbarVarsInfo._trackLength;
                                    var handleLength = scrollbarVarsInfo._handleLength;
                                    var scrollRange = scrollbarVarsInfo._maxScroll;
                                    var currScroll = scrollbarVarsInfo._currentScroll;
                                    var scrollDuration = scrollBaseDuration * scrollDurationFactor;
                                    var timeoutDelay = isFirstIteration ? MATH.max(scrollFirstIterationDelay, scrollDuration) : scrollDuration;
                                    var instantScrollPosition = scrollRange * ((mouseOffset - (handleLength / 2)) / (trackLength - handleLength)); // 100% * positionPercent
                                    var rtlIsNormal = _isRTL && isHorizontal && ((!_rtlScrollBehavior.i && !_rtlScrollBehavior.n) || _normalizeRTLCache);
                                    var decreaseScrollCondition = rtlIsNormal ? handleOffset < mouseOffset : handleOffset > mouseOffset;
                                    var scrollObj = {};
                                    var animationObj = {
                                        easing: easing,
                                        step: function (now) {
                                            if (_scrollbarsHandlesDefineScrollPos) {
                                                _viewportElement[scroll](now); //https://github.com/jquery/jquery/issues/4340
                                                refreshScrollbarHandleOffset(isHorizontal, now);
                                            }
                                        }
                                    };
                                    instantScrollPosition = isFinite(instantScrollPosition) ? instantScrollPosition : 0;
                                    instantScrollPosition = _isRTL && isHorizontal && !_rtlScrollBehavior.i ? (scrollRange - instantScrollPosition) : instantScrollPosition;

                                    //_base.scrollStop();

                                    if (instantScroll) {
                                        _viewportElement[scroll](instantScrollPosition); //scroll instantly to new position
                                        if (instantScrollTransition) {
                                            //get the scroll position after instant scroll (in case CSS Snap Points are used) to get the correct snapped scroll position
                                            //and the animation stops at the correct point
                                            instantScrollPosition = _viewportElement[scroll]();
                                            //scroll back to the position before instant scrolling so animation can be performed
                                            _viewportElement[scroll](currScroll);

                                            instantScrollPosition = rtlIsNormal && _rtlScrollBehavior.i ? (scrollRange - instantScrollPosition) : instantScrollPosition;
                                            instantScrollPosition = rtlIsNormal && _rtlScrollBehavior.n ? -instantScrollPosition : instantScrollPosition;

                                            scrollObj[xy] = instantScrollPosition;
                                            _base.scroll(scrollObj, extendDeep(animationObj, {
                                                duration: 130,
                                                complete: scrollActionInstantFinished
                                            }));
                                        }
                                        else
                                            scrollActionInstantFinished();
                                    }
                                    else {
                                        decreaseScroll = isFirstIteration ? decreaseScrollCondition : decreaseScroll;
                                        finishedCondition = rtlIsNormal
                                            ? (decreaseScroll ? handleOffset + handleLength >= mouseOffset : handleOffset <= mouseOffset)
                                            : (decreaseScroll ? handleOffset <= mouseOffset : handleOffset + handleLength >= mouseOffset);

                                        if (finishedCondition) {
                                            clearTimeout(trackTimeout);
                                            _base.scrollStop();
                                            trackTimeout = undefined;
                                            scrollActionFinsished(true);
                                        }
                                        else {
                                            trackTimeout = setTimeout(scrollAction, timeoutDelay);

                                            scrollObj[xy] = (decreaseScroll ? '-=' : '+=') + scrollDistance;
                                            _base.scroll(scrollObj, extendDeep(animationObj, {
                                                duration: scrollDuration
                                            }));
                                        }
                                        isFirstIteration = false;
                                    }
                                }
                            };
                            if (ctrlKey)
                                increaseTrackScrollAmount();

                            mouseDownInvertedScale = getHostElementInvertedScale()[xy];
                            mouseDownOffset = COMPATIBILITY.page(event)[xy];

                            _scrollbarsHandlesDefineScrollPos = !getPreparedScrollbarsOption(strSnapHandle);
                            addClass(_bodyElement, _classNameDragging);
                            addClass(scrollbarVars._track, strActive);
                            addClass(scrollbarVars._scrollbar, strActive);

                            setupResponsiveEventListener(_documentElement,
                                [_strMouseTouchUpEvent, _strKeyDownEvent, _strKeyUpEvent, _strSelectStartEvent],
                                [documentMouseTouchUp, documentKeyDown, documentKeyUp, documentOnSelectStart]);

                            scrollAction();
                            COMPATIBILITY.prvD(event);
                            COMPATIBILITY.stpP(event);
                        }
                    }
                    function onTrackMouseTouchEnter(event) {
                        //make sure both scrollbars will stay visible if one scrollbar is hovered if autoHide is "scroll" or "move".
                        _scrollbarsHandleHovered = true;
                        if (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove)
                            refreshScrollbarsAutoHide(true);
                    }
                    function onTrackMouseTouchLeave(event) {
                        _scrollbarsHandleHovered = false;
                        if (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove)
                            refreshScrollbarsAutoHide(false);
                    }
                    function onScrollbarMouseTouchDown(event) {
                        COMPATIBILITY.stpP(event);
                    }

                    addDestroyEventListener(scrollbarVars._handle,
                        _strMouseTouchDownEvent,
                        onHandleMouseTouchDown);
                    addDestroyEventListener(scrollbarVars._track,
                        [_strMouseTouchDownEvent, _strMouseEnter, _strMouseLeave],
                        [onTrackMouseTouchDown, onTrackMouseTouchEnter, onTrackMouseTouchLeave]);
                    addDestroyEventListener(scrollbarVars._scrollbar,
                        _strMouseTouchDownEvent,
                        onScrollbarMouseTouchDown);

                    if (_supportTransition) {
                        addDestroyEventListener(scrollbarVars._scrollbar, _strTransitionEndEvent, function (event) {
                            if (event.target !== scrollbarVars._scrollbar[0])
                                return;
                            refreshScrollbarHandleLength(isHorizontal);
                            refreshScrollbarHandleOffset(isHorizontal);
                        });
                    }
                }

                /**
                 * Shows or hides the given scrollbar and applied a class name which indicates if the scrollbar is scrollable or not.
                 * @param isHorizontal True if the horizontal scrollbar is the target, false if the vertical scrollbar is the target.
                 * @param shallBeVisible True if the scrollbar shall be shown, false if hidden.
                 * @param canScroll True if the scrollbar is scrollable, false otherwise.
                 */
                function refreshScrollbarAppearance(isHorizontal, shallBeVisible, canScroll) {
                    var scrollbarHiddenClassName = isHorizontal ? _classNameHostScrollbarHorizontalHidden : _classNameHostScrollbarVerticalHidden;
                    var scrollbarElement = isHorizontal ? _scrollbarHorizontalElement : _scrollbarVerticalElement;

                    addRemoveClass(_hostElement, scrollbarHiddenClassName, !shallBeVisible);
                    addRemoveClass(scrollbarElement, _classNameScrollbarUnusable, !canScroll);
                }

                /**
                 * Autoshows / autohides both scrollbars with.
                 * @param shallBeVisible True if the scrollbars shall be autoshown (only the case if they are hidden by a autohide), false if the shall be auto hidden.
                 * @param delayfree True if the scrollbars shall be hidden without a delay, false or undefined otherwise.
                 */
                function refreshScrollbarsAutoHide(shallBeVisible, delayfree) {
                    clearTimeout(_scrollbarsAutoHideTimeoutId);
                    if (shallBeVisible) {
                        //if(_hasOverflowCache.x && _hideOverflowCache.xs)
                        removeClass(_scrollbarHorizontalElement, _classNameScrollbarAutoHidden);
                        //if(_hasOverflowCache.y && _hideOverflowCache.ys)
                        removeClass(_scrollbarVerticalElement, _classNameScrollbarAutoHidden);
                    }
                    else {
                        var anyActive;
                        var strActive = 'active';
                        var hide = function () {
                            if (!_scrollbarsHandleHovered && !_destroyed) {
                                anyActive = _scrollbarHorizontalHandleElement.hasClass(strActive) || _scrollbarVerticalHandleElement.hasClass(strActive);
                                if (!anyActive && (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove || _scrollbarsAutoHideLeave))
                                    addClass(_scrollbarHorizontalElement, _classNameScrollbarAutoHidden);
                                if (!anyActive && (_scrollbarsAutoHideScroll || _scrollbarsAutoHideMove || _scrollbarsAutoHideLeave))
                                    addClass(_scrollbarVerticalElement, _classNameScrollbarAutoHidden);
                            }
                        };
                        if (_scrollbarsAutoHideDelay > 0 && delayfree !== true)
                            _scrollbarsAutoHideTimeoutId = setTimeout(hide, _scrollbarsAutoHideDelay);
                        else
                            hide();
                    }
                }

                /**
                 * Refreshes the handle length of the given scrollbar.
                 * @param isHorizontal True if the horizontal scrollbar handle shall be refreshed, false if the vertical one shall be refreshed.
                 */
                function refreshScrollbarHandleLength(isHorizontal) {
                    var handleCSS = {};
                    var scrollbarVars = getScrollbarVars(isHorizontal);
                    var scrollbarVarsInfo = scrollbarVars._info;
                    var digit = 1000000;
                    //get and apply intended handle length
                    var handleRatio = MATH.min(1, _viewportSize[scrollbarVars._w_h] / _contentScrollSizeCache[scrollbarVars._w_h]);
                    handleCSS[scrollbarVars._width_height] = (MATH.floor(handleRatio * 100 * digit) / digit) + '%'; //the last * digit / digit is for flooring to the 4th digit

                    if (!nativeOverlayScrollbarsAreActive())
                        scrollbarVars._handle.css(handleCSS);

                    //measure the handle length to respect min & max length
                    scrollbarVarsInfo._handleLength = scrollbarVars._handle[0]['offset' + scrollbarVars._Width_Height];
                    scrollbarVarsInfo._handleLengthRatio = handleRatio;
                }

                /**
                 * Refreshes the handle offset of the given scrollbar.
                 * @param isHorizontal True if the horizontal scrollbar handle shall be refreshed, false if the vertical one shall be refreshed.
                 * @param scrollOrTransition The scroll position of the given scrollbar axis to which the handle shall be moved or a boolean which indicates whether a transition shall be applied. If undefined or boolean if the current scroll-offset is taken. (if isHorizontal ? scrollLeft : scrollTop)
                 */
                function refreshScrollbarHandleOffset(isHorizontal, scrollOrTransition) {
                    var transition = type(scrollOrTransition) == TYPES.b;
                    var transitionDuration = 250;
                    var isRTLisHorizontal = _isRTL && isHorizontal;
                    var scrollbarVars = getScrollbarVars(isHorizontal);
                    var scrollbarVarsInfo = scrollbarVars._info;
                    var strTranslateBrace = 'translate(';
                    var strTransform = VENDORS._cssProperty('transform');
                    var strTransition = VENDORS._cssProperty('transition');
                    var nativeScroll = isHorizontal ? _viewportElement[_strScrollLeft]() : _viewportElement[_strScrollTop]();
                    var currentScroll = scrollOrTransition === undefined || transition ? nativeScroll : scrollOrTransition;

                    //measure the handle length to respect min & max length
                    var handleLength = scrollbarVarsInfo._handleLength;
                    var trackLength = scrollbarVars._track[0]['offset' + scrollbarVars._Width_Height];
                    var handleTrackDiff = trackLength - handleLength;
                    var handleCSS = {};
                    var transformOffset;
                    var translateValue;

                    //DONT use the variable '_contentScrollSizeCache[scrollbarVars._w_h]' instead of '_viewportElement[0]['scroll' + scrollbarVars._Width_Height]'
                    // because its a bit behind during the small delay when content size updates
                    //(delay = mutationObserverContentLag, if its 0 then this var could be used)
                    var maxScroll = (_viewportElementNative[_strScroll + scrollbarVars._Width_Height] - _viewportElementNative['client' + scrollbarVars._Width_Height]) * (_rtlScrollBehavior.n && isRTLisHorizontal ? -1 : 1); //* -1 if rtl scroll max is negative
                    var getScrollRatio = function (base) {
                        return isNaN(base / maxScroll) ? 0 : MATH.max(0, MATH.min(1, base / maxScroll));
                    };
                    var getHandleOffset = function (scrollRatio) {
                        var offset = handleTrackDiff * scrollRatio;
                        offset = isNaN(offset) ? 0 : offset;
                        offset = (isRTLisHorizontal && !_rtlScrollBehavior.i) ? (trackLength - handleLength - offset) : offset;
                        offset = MATH.max(0, offset);
                        return offset;
                    };
                    var scrollRatio = getScrollRatio(nativeScroll);
                    var unsnappedScrollRatio = getScrollRatio(currentScroll);
                    var handleOffset = getHandleOffset(unsnappedScrollRatio);
                    var snappedHandleOffset = getHandleOffset(scrollRatio);

                    scrollbarVarsInfo._maxScroll = maxScroll;
                    scrollbarVarsInfo._currentScroll = nativeScroll;
                    scrollbarVarsInfo._currentScrollRatio = scrollRatio;

                    if (_supportTransform) {
                        transformOffset = isRTLisHorizontal ? -(trackLength - handleLength - handleOffset) : handleOffset; //in px
                        //transformOffset = (transformOffset / trackLength * 100) * (trackLength / handleLength); //in %
                        translateValue = isHorizontal ? strTranslateBrace + transformOffset + 'px, 0)' : strTranslateBrace + '0, ' + transformOffset + 'px)';

                        handleCSS[strTransform] = translateValue;

                        //apply or clear up transition
                        if (_supportTransition)
                            handleCSS[strTransition] = transition && MATH.abs(handleOffset - scrollbarVarsInfo._handleOffset) > 1 ? getCSSTransitionString(scrollbarVars._handle) + ', ' + (strTransform + _strSpace + transitionDuration + 'ms') : _strEmpty;
                    }
                    else
                        handleCSS[scrollbarVars._left_top] = handleOffset;


                    //only apply css if offset has changed and overflow exists.
                    if (!nativeOverlayScrollbarsAreActive()) {
                        scrollbarVars._handle.css(handleCSS);

                        //clear up transition
                        if (_supportTransform && _supportTransition && transition) {
                            scrollbarVars._handle.one(_strTransitionEndEvent, function () {
                                if (!_destroyed)
                                    scrollbarVars._handle.css(strTransition, _strEmpty);
                            });
                        }
                    }

                    scrollbarVarsInfo._handleOffset = handleOffset;
                    scrollbarVarsInfo._snappedHandleOffset = snappedHandleOffset;
                    scrollbarVarsInfo._trackLength = trackLength;
                }

                /**
                 * Refreshes the interactivity of the given scrollbar element.
                 * @param isTrack True if the track element is the target, false if the handle element is the target.
                 * @param value True for interactivity false for no interactivity.
                 */
                function refreshScrollbarsInteractive(isTrack, value) {
                    var action = value ? 'removeClass' : 'addClass';
                    var element1 = isTrack ? _scrollbarHorizontalTrackElement : _scrollbarHorizontalHandleElement;
                    var element2 = isTrack ? _scrollbarVerticalTrackElement : _scrollbarVerticalHandleElement;
                    var className = isTrack ? _classNameScrollbarTrackOff : _classNameScrollbarHandleOff;

                    element1[action](className);
                    element2[action](className);
                }

                /**
                 * Returns a object which is used for fast access for specific variables.
                 * @param isHorizontal True if the horizontal scrollbar vars shall be accessed, false if the vertical scrollbar vars shall be accessed.
                 * @returns {{wh: string, WH: string, lt: string, _wh: string, _lt: string, t: *, h: *, c: {}, s: *}}
                 */
                function getScrollbarVars(isHorizontal) {
                    return {
                        _width_height: isHorizontal ? _strWidth : _strHeight,
                        _Width_Height: isHorizontal ? 'Width' : 'Height',
                        _left_top: isHorizontal ? _strLeft : _strTop,
                        _Left_Top: isHorizontal ? 'Left' : 'Top',
                        _x_y: isHorizontal ? _strX : _strY,
                        _X_Y: isHorizontal ? 'X' : 'Y',
                        _w_h: isHorizontal ? 'w' : 'h',
                        _l_t: isHorizontal ? 'l' : 't',
                        _track: isHorizontal ? _scrollbarHorizontalTrackElement : _scrollbarVerticalTrackElement,
                        _handle: isHorizontal ? _scrollbarHorizontalHandleElement : _scrollbarVerticalHandleElement,
                        _scrollbar: isHorizontal ? _scrollbarHorizontalElement : _scrollbarVerticalElement,
                        _info: isHorizontal ? _scrollHorizontalInfo : _scrollVerticalInfo
                    };
                }


                //==== Scrollbar Corner ====//

                /**
                 * Builds or destroys the scrollbar corner DOM element.
                 * @param destroy Indicates whether the DOM shall be build or destroyed.
                 */
                function setupScrollbarCornerDOM(destroy) {
                    _scrollbarCornerElement = _scrollbarCornerElement || selectOrGenerateDivByClass(_classNameScrollbarCorner, true);

                    if (!destroy) {
                        if (!_domExists) {
                            _hostElement.append(_scrollbarCornerElement);
                        }
                    }
                    else {
                        if (_domExists && _initialized) {
                            removeClass(_scrollbarCornerElement.removeAttr(LEXICON.s), _classNamesDynamicDestroy);
                        }
                        else {
                            remove(_scrollbarCornerElement);
                        }
                    }
                }

                /**
                 * Initializes all scrollbar corner interactivity events.
                 */
                function setupScrollbarCornerEvents() {
                    var insideIFrame = _windowElementNative.top !== _windowElementNative;
                    var mouseDownPosition = {};
                    var mouseDownSize = {};
                    var mouseDownInvertedScale = {};
                    var reconnectMutationObserver;

                    function documentDragMove(event) {
                        if (onMouseTouchDownContinue(event)) {
                            var pageOffset = getCoordinates(event);
                            var hostElementCSS = {};
                            if (_resizeHorizontal || _resizeBoth)
                                hostElementCSS[_strWidth] = (mouseDownSize.w + (pageOffset.x - mouseDownPosition.x) * mouseDownInvertedScale.x);
                            if (_resizeVertical || _resizeBoth)
                                hostElementCSS[_strHeight] = (mouseDownSize.h + (pageOffset.y - mouseDownPosition.y) * mouseDownInvertedScale.y);
                            _hostElement.css(hostElementCSS);
                            COMPATIBILITY.stpP(event);
                        }
                        else {
                            documentMouseTouchUp(event);
                        }
                    }
                    function documentMouseTouchUp(event) {
                        var eventIsTrusted = event !== undefined;

                        setupResponsiveEventListener(_documentElement,
                            [_strSelectStartEvent, _strMouseTouchMoveEvent, _strMouseTouchUpEvent],
                            [documentOnSelectStart, documentDragMove, documentMouseTouchUp],
                            true);

                        removeClass(_bodyElement, _classNameDragging);
                        if (_scrollbarCornerElement.releaseCapture)
                            _scrollbarCornerElement.releaseCapture();

                        if (eventIsTrusted) {
                            if (reconnectMutationObserver)
                                connectMutationObservers();
                            _base.update(_strAuto);
                        }
                        reconnectMutationObserver = false;
                    }
                    function onMouseTouchDownContinue(event) {
                        var originalEvent = event.originalEvent || event;
                        var isTouchEvent = originalEvent.touches !== undefined;
                        return _sleeping || _destroyed ? false : COMPATIBILITY.mBtn(event) === 1 || isTouchEvent;
                    }
                    function getCoordinates(event) {
                        return _msieVersion && insideIFrame ? { x: event.screenX, y: event.screenY } : COMPATIBILITY.page(event);
                    }

                    addDestroyEventListener(_scrollbarCornerElement, _strMouseTouchDownEvent, function (event) {
                        if (onMouseTouchDownContinue(event) && !_resizeNone) {
                            if (_mutationObserversConnected) {
                                reconnectMutationObserver = true;
                                disconnectMutationObservers();
                            }

                            mouseDownPosition = getCoordinates(event);

                            mouseDownSize.w = _hostElementNative[LEXICON.oW] - (!_isBorderBox ? _paddingX : 0);
                            mouseDownSize.h = _hostElementNative[LEXICON.oH] - (!_isBorderBox ? _paddingY : 0);
                            mouseDownInvertedScale = getHostElementInvertedScale();

                            setupResponsiveEventListener(_documentElement,
                                [_strSelectStartEvent, _strMouseTouchMoveEvent, _strMouseTouchUpEvent],
                                [documentOnSelectStart, documentDragMove, documentMouseTouchUp]);

                            addClass(_bodyElement, _classNameDragging);
                            if (_scrollbarCornerElement.setCapture)
                                _scrollbarCornerElement.setCapture();

                            COMPATIBILITY.prvD(event);
                            COMPATIBILITY.stpP(event);
                        }
                    });
                }


                //==== Utils ====//

                /**
                 * Calls the callback with the given name. The Context of this callback is always _base (this).
                 * @param name The name of the target which shall be called.
                 * @param args The args with which the callback shall be called.
                 * @param dependent Boolean which decides whether the callback shall be fired, undefined is like a "true" value.
                 */
                function dispatchCallback(name, args, dependent) {
                    if (dependent === false)
                        return;
                    if (_initialized) {
                        var callback = _currentPreparedOptions.callbacks[name];
                        var extensionOnName = name;
                        var ext;

                        if (extensionOnName.substr(0, 2) === 'on')
                            extensionOnName = extensionOnName.substr(2, 1).toLowerCase() + extensionOnName.substr(3);

                        if (type(callback) == TYPES.f)
                            callback.call(_base, args);

                        each(_extensions, function () {
                            ext = this;
                            if (type(ext.on) == TYPES.f)
                                ext.on(extensionOnName, args);
                        });
                    }
                    else if (!_destroyed)
                        _callbacksInitQeueue.push({ n: name, a: args });
                }

                /**
                 * Sets the "top, right, bottom, left" properties, with a given prefix, of the given css object.
                 * @param targetCSSObject The css object to which the values shall be applied.
                 * @param prefix The prefix of the "top, right, bottom, left" css properties. (example: 'padding-' is a valid prefix)
                 * @param values A array of values which shall be applied to the "top, right, bottom, left" -properties. The array order is [top, right, bottom, left].
                 * If this argument is undefined the value '' (empty string) will be applied to all properties.
                 */
                function setTopRightBottomLeft(targetCSSObject, prefix, values) {
                    prefix = prefix || _strEmpty;
                    values = values || [_strEmpty, _strEmpty, _strEmpty, _strEmpty];

                    targetCSSObject[prefix + _strTop] = values[0];
                    targetCSSObject[prefix + _strRight] = values[1];
                    targetCSSObject[prefix + _strBottom] = values[2];
                    targetCSSObject[prefix + _strLeft] = values[3];
                }

                /**
                 * Gets the "top, right, bottom, left" CSS properties of the CSS property with the given prefix from the host element.
                 * @param prefix The prefix of the "top, right, bottom, left" css properties. (example: 'padding-' is a valid prefix)
                 * @param suffix The suffix of the "top, right, bottom, left" css properties. (example: 'border-' is a valid prefix with '-width' is a valid suffix)
                 * @param zeroX True if the x axis shall be 0.
                 * @param zeroY True if the y axis shall be 0.
                 * @returns {{}} The object which contains the numbers of the read CSS properties.
                 */
                function getTopRightBottomLeftHost(prefix, suffix, zeroX, zeroY) {
                    suffix = suffix || _strEmpty;
                    prefix = prefix || _strEmpty;
                    return {
                        t: zeroY ? 0 : parseToZeroOrNumber(_hostElement.css(prefix + _strTop + suffix)),
                        r: zeroX ? 0 : parseToZeroOrNumber(_hostElement.css(prefix + _strRight + suffix)),
                        b: zeroY ? 0 : parseToZeroOrNumber(_hostElement.css(prefix + _strBottom + suffix)),
                        l: zeroX ? 0 : parseToZeroOrNumber(_hostElement.css(prefix + _strLeft + suffix))
                    };
                }

                /**
                 * Returns the computed CSS transition string from the given element.
                 * @param element The element from which the transition string shall be returned.
                 * @returns {string} The CSS transition string from the given element.
                 */
                function getCSSTransitionString(element) {
                    var transitionStr = VENDORS._cssProperty('transition');
                    var assembledValue = element.css(transitionStr);
                    if (assembledValue)
                        return assembledValue;
                    var regExpString = '\\s*(' + '([^,(]+(\\(.+?\\))?)+' + ')[\\s,]*';
                    var regExpMain = new RegExp(regExpString);
                    var regExpValidate = new RegExp('^(' + regExpString + ')+$');
                    var properties = 'property duration timing-function delay'.split(' ');
                    var result = [];
                    var strResult;
                    var valueArray;
                    var i = 0;
                    var j;
                    var splitCssStyleByComma = function (str) {
                        strResult = [];
                        if (!str.match(regExpValidate))
                            return str;
                        while (str.match(regExpMain)) {
                            strResult.push(RegExp.$1);
                            str = str.replace(regExpMain, _strEmpty);
                        }

                        return strResult;
                    };
                    for (; i < properties[LEXICON.l]; i++) {
                        valueArray = splitCssStyleByComma(element.css(transitionStr + '-' + properties[i]));
                        for (j = 0; j < valueArray[LEXICON.l]; j++)
                            result[j] = (result[j] ? result[j] + _strSpace : _strEmpty) + valueArray[j];
                    }
                    return result.join(', ');
                }

                /**
                 * Generates a Regular Expression which matches with a string which starts with 'os-host'.
                 * @param {boolean} withCurrClassNameOption The Regular Expression also matches if the string is the current ClassName option (multiple values splitted by space possible).
                 * @param {boolean} withOldClassNameOption The Regular Expression also matches if the string is the old ClassName option (multiple values splitted by space possible).
                 */
                function createHostClassNameRegExp(withCurrClassNameOption, withOldClassNameOption) {
                    var i;
                    var split;
                    var appendix;
                    var appendClasses = function (classes, condition) {
                        appendix = '';
                        if (condition && typeof classes == TYPES.s) {
                            split = classes.split(_strSpace);
                            for (i = 0; i < split[LEXICON.l]; i++)
                                appendix += '|' + split[i] + '$';
                            // split[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') for escaping regex characters
                        }
                        return appendix;
                    };

                    return new RegExp(
                        '(^' + _classNameHostElement + '([-_].+|)$)' +
                        appendClasses(_classNameCache, withCurrClassNameOption) +
                        appendClasses(_oldClassName, withOldClassNameOption), 'g');
                }

                /**
                 * Calculates the host-elements inverted scale. (invertedScale = 1 / scale)
                 * @returns {{x: number, y: number}} The scale of the host-element.
                 */
                function getHostElementInvertedScale() {
                    var rect = _paddingElementNative[LEXICON.bCR]();
                    return {
                        x: _supportTransform ? 1 / (MATH.round(rect.width) / _paddingElementNative[LEXICON.oW]) || 1 : 1,
                        y: _supportTransform ? 1 / (MATH.round(rect.height) / _paddingElementNative[LEXICON.oH]) || 1 : 1
                    };
                }

                /**
                 * Checks whether the given object is a HTMLElement.
                 * @param o The object which shall be checked.
                 * @returns {boolean} True the given object is a HTMLElement, false otherwise.
                 */
                function isHTMLElement(o) {
                    var strOwnerDocument = 'ownerDocument';
                    var strHTMLElement = 'HTMLElement';
                    var wnd = o && o[strOwnerDocument] ? (o[strOwnerDocument].parentWindow || window) : window;
                    return (
                        typeof wnd[strHTMLElement] == TYPES.o ? o instanceof wnd[strHTMLElement] : //DOM2
                            o && typeof o == TYPES.o && o !== null && o.nodeType === 1 && typeof o.nodeName == TYPES.s
                    );
                }

                /**
                 * Compares 2 arrays and returns the differences between them as a array.
                 * @param a1 The first array which shall be compared.
                 * @param a2 The second array which shall be compared.
                 * @returns {Array} The differences between the two arrays.
                 */
                function getArrayDifferences(a1, a2) {
                    var a = [];
                    var diff = [];
                    var i;
                    var k;
                    for (i = 0; i < a1.length; i++)
                        a[a1[i]] = true;
                    for (i = 0; i < a2.length; i++) {
                        if (a[a2[i]])
                            delete a[a2[i]];
                        else
                            a[a2[i]] = true;
                    }
                    for (k in a)
                        diff.push(k);
                    return diff;
                }

                /**
                 * Returns Zero or the number to which the value can be parsed.
                 * @param value The value which shall be parsed.
                 * @param toFloat Indicates whether the number shall be parsed to a float.
                 */
                function parseToZeroOrNumber(value, toFloat) {
                    var num = toFloat ? parseFloat(value) : parseInt(value, 10);
                    return isNaN(num) ? 0 : num;
                }

                /**
                 * Gets several information of the textarea and returns them as a object or undefined if the browser doesn't support it.
                 * @returns {{cursorRow: Number, cursorCol, rows: Number, cols: number, wRow: number, pos: number, max : number}} or undefined if not supported.
                 */
                function getTextareaInfo() {
                    //read needed values
                    var textareaCursorPosition = _targetElementNative.selectionStart;
                    if (textareaCursorPosition === undefined)
                        return;

                    var textareaValue = _targetElement.val();
                    var textareaLength = textareaValue[LEXICON.l];
                    var textareaRowSplit = textareaValue.split('\n');
                    var textareaLastRow = textareaRowSplit[LEXICON.l];
                    var textareaCurrentCursorRowSplit = textareaValue.substr(0, textareaCursorPosition).split('\n');
                    var widestRow = 0;
                    var textareaLastCol = 0;
                    var cursorRow = textareaCurrentCursorRowSplit[LEXICON.l];
                    var cursorCol = textareaCurrentCursorRowSplit[textareaCurrentCursorRowSplit[LEXICON.l] - 1][LEXICON.l];
                    var rowCols;
                    var i;

                    //get widest Row and the last column of the textarea
                    for (i = 0; i < textareaRowSplit[LEXICON.l]; i++) {
                        rowCols = textareaRowSplit[i][LEXICON.l];
                        if (rowCols > textareaLastCol) {
                            widestRow = i + 1;
                            textareaLastCol = rowCols;
                        }
                    }

                    return {
                        _cursorRow: cursorRow, //cursorRow
                        _cursorColumn: cursorCol, //cursorCol
                        _rows: textareaLastRow, //rows
                        _columns: textareaLastCol, //cols
                        _widestRow: widestRow, //wRow
                        _cursorPosition: textareaCursorPosition, //pos
                        _cursorMax: textareaLength //max
                    };
                }

                /**
                 * Determines whether native overlay scrollbars are active.
                 * @returns {boolean} True if native overlay scrollbars are active, false otherwise.
                 */
                function nativeOverlayScrollbarsAreActive() {
                    return (_ignoreOverlayScrollbarHidingCache && (_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y));
                }

                /**
                 * Gets the element which is used to measure the content size.
                 * @returns {*} TextareaCover if target element is textarea else the ContentElement.
                 */
                function getContentMeasureElement() {
                    return _isTextarea ? _textareaCoverElement[0] : _contentElementNative;
                }

                /**
                 * Generates a string which represents a HTML div with the given classes or attributes.
                 * @param classesOrAttrs The class of the div as string or a object which represents the attributes of the div. (The class attribute can also be written as "className".)
                 * @param content The content of the div as string.
                 * @returns {string} The concated string which represents a HTML div and its content.
                 */
                function generateDiv(classesOrAttrs, content) {
                    return '<div ' + (classesOrAttrs ? type(classesOrAttrs) == TYPES.s ?
                        'class="' + classesOrAttrs + '"' :
                        (function () {
                            var key;
                            var attrs = _strEmpty;
                            if (FRAMEWORK.isPlainObject(classesOrAttrs)) {
                                for (key in classesOrAttrs)
                                    attrs += (key === 'c' ? 'class' : key) + '="' + classesOrAttrs[key] + '" ';
                            }
                            return attrs;
                        })() :
                        _strEmpty) +
                        '>' +
                        (content || _strEmpty) +
                        '</div>';
                }

                /**
                 * Selects or generates a div with the given class attribute.
                 * @param className The class names (divided by spaces) of the div which shall be selected or generated.
                 * @param selectParentOrOnlyChildren The parent element from which of the element shall be selected. (if undefined or boolean its hostElement)
                 * If its a boolean it decides whether only the children of the host element shall be selected.
                 * @returns {*} The generated or selected element.
                 */
                function selectOrGenerateDivByClass(className, selectParentOrOnlyChildren) {
                    var onlyChildren = type(selectParentOrOnlyChildren) == TYPES.b;
                    var selectParent = onlyChildren ? _hostElement : (selectParentOrOnlyChildren || _hostElement);

                    return (_domExists && !selectParent[LEXICON.l])
                        ? null
                        : _domExists
                            ? selectParent[onlyChildren ? 'children' : 'find'](_strDot + className.replace(/\s/g, _strDot)).eq(0)
                            : FRAMEWORK(generateDiv(className))
                }

                /**
                 * Gets the value of the given property from the given object.
                 * @param obj The object from which the property value shall be got.
                 * @param path The property of which the value shall be got.
                 * @returns {*} Returns the value of the searched property or undefined of the property wasn't found.
                 */
                function getObjectPropVal(obj, path) {
                    var splits = path.split(_strDot);
                    var i = 0;
                    var val;
                    for (; i < splits.length; i++) {
                        if (!obj[LEXICON.hOP](splits[i]))
                            return;
                        val = obj[splits[i]];
                        if (i < splits.length && type(val) == TYPES.o)
                            obj = val;
                    }
                    return val;
                }

                /**
                 * Sets the value of the given property from the given object.
                 * @param obj The object from which the property value shall be set.
                 * @param path The property of which the value shall be set.
                 * @param val The value of the property which shall be set.
                 */
                function setObjectPropVal(obj, path, val) {
                    var splits = path.split(_strDot);
                    var splitsLength = splits.length;
                    var i = 0;
                    var extendObj = {};
                    var extendObjRoot = extendObj;
                    for (; i < splitsLength; i++)
                        extendObj = extendObj[splits[i]] = i + 1 < splitsLength ? {} : val;
                    FRAMEWORK.extend(obj, extendObjRoot, true);
                }

                /**	
                 * Runs a action for each selector inside the updateOnLoad option.	
                 * @param {Function} action The action for each updateOnLoad selector, the arguments the function takes is the index and the value (the selector).	
                 */
                function eachUpdateOnLoad(action) {
                    var updateOnLoad = _currentPreparedOptions.updateOnLoad;
                    updateOnLoad = type(updateOnLoad) == TYPES.s ? updateOnLoad.split(_strSpace) : updateOnLoad;

                    if (COMPATIBILITY.isA(updateOnLoad) && !_destroyed) {
                        each(updateOnLoad, action);
                    }
                }


                //==== Utils Cache ====//

                /**
                 * Compares two values or objects and returns true if they aren't equal.
                 * @param current The first value or object which shall be compared.
                 * @param cache The second value or object which shall be compared.
                 * @param force If true the returned value is always true.
                 * @returns {boolean} True if both values or objects aren't equal or force is true, false otherwise.
                 */
                function checkCache(current, cache, force) {
                    if (force)
                        return force;
                    if (type(current) == TYPES.o && type(cache) == TYPES.o) {
                        for (var prop in current) {
                            if (prop !== 'c') {
                                if (current[LEXICON.hOP](prop) && cache[LEXICON.hOP](prop)) {
                                    if (checkCache(current[prop], cache[prop]))
                                        return true;
                                }
                                else {
                                    return true;
                                }
                            }
                        }
                    }
                    else {
                        return current !== cache;
                    }
                    return false;
                }


                //==== Shortcuts ====//

                /**
                 * jQuery extend method shortcut with a appended "true" as first argument.
                 */
                function extendDeep() {
                    return FRAMEWORK.extend.apply(this, [true].concat([].slice.call(arguments)));
                }

                /**
                 * jQuery addClass method shortcut.
                 */
                function addClass(el, classes) {
                    return _frameworkProto.addClass.call(el, classes);
                }

                /**
                 * jQuery removeClass method shortcut.
                 */
                function removeClass(el, classes) {
                    return _frameworkProto.removeClass.call(el, classes);
                }

                /**
                 * Adds or removes the given classes dependent on the boolean value. True for add, false for remove.
                 */
                function addRemoveClass(el, classes, doAdd) {
                    return doAdd ? addClass(el, classes) : removeClass(el, classes);
                }

                /**
                 * jQuery remove method shortcut.
                 */
                function remove(el) {
                    return _frameworkProto.remove.call(el);
                }

                /**
                 * Finds the first child element with the given selector of the given element.
                 * @param el The root element from which the selector shall be valid.
                 * @param selector The selector of the searched element.
                 * @returns {*} The first element which is a child of the given element and matches the givens selector.
                 */
                function findFirst(el, selector) {
                    return _frameworkProto.find.call(el, selector).eq(0);
                }


                //==== API ====//

                /**
                 * Puts the instance to sleep. It wont respond to any changes in the DOM and won't update. Scrollbar Interactivity is also disabled as well as the resize handle.
                 * This behavior can be reset by calling the update method.
                 */
                _base.sleep = function () {
                    _sleeping = true;
                };

                /**
                 * Updates the plugin and DOM to the current options.
                 * This method should only be called if a update is 100% required.
                 * @param force True if every property shall be updated and the cache shall be ignored.
                 * !INTERNAL USAGE! : force can be a string "auto", "sync" or "zoom" too
                 * if "auto" then before a real update the content size and host element attributes gets checked, and if they changed only then the update method will be called.
                 * if "sync" then the async update process (MutationObserver or UpdateLoop) gets synchronized and a corresponding update takes place if one was needed due to pending changes.
                 * if "zoom" then a update takes place where it's assumed that content and host size changed
                 * @returns {boolean|undefined} 
                 * If force is "sync" then a boolean is returned which indicates whether a update was needed due to pending changes.
                 * If force is "auto" then a boolean is returned whether a update was needed due to attribute or size changes.
                 * undefined otherwise.
                 */
                _base.update = function (force) {
                    if (_destroyed)
                        return;

                    var attrsChanged;
                    var contentSizeC;
                    var isString = type(force) == TYPES.s;
                    var doUpdateAuto;
                    var mutHost;
                    var mutContent;

                    if (isString) {
                        if (force === _strAuto) {
                            attrsChanged = meaningfulAttrsChanged();
                            contentSizeC = updateAutoContentSizeChanged();
                            doUpdateAuto = attrsChanged || contentSizeC;
                            if (doUpdateAuto) {
                                update({
                                    _contentSizeChanged: contentSizeC,
                                    _changedOptions: _initialized ? undefined : _currentPreparedOptions
                                });
                            }
                        }
                        else if (force === _strSync) {
                            if (_mutationObserversConnected) {
                                mutHost = _mutationObserverHostCallback(_mutationObserverHost.takeRecords());
                                mutContent = _mutationObserverContentCallback(_mutationObserverContent.takeRecords());
                            }
                            else {
                                mutHost = _base.update(_strAuto);
                            }
                        }
                        else if (force === 'zoom') {
                            update({
                                _hostSizeChanged: true,
                                _contentSizeChanged: true
                            });
                        }
                    }
                    else {
                        force = _sleeping || force;
                        _sleeping = false;
                        if (!_base.update(_strSync) || force)
                            update({ _force: force });
                    }

                    updateElementsOnLoad();

                    return doUpdateAuto || mutHost || mutContent;
                };

                /**
                 Gets or sets the current options. The update method will be called automatically if new options were set.
                 * @param newOptions If new options are given, then the new options will be set, if new options aren't given (undefined or a not a plain object) then the current options will be returned.
                 * @param value If new options is a property path string, then this value will be used to set the option to which the property path string leads.
                 * @returns {*}
                 */
                _base.options = function (newOptions, value) {
                    var option = {};
                    var changedOps;

                    //return current options if newOptions are undefined or empty
                    if (FRAMEWORK.isEmptyObject(newOptions) || !FRAMEWORK.isPlainObject(newOptions)) {
                        if (type(newOptions) == TYPES.s) {
                            if (arguments.length > 1) {
                                setObjectPropVal(option, newOptions, value);
                                changedOps = setOptions(option);
                            }
                            else
                                return getObjectPropVal(_currentOptions, newOptions);
                        }
                        else
                            return _currentOptions;
                    }
                    else {
                        changedOps = setOptions(newOptions);
                    }

                    if (!FRAMEWORK.isEmptyObject(changedOps)) {
                        update({ _changedOptions: changedOps });
                    }
                };

                /**
                 * Restore the DOM, disconnects all observers, remove all resize observers and put the instance to sleep.
                 */
                _base.destroy = function () {
                    if (_destroyed)
                        return;

                    //remove this instance from auto update loop
                    autoUpdateLoop.remove(_base);

                    //disconnect all mutation observers
                    disconnectMutationObservers();

                    //remove all resize observers
                    setupResizeObserver(_sizeObserverElement);
                    setupResizeObserver(_sizeAutoObserverElement);

                    //remove all extensions
                    for (var extName in _extensions)
                        _base.removeExt(extName);

                    //remove all 'destroy' events
                    while (_destroyEvents[LEXICON.l] > 0)
                        _destroyEvents.pop()();

                    //remove all events from host element
                    setupHostMouseTouchEvents(true);

                    //remove all helper / detection elements
                    if (_contentGlueElement)
                        remove(_contentGlueElement);
                    if (_contentArrangeElement)
                        remove(_contentArrangeElement);
                    if (_sizeAutoObserverAdded)
                        remove(_sizeAutoObserverElement);

                    //remove all generated DOM
                    setupScrollbarsDOM(true);
                    setupScrollbarCornerDOM(true);
                    setupStructureDOM(true);

                    //remove all generated image load events
                    for (var i = 0; i < _updateOnLoadElms[LEXICON.l]; i++)
                        FRAMEWORK(_updateOnLoadElms[i]).off(_updateOnLoadEventName, updateOnLoadCallback);
                    _updateOnLoadElms = undefined;

                    _destroyed = true;
                    _sleeping = true;

                    //remove this instance from the instances list
                    INSTANCES(pluginTargetElement, 0);
                    dispatchCallback('onDestroyed');

                    //remove all properties and methods
                    //for (var property in _base)
                    //    delete _base[property];
                    //_base = undefined;
                };

                /**
                 * Scrolls to a given position or element.
                 * @param coordinates
                 * 1. Can be "coordinates" which looks like:
                 *    { x : ?, y : ? } OR          Object with x and y properties
                 *    { left : ?, top : ? } OR     Object with left and top properties
                 *    { l : ?, t : ? } OR          Object with l and t properties
                 *    [ ?, ? ] OR                  Array where the first two element are the coordinates (first is x, second is y)
                 *    ?                            A single value which stays for both axis
                 *    A value can be a number, a string or a calculation.
                 *
                 *    Operators:
                 *    [NONE]  The current scroll will be overwritten by the value.
                 *    '+='    The value will be added to the current scroll offset
                 *    '-='    The value will be subtracted from the current scroll offset
                 *    '*='    The current scroll wil be multiplicated by the value.
                 *    '/='    The current scroll wil be divided by the value.
                 *
                 *    Units:
                 *    [NONE]  The value is the final scroll amount.                   final = (value * 1)
                 *    'px'    Same as none
                 *    '%'     The value is dependent on the current scroll value.     final = ((currentScrollValue / 100) * value)
                 *    'vw'    The value is multiplicated by the viewport width.       final = (value * viewportWidth)
                 *    'vh'    The value is multiplicated by the viewport height.      final = (value * viewportHeight)
                 *
                 *    example final values:
                 *    200, '200px', '50%', '1vw', '1vh', '+=200', '/=1vw', '*=2px', '-=5vh', '+=33%', '+= 50% - 2px', '-= 1vw - 50%'
                 *
                 * 2. Can be a HTML or jQuery element:
                 *    The final scroll offset is the offset (without margin) of the given HTML / jQuery element.
                 *
                 * 3. Can be a object with a HTML or jQuery element with additional settings:
                 *    {
                 *      el : [HTMLElement, jQuery element],             MUST be specified, else this object isn't valid.
                 *      scroll : [string, array, object],               Default value is 'always'.
                 *      block : [string, array, object],                Default value is 'begin'.
                 *      margin : [number, boolean, array, object]       Default value is false.
                 *    }
                 *
                 *    Possible scroll settings are:
                 *    'always'      Scrolls always.
                 *    'ifneeded'    Scrolls only if the element isnt fully in view.
                 *    'never'       Scrolls never.
                 *
                 *    Possible block settings are:
                 *    'begin'   Both axis shall be docked to the "begin" edge. - The element will be docked to the top and left edge of the viewport.
                 *    'end'     Both axis shall be docked to the "end" edge. - The element will be docked to the bottom and right edge of the viewport. (If direction is RTL to the bottom and left edge.)
                 *    'center'  Both axis shall be docked to "center". - The element will be centered in the viewport.
                 *    'nearest' The element will be docked to the nearest edge(s).
                 *
                 *    Possible margin settings are: -- The actual margin of the element wont be affect, this option affects only the final scroll offset.
                 *    [BOOLEAN]                                         If true the css margin of the element will be used, if false no margin will be used.
                 *    [NUMBER]                                          The margin will be used for all edges.
                 *
                 * @param duration The duration of the scroll animation, OR a jQuery animation configuration object.
                 * @param easing The animation easing.
                 * @param complete The animation complete callback.
                 * @returns {{
                 *   position: {x: number, y: number},
                 *   ratio: {x: number, y: number},
                 *   max: {x: number, y: number},
                 *   handleOffset: {x: number, y: number},
                 *   handleLength: {x: number, y: number},
                 *   handleLengthRatio: {x: number, y: number}, t
                 *   rackLength: {x: number, y: number},
                 *   isRTL: boolean,
                 *   isRTLNormalized: boolean
                 *  }}
                 */
                _base.scroll = function (coordinates, duration, easing, complete) {
                    if (arguments.length === 0 || coordinates === undefined) {
                        var infoX = _scrollHorizontalInfo;
                        var infoY = _scrollVerticalInfo;
                        var normalizeInvert = _normalizeRTLCache && _isRTL && _rtlScrollBehavior.i;
                        var normalizeNegate = _normalizeRTLCache && _isRTL && _rtlScrollBehavior.n;
                        var scrollX = infoX._currentScroll;
                        var scrollXRatio = infoX._currentScrollRatio;
                        var maxScrollX = infoX._maxScroll;
                        scrollXRatio = normalizeInvert ? 1 - scrollXRatio : scrollXRatio;
                        scrollX = normalizeInvert ? maxScrollX - scrollX : scrollX;
                        scrollX *= normalizeNegate ? -1 : 1;
                        maxScrollX *= normalizeNegate ? -1 : 1;

                        return {
                            position: {
                                x: scrollX,
                                y: infoY._currentScroll
                            },
                            ratio: {
                                x: scrollXRatio,
                                y: infoY._currentScrollRatio
                            },
                            max: {
                                x: maxScrollX,
                                y: infoY._maxScroll
                            },
                            handleOffset: {
                                x: infoX._handleOffset,
                                y: infoY._handleOffset
                            },
                            handleLength: {
                                x: infoX._handleLength,
                                y: infoY._handleLength
                            },
                            handleLengthRatio: {
                                x: infoX._handleLengthRatio,
                                y: infoY._handleLengthRatio
                            },
                            trackLength: {
                                x: infoX._trackLength,
                                y: infoY._trackLength
                            },
                            snappedHandleOffset: {
                                x: infoX._snappedHandleOffset,
                                y: infoY._snappedHandleOffset
                            },
                            isRTL: _isRTL,
                            isRTLNormalized: _normalizeRTLCache
                        };
                    }

                    _base.update(_strSync);

                    var normalizeRTL = _normalizeRTLCache;
                    var coordinatesXAxisProps = [_strX, _strLeft, 'l'];
                    var coordinatesYAxisProps = [_strY, _strTop, 't'];
                    var coordinatesOperators = ['+=', '-=', '*=', '/='];
                    var durationIsObject = type(duration) == TYPES.o;
                    var completeCallback = durationIsObject ? duration.complete : complete;
                    var i;
                    var finalScroll = {};
                    var specialEasing = {};
                    var doScrollLeft;
                    var doScrollTop;
                    var animationOptions;
                    var strEnd = 'end';
                    var strBegin = 'begin';
                    var strCenter = 'center';
                    var strNearest = 'nearest';
                    var strAlways = 'always';
                    var strNever = 'never';
                    var strIfNeeded = 'ifneeded';
                    var strLength = LEXICON.l;
                    var settingsAxis;
                    var settingsScroll;
                    var settingsBlock;
                    var settingsMargin;
                    var finalElement;
                    var elementObjSettingsAxisValues = [_strX, _strY, 'xy', 'yx'];
                    var elementObjSettingsBlockValues = [strBegin, strEnd, strCenter, strNearest];
                    var elementObjSettingsScrollValues = [strAlways, strNever, strIfNeeded];
                    var coordinatesIsElementObj = coordinates[LEXICON.hOP]('el');
                    var possibleElement = coordinatesIsElementObj ? coordinates.el : coordinates;
                    var possibleElementIsJQuery = possibleElement instanceof FRAMEWORK || JQUERY ? possibleElement instanceof JQUERY : false;
                    var possibleElementIsHTMLElement = possibleElementIsJQuery ? false : isHTMLElement(possibleElement);
                    var updateScrollbarInfos = function () {
                        if (doScrollLeft)
                            refreshScrollbarHandleOffset(true);
                        if (doScrollTop)
                            refreshScrollbarHandleOffset(false);
                    };
                    var proxyCompleteCallback = type(completeCallback) != TYPES.f ? undefined : function () {
                        updateScrollbarInfos();
                        completeCallback();
                    };
                    function checkSettingsStringValue(currValue, allowedValues) {
                        for (i = 0; i < allowedValues[strLength]; i++) {
                            if (currValue === allowedValues[i])
                                return true;
                        }
                        return false;
                    }
                    function getRawScroll(isX, coordinates) {
                        var coordinateProps = isX ? coordinatesXAxisProps : coordinatesYAxisProps;
                        coordinates = type(coordinates) == TYPES.s || type(coordinates) == TYPES.n ? [coordinates, coordinates] : coordinates;

                        if (COMPATIBILITY.isA(coordinates))
                            return isX ? coordinates[0] : coordinates[1];
                        else if (type(coordinates) == TYPES.o) {
                            //decides RTL normalization "hack" with .n
                            //normalizeRTL = type(coordinates.n) == TYPES.b ? coordinates.n : normalizeRTL; 
                            for (i = 0; i < coordinateProps[strLength]; i++)
                                if (coordinateProps[i] in coordinates)
                                    return coordinates[coordinateProps[i]];
                        }
                    }
                    function getFinalScroll(isX, rawScroll) {
                        var isString = type(rawScroll) == TYPES.s;
                        var operator;
                        var amount;
                        var scrollInfo = isX ? _scrollHorizontalInfo : _scrollVerticalInfo;
                        var currScroll = scrollInfo._currentScroll;
                        var maxScroll = scrollInfo._maxScroll;
                        var mult = ' * ';
                        var finalValue;
                        var isRTLisX = _isRTL && isX;
                        var normalizeShortcuts = isRTLisX && _rtlScrollBehavior.n && !normalizeRTL;
                        var strReplace = 'replace';
                        var evalFunc = eval;
                        var possibleOperator;
                        if (isString) {
                            //check operator
                            if (rawScroll[strLength] > 2) {
                                possibleOperator = rawScroll.substr(0, 2);
                                if (inArray(possibleOperator, coordinatesOperators) > -1)
                                    operator = possibleOperator;
                            }

                            //calculate units and shortcuts
                            rawScroll = operator ? rawScroll.substr(2) : rawScroll;
                            rawScroll = rawScroll
                            [strReplace](/min/g, 0) //'min' = 0%
                            [strReplace](/</g, 0)   //'<'   = 0%
                            [strReplace](/max/g, (normalizeShortcuts ? '-' : _strEmpty) + _strHundredPercent)    //'max' = 100%
                            [strReplace](/>/g, (normalizeShortcuts ? '-' : _strEmpty) + _strHundredPercent)      //'>'   = 100%
                            [strReplace](/px/g, _strEmpty)
                            [strReplace](/%/g, mult + (maxScroll * (isRTLisX && _rtlScrollBehavior.n ? -1 : 1) / 100.0))
                            [strReplace](/vw/g, mult + _viewportSize.w)
                            [strReplace](/vh/g, mult + _viewportSize.h);
                            amount = parseToZeroOrNumber(isNaN(rawScroll) ? parseToZeroOrNumber(evalFunc(rawScroll), true).toFixed() : rawScroll);
                        }
                        else {
                            amount = rawScroll;
                        }

                        if (amount !== undefined && !isNaN(amount) && type(amount) == TYPES.n) {
                            var normalizeIsRTLisX = normalizeRTL && isRTLisX;
                            var operatorCurrScroll = currScroll * (normalizeIsRTLisX && _rtlScrollBehavior.n ? -1 : 1);
                            var invert = normalizeIsRTLisX && _rtlScrollBehavior.i;
                            var negate = normalizeIsRTLisX && _rtlScrollBehavior.n;
                            operatorCurrScroll = invert ? (maxScroll - operatorCurrScroll) : operatorCurrScroll;
                            switch (operator) {
                                case '+=':
                                    finalValue = operatorCurrScroll + amount;
                                    break;
                                case '-=':
                                    finalValue = operatorCurrScroll - amount;
                                    break;
                                case '*=':
                                    finalValue = operatorCurrScroll * amount;
                                    break;
                                case '/=':
                                    finalValue = operatorCurrScroll / amount;
                                    break;
                                default:
                                    finalValue = amount;
                                    break;
                            }
                            finalValue = invert ? maxScroll - finalValue : finalValue;
                            finalValue *= negate ? -1 : 1;
                            finalValue = isRTLisX && _rtlScrollBehavior.n ? MATH.min(0, MATH.max(maxScroll, finalValue)) : MATH.max(0, MATH.min(maxScroll, finalValue));
                        }
                        return finalValue === currScroll ? undefined : finalValue;
                    }
                    function getPerAxisValue(value, valueInternalType, defaultValue, allowedValues) {
                        var resultDefault = [defaultValue, defaultValue];
                        var valueType = type(value);
                        var valueArrLength;
                        var valueArrItem;

                        //value can be [ string, or array of two strings ]
                        if (valueType == valueInternalType) {
                            value = [value, value];
                        }
                        else if (valueType == TYPES.a) {
                            valueArrLength = value[strLength];
                            if (valueArrLength > 2 || valueArrLength < 1)
                                value = resultDefault;
                            else {
                                if (valueArrLength === 1)
                                    value[1] = defaultValue;
                                for (i = 0; i < valueArrLength; i++) {
                                    valueArrItem = value[i];
                                    if (type(valueArrItem) != valueInternalType || !checkSettingsStringValue(valueArrItem, allowedValues)) {
                                        value = resultDefault;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (valueType == TYPES.o)
                            value = [value[_strX] || defaultValue, value[_strY] || defaultValue];
                        else
                            value = resultDefault;
                        return { x: value[0], y: value[1] };
                    }
                    function generateMargin(marginTopRightBottomLeftArray) {
                        var result = [];
                        var currValue;
                        var currValueType;
                        var valueDirections = [_strTop, _strRight, _strBottom, _strLeft];
                        for (i = 0; i < marginTopRightBottomLeftArray[strLength]; i++) {
                            if (i === valueDirections[strLength])
                                break;
                            currValue = marginTopRightBottomLeftArray[i];
                            currValueType = type(currValue);
                            if (currValueType == TYPES.b)
                                result.push(currValue ? parseToZeroOrNumber(finalElement.css(_strMarginMinus + valueDirections[i])) : 0);
                            else
                                result.push(currValueType == TYPES.n ? currValue : 0);
                        }
                        return result;
                    }

                    if (possibleElementIsJQuery || possibleElementIsHTMLElement) {
                        //get settings
                        var margin = coordinatesIsElementObj ? coordinates.margin : 0;
                        var axis = coordinatesIsElementObj ? coordinates.axis : 0;
                        var scroll = coordinatesIsElementObj ? coordinates.scroll : 0;
                        var block = coordinatesIsElementObj ? coordinates.block : 0;
                        var marginDefault = [0, 0, 0, 0];
                        var marginType = type(margin);
                        var marginLength;
                        finalElement = possibleElementIsJQuery ? possibleElement : FRAMEWORK(possibleElement);

                        if (finalElement[strLength] > 0) {
                            //margin can be [ boolean, number, array of 2, array of 4, object ]
                            if (marginType == TYPES.n || marginType == TYPES.b)
                                margin = generateMargin([margin, margin, margin, margin]);
                            else if (marginType == TYPES.a) {
                                marginLength = margin[strLength];
                                if (marginLength === 2)
                                    margin = generateMargin([margin[0], margin[1], margin[0], margin[1]]);
                                else if (marginLength >= 4)
                                    margin = generateMargin(margin);
                                else
                                    margin = marginDefault;
                            }
                            else if (marginType == TYPES.o)
                                margin = generateMargin([margin[_strTop], margin[_strRight], margin[_strBottom], margin[_strLeft]]);
                            else
                                margin = marginDefault;

                            //block = type(block) === TYPES.b ? block ? [ strNearest, strBegin ] : [ strNearest, strEnd ] : block;
                            settingsAxis = checkSettingsStringValue(axis, elementObjSettingsAxisValues) ? axis : 'xy';
                            settingsScroll = getPerAxisValue(scroll, TYPES.s, strAlways, elementObjSettingsScrollValues);
                            settingsBlock = getPerAxisValue(block, TYPES.s, strBegin, elementObjSettingsBlockValues);
                            settingsMargin = margin;

                            var viewportScroll = {
                                l: _scrollHorizontalInfo._currentScroll,
                                t: _scrollVerticalInfo._currentScroll
                            };
                            // use padding element instead of viewport element because padding element has never padding, margin or position applied.
                            var viewportOffset = _paddingElement.offset();

                            //get coordinates
                            var elementOffset = finalElement.offset();
                            var doNotScroll = {
                                x: settingsScroll.x == strNever || settingsAxis == _strY,
                                y: settingsScroll.y == strNever || settingsAxis == _strX
                            };
                            elementOffset[_strTop] -= settingsMargin[0];
                            elementOffset[_strLeft] -= settingsMargin[3];
                            var elementScrollCoordinates = {
                                x: MATH.round(elementOffset[_strLeft] - viewportOffset[_strLeft] + viewportScroll.l),
                                y: MATH.round(elementOffset[_strTop] - viewportOffset[_strTop] + viewportScroll.t)
                            };
                            if (_isRTL) {
                                if (!_rtlScrollBehavior.n && !_rtlScrollBehavior.i)
                                    elementScrollCoordinates.x = MATH.round(viewportOffset[_strLeft] - elementOffset[_strLeft] + viewportScroll.l);
                                if (_rtlScrollBehavior.n && normalizeRTL)
                                    elementScrollCoordinates.x *= -1;
                                if (_rtlScrollBehavior.i && normalizeRTL)
                                    elementScrollCoordinates.x = MATH.round(viewportOffset[_strLeft] - elementOffset[_strLeft] + (_scrollHorizontalInfo._maxScroll - viewportScroll.l));
                            }

                            //measuring is required
                            if (settingsBlock.x != strBegin || settingsBlock.y != strBegin || settingsScroll.x == strIfNeeded || settingsScroll.y == strIfNeeded || _isRTL) {
                                var measuringElm = finalElement[0];
                                var rawElementSize = _supportTransform ? measuringElm[LEXICON.bCR]() : {
                                    width: measuringElm[LEXICON.oW],
                                    height: measuringElm[LEXICON.oH]
                                };
                                var elementSize = {
                                    w: rawElementSize[_strWidth] + settingsMargin[3] + settingsMargin[1],
                                    h: rawElementSize[_strHeight] + settingsMargin[0] + settingsMargin[2]
                                };
                                var finalizeBlock = function (isX) {
                                    var vars = getScrollbarVars(isX);
                                    var wh = vars._w_h;
                                    var lt = vars._left_top;
                                    var xy = vars._x_y;
                                    var blockIsEnd = settingsBlock[xy] == (isX ? _isRTL ? strBegin : strEnd : strEnd);
                                    var blockIsCenter = settingsBlock[xy] == strCenter;
                                    var blockIsNearest = settingsBlock[xy] == strNearest;
                                    var scrollNever = settingsScroll[xy] == strNever;
                                    var scrollIfNeeded = settingsScroll[xy] == strIfNeeded;
                                    var vpSize = _viewportSize[wh];
                                    var vpOffset = viewportOffset[lt];
                                    var elSize = elementSize[wh];
                                    var elOffset = elementOffset[lt];
                                    var divide = blockIsCenter ? 2 : 1;
                                    var elementCenterOffset = elOffset + (elSize / 2);
                                    var viewportCenterOffset = vpOffset + (vpSize / 2);
                                    var isInView =
                                        elSize <= vpSize
                                        && elOffset >= vpOffset
                                        && elOffset + elSize <= vpOffset + vpSize;

                                    if (scrollNever)
                                        doNotScroll[xy] = true;
                                    else if (!doNotScroll[xy]) {
                                        if (blockIsNearest || scrollIfNeeded) {
                                            doNotScroll[xy] = scrollIfNeeded ? isInView : false;
                                            blockIsEnd = elSize < vpSize ? elementCenterOffset > viewportCenterOffset : elementCenterOffset < viewportCenterOffset;
                                        }
                                        elementScrollCoordinates[xy] -= blockIsEnd || blockIsCenter ? ((vpSize / divide) - (elSize / divide)) * (isX && _isRTL && normalizeRTL ? -1 : 1) : 0;
                                    }
                                };
                                finalizeBlock(true);
                                finalizeBlock(false);
                            }

                            if (doNotScroll.y)
                                delete elementScrollCoordinates.y;
                            if (doNotScroll.x)
                                delete elementScrollCoordinates.x;

                            coordinates = elementScrollCoordinates;
                        }
                    }

                    finalScroll[_strScrollLeft] = getFinalScroll(true, getRawScroll(true, coordinates));
                    finalScroll[_strScrollTop] = getFinalScroll(false, getRawScroll(false, coordinates));
                    doScrollLeft = finalScroll[_strScrollLeft] !== undefined;
                    doScrollTop = finalScroll[_strScrollTop] !== undefined;

                    if ((doScrollLeft || doScrollTop) && (duration > 0 || durationIsObject)) {
                        if (durationIsObject) {
                            duration.complete = proxyCompleteCallback;
                            _viewportElement.animate(finalScroll, duration);
                        }
                        else {
                            animationOptions = {
                                duration: duration,
                                complete: proxyCompleteCallback
                            };
                            if (COMPATIBILITY.isA(easing) || FRAMEWORK.isPlainObject(easing)) {
                                specialEasing[_strScrollLeft] = easing[0] || easing.x;
                                specialEasing[_strScrollTop] = easing[1] || easing.y;
                                animationOptions.specialEasing = specialEasing;
                            }
                            else {
                                animationOptions.easing = easing;
                            }
                            _viewportElement.animate(finalScroll, animationOptions);
                        }
                    }
                    else {
                        if (doScrollLeft)
                            _viewportElement[_strScrollLeft](finalScroll[_strScrollLeft]);
                        if (doScrollTop)
                            _viewportElement[_strScrollTop](finalScroll[_strScrollTop]);
                        updateScrollbarInfos();
                    }
                };

                /**
                 * Stops all scroll animations.
                 * @returns {*} The current OverlayScrollbars instance (for chaining).
                 */
                _base.scrollStop = function (param1, param2, param3) {
                    _viewportElement.stop(param1, param2, param3);
                    return _base;
                };

                /**
                 * Returns all relevant elements.
                 * @param elementName The name of the element which shall be returned.
                 * @returns {{target: *, host: *, padding: *, viewport: *, content: *, scrollbarHorizontal: {scrollbar: *, track: *, handle: *}, scrollbarVertical: {scrollbar: *, track: *, handle: *}, scrollbarCorner: *} | *}
                 */
                _base.getElements = function (elementName) {
                    var obj = {
                        target: _targetElementNative,
                        host: _hostElementNative,
                        padding: _paddingElementNative,
                        viewport: _viewportElementNative,
                        content: _contentElementNative,
                        scrollbarHorizontal: {
                            scrollbar: _scrollbarHorizontalElement[0],
                            track: _scrollbarHorizontalTrackElement[0],
                            handle: _scrollbarHorizontalHandleElement[0]
                        },
                        scrollbarVertical: {
                            scrollbar: _scrollbarVerticalElement[0],
                            track: _scrollbarVerticalTrackElement[0],
                            handle: _scrollbarVerticalHandleElement[0]
                        },
                        scrollbarCorner: _scrollbarCornerElement[0]
                    };
                    return type(elementName) == TYPES.s ? getObjectPropVal(obj, elementName) : obj;
                };

                /**
                 * Returns a object which describes the current state of this instance.
                 * @param stateProperty A specific property from the state object which shall be returned.
                 * @returns {{widthAuto, heightAuto, overflowAmount, hideOverflow, hasOverflow, contentScrollSize, viewportSize, hostSize, autoUpdate} | *}
                 */
                _base.getState = function (stateProperty) {
                    function prepare(obj) {
                        if (!FRAMEWORK.isPlainObject(obj))
                            return obj;
                        var extended = extendDeep({}, obj);
                        var changePropertyName = function (from, to) {
                            if (extended[LEXICON.hOP](from)) {
                                extended[to] = extended[from];
                                delete extended[from];
                            }
                        };
                        changePropertyName('w', _strWidth); //change w to width
                        changePropertyName('h', _strHeight); //change h to height
                        delete extended.c; //delete c (the 'changed' prop)
                        return extended;
                    };
                    var obj = {
                        destroyed: !!prepare(_destroyed),
                        sleeping: !!prepare(_sleeping),
                        autoUpdate: prepare(!_mutationObserversConnected),
                        widthAuto: prepare(_widthAutoCache),
                        heightAuto: prepare(_heightAutoCache),
                        padding: prepare(_cssPaddingCache),
                        overflowAmount: prepare(_overflowAmountCache),
                        hideOverflow: prepare(_hideOverflowCache),
                        hasOverflow: prepare(_hasOverflowCache),
                        contentScrollSize: prepare(_contentScrollSizeCache),
                        viewportSize: prepare(_viewportSize),
                        hostSize: prepare(_hostSizeCache),
                        documentMixed: prepare(_documentMixed)
                    };
                    return type(stateProperty) == TYPES.s ? getObjectPropVal(obj, stateProperty) : obj;
                };

                /**
                 * Gets all or specific extension instance.
                 * @param extName The name of the extension from which the instance shall be got.
                 * @returns {{}} The instance of the extension with the given name or undefined if the instance couldn't be found.
                 */
                _base.ext = function (extName) {
                    var result;
                    var privateMethods = _extensionsPrivateMethods.split(' ');
                    var i = 0;
                    if (type(extName) == TYPES.s) {
                        if (_extensions[LEXICON.hOP](extName)) {
                            result = extendDeep({}, _extensions[extName]);
                            for (; i < privateMethods.length; i++)
                                delete result[privateMethods[i]];
                        }
                    }
                    else {
                        result = {};
                        for (i in _extensions)
                            result[i] = extendDeep({}, _base.ext(i));
                    }
                    return result;
                };

                /**
                 * Adds a extension to this instance.
                 * @param extName The name of the extension which shall be added.
                 * @param extensionOptions The extension options which shall be used.
                 * @returns {{}} The instance of the added extension or undefined if the extension couldn't be added properly.
                 */
                _base.addExt = function (extName, extensionOptions) {
                    var registeredExtensionObj = _plugin.extension(extName);
                    var instance;
                    var instanceAdded;
                    var instanceContract;
                    var contractResult;
                    var contractFulfilled = true;
                    if (registeredExtensionObj) {
                        if (!_extensions[LEXICON.hOP](extName)) {
                            instance = registeredExtensionObj.extensionFactory.call(_base,
                                extendDeep({}, registeredExtensionObj.defaultOptions),
                                FRAMEWORK,
                                COMPATIBILITY);

                            if (instance) {
                                instanceContract = instance.contract;
                                if (type(instanceContract) == TYPES.f) {
                                    contractResult = instanceContract(window);
                                    contractFulfilled = type(contractResult) == TYPES.b ? contractResult : contractFulfilled;
                                }
                                if (contractFulfilled) {
                                    _extensions[extName] = instance;
                                    instanceAdded = instance.added;
                                    if (type(instanceAdded) == TYPES.f)
                                        instanceAdded(extensionOptions);

                                    return _base.ext(extName);
                                }
                            }
                        }
                        else
                            return _base.ext(extName);
                    }
                    else
                        console.warn("A extension with the name \"" + extName + "\" isn't registered.");
                };

                /**
                 * Removes a extension from this instance.
                 * @param extName The name of the extension which shall be removed.
                 * @returns {boolean} True if the extension was removed, false otherwise e.g. if the extension wasn't added before.
                 */
                _base.removeExt = function (extName) {
                    var instance = _extensions[extName];
                    var instanceRemoved;
                    if (instance) {
                        delete _extensions[extName];

                        instanceRemoved = instance.removed;
                        if (type(instanceRemoved) == TYPES.f)
                            instanceRemoved();

                        return true;
                    }
                    return false;
                };

                /**
                 * Constructs the plugin.
                 * @param targetElement The element to which the plugin shall be applied.
                 * @param options The initial options of the plugin.
                 * @param extensions The extension(s) which shall be added right after the initialization.
                 * @returns {boolean} True if the plugin was successfully initialized, false otherwise.
                 */
                function construct(targetElement, options, extensions) {
                    _defaultOptions = globals.defaultOptions;
                    _nativeScrollbarStyling = globals.nativeScrollbarStyling;
                    _nativeScrollbarSize = extendDeep({}, globals.nativeScrollbarSize);
                    _nativeScrollbarIsOverlaid = extendDeep({}, globals.nativeScrollbarIsOverlaid);
                    _overlayScrollbarDummySize = extendDeep({}, globals.overlayScrollbarDummySize);
                    _rtlScrollBehavior = extendDeep({}, globals.rtlScrollBehavior);

                    //parse & set options but don't update
                    setOptions(extendDeep({}, _defaultOptions, options));

                    _cssCalc = globals.cssCalc;
                    _msieVersion = globals.msie;
                    _autoUpdateRecommended = globals.autoUpdateRecommended;
                    _supportTransition = globals.supportTransition;
                    _supportTransform = globals.supportTransform;
                    _supportPassiveEvents = globals.supportPassiveEvents;
                    _supportResizeObserver = globals.supportResizeObserver;
                    _supportMutationObserver = globals.supportMutationObserver;
                    _restrictedMeasuring = globals.restrictedMeasuring;
                    _documentElement = FRAMEWORK(targetElement.ownerDocument);
                    _documentElementNative = _documentElement[0];
                    _windowElement = FRAMEWORK(_documentElementNative.defaultView || _documentElementNative.parentWindow);
                    _windowElementNative = _windowElement[0];
                    _htmlElement = findFirst(_documentElement, 'html');
                    _bodyElement = findFirst(_htmlElement, 'body');
                    _targetElement = FRAMEWORK(targetElement);
                    _targetElementNative = _targetElement[0];
                    _isTextarea = _targetElement.is('textarea');
                    _isBody = _targetElement.is('body');
                    _documentMixed = _documentElementNative !== document;

                    /* On a div Element The if checks only whether:
                     * - the targetElement has the class "os-host"
                     * - the targetElement has a a child with the class "os-padding"
                     * 
                     * If that's the case, its assumed the DOM has already the following structure:
                     * (The ".os-host" element is the targetElement)
                     *
                     *  <div class="os-host">
                     *      <div class="os-resize-observer-host"></div>
                     *      <div class="os-padding">
                     *          <div class="os-viewport">
                     *              <div class="os-content"></div>
                     *          </div>
                     *      </div>
                     *      <div class="os-scrollbar os-scrollbar-horizontal ">
                     *          <div class="os-scrollbar-track">
                     *              <div class="os-scrollbar-handle"></div>
                     *          </div>
                     *      </div>
                     *      <div class="os-scrollbar os-scrollbar-vertical">
                     *          <div class="os-scrollbar-track">
                     *              <div class="os-scrollbar-handle"></div>
                     *          </div>
                     *      </div>
                     *      <div class="os-scrollbar-corner"></div>
                     *  </div>
                     *
                     * =====================================================================================
                     * 
                     * On a Textarea Element The if checks only whether:
                     * - the targetElement has the class "os-textarea" 
                     * - the targetElement is inside a element with the class "os-content" 
                     * 
                     * If that's the case, its assumed the DOM has already the following structure:
                     * (The ".os-textarea" (textarea) element is the targetElement)
                     *
                     *  <div class="os-host-textarea">
                     *      <div class="os-resize-observer-host"></div>
                     *      <div class="os-padding os-text-inherit">
                     *          <div class="os-viewport os-text-inherit">
                     *              <div class="os-content os-text-inherit">
                     *                  <div class="os-textarea-cover"></div>
                     *                  <textarea class="os-textarea os-text-inherit"></textarea>
                     *              </div>
                     *          </div>
                     *      </div>
                     *      <div class="os-scrollbar os-scrollbar-horizontal ">
                     *          <div class="os-scrollbar-track">
                     *              <div class="os-scrollbar-handle"></div>
                     *          </div>
                     *      </div>
                     *      <div class="os-scrollbar os-scrollbar-vertical">
                     *          <div class="os-scrollbar-track">
                     *              <div class="os-scrollbar-handle"></div>
                     *          </div>
                     *      </div>
                     *      <div class="os-scrollbar-corner"></div>
                     *  </div>
                     */
                    _domExists = _isTextarea
                        ? _targetElement.hasClass(_classNameTextareaElement) && _targetElement.parent().hasClass(_classNameContentElement)
                        : _targetElement.hasClass(_classNameHostElement) && _targetElement.children(_strDot + _classNamePaddingElement)[LEXICON.l];

                    var initBodyScroll;
                    var bodyMouseTouchDownListener;

                    //check if the plugin hasn't to be initialized
                    if (_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y && !_currentPreparedOptions.nativeScrollbarsOverlaid.initialize) {
                        dispatchCallback('onInitializationWithdrawn');
                        if (_domExists) {
                            setupStructureDOM(true);
                            setupScrollbarsDOM(true);
                            setupScrollbarCornerDOM(true);
                        }

                        _destroyed = true;
                        _sleeping = true;

                        return _base;
                    }

                    if (_isBody) {
                        initBodyScroll = {};
                        initBodyScroll.l = MATH.max(_targetElement[_strScrollLeft](), _htmlElement[_strScrollLeft](), _windowElement[_strScrollLeft]());
                        initBodyScroll.t = MATH.max(_targetElement[_strScrollTop](), _htmlElement[_strScrollTop](), _windowElement[_strScrollTop]());

                        bodyMouseTouchDownListener = function () {
                            _viewportElement.removeAttr(LEXICON.ti);
                            setupResponsiveEventListener(_viewportElement, _strMouseTouchDownEvent, bodyMouseTouchDownListener, true, true);
                        }
                    }

                    //build OverlayScrollbars DOM
                    setupStructureDOM();
                    setupScrollbarsDOM();
                    setupScrollbarCornerDOM();

                    //create OverlayScrollbars events
                    setupStructureEvents();
                    setupScrollbarEvents(true);
                    setupScrollbarEvents(false);
                    setupScrollbarCornerEvents();

                    //create mutation observers
                    createMutationObservers();

                    //build resize observer for the host element
                    setupResizeObserver(_sizeObserverElement, hostOnResized);

                    if (_isBody) {
                        //apply the body scroll to handle it right in the update method
                        _viewportElement[_strScrollLeft](initBodyScroll.l)[_strScrollTop](initBodyScroll.t);

                        //set the focus on the viewport element so you dont have to click on the page to use keyboard keys (up / down / space) for scrolling
                        if (document.activeElement == targetElement && _viewportElementNative.focus) {
                            //set a tabindex to make the viewportElement focusable
                            _viewportElement.attr(LEXICON.ti, '-1');
                            _viewportElementNative.focus();

                            /* the tabindex has to be removed due to;
                             * If you set the tabindex attribute on an <div>, then its child content cannot be scrolled with the arrow keys unless you set tabindex on the content, too
                             * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                             */
                            setupResponsiveEventListener(_viewportElement, _strMouseTouchDownEvent, bodyMouseTouchDownListener, false, true);
                        }
                    }

                    //update for the first time & initialize cache
                    _base.update(_strAuto);

                    //the plugin is initialized now!
                    _initialized = true;
                    dispatchCallback('onInitialized');

                    //call all callbacks which would fire before the initialized was complete
                    each(_callbacksInitQeueue, function (index, value) { dispatchCallback(value.n, value.a); });
                    _callbacksInitQeueue = [];

                    //add extensions
                    if (type(extensions) == TYPES.s)
                        extensions = [extensions];
                    if (COMPATIBILITY.isA(extensions))
                        each(extensions, function (index, value) { _base.addExt(value); });
                    else if (FRAMEWORK.isPlainObject(extensions))
                        each(extensions, function (key, value) { _base.addExt(key, value); });

                    //add the transition class for transitions AFTER the first update & AFTER the applied extensions (for preventing unwanted transitions)
                    setTimeout(function () {
                        if (_supportTransition && !_destroyed)
                            addClass(_hostElement, _classNameHostTransition);
                    }, 333);

                    return _base;
                }

                if (_plugin.valid(construct(pluginTargetElement, options, extensions))) {
                    INSTANCES(pluginTargetElement, _base);
                }

                return _base;
            }

            /**
             * Initializes a new OverlayScrollbarsInstance object or changes options if already initialized or returns the current instance.
             * @param pluginTargetElements The elements to which the Plugin shall be initialized.
             * @param options The custom options with which the plugin shall be initialized.
             * @param extensions The extension(s) which shall be added right after initialization.
             * @returns {*}
             */
            _plugin = window[PLUGINNAME] = function (pluginTargetElements, options, extensions) {
                if (arguments[LEXICON.l] === 0)
                    return this;

                var arr = [];
                var optsIsPlainObj = FRAMEWORK.isPlainObject(options);
                var inst;
                var result;

                //pluginTargetElements is null or undefined
                if (!pluginTargetElements)
                    return optsIsPlainObj || !options ? result : arr;

                /*
                   pluginTargetElements will be converted to:
                   1. A jQueryElement Array
                   2. A HTMLElement Array
                   3. A Array with a single HTML Element
                   so pluginTargetElements is always a array.
                */
                pluginTargetElements = pluginTargetElements[LEXICON.l] != undefined ? pluginTargetElements : [pluginTargetElements[0] || pluginTargetElements];
                initOverlayScrollbarsStatics();

                if (pluginTargetElements[LEXICON.l] > 0) {
                    if (optsIsPlainObj) {
                        FRAMEWORK.each(pluginTargetElements, function (i, v) {
                            inst = v;
                            if (inst !== undefined)
                                arr.push(OverlayScrollbarsInstance(inst, options, extensions, _pluginsGlobals, _pluginsAutoUpdateLoop));
                        });
                    }
                    else {
                        FRAMEWORK.each(pluginTargetElements, function (i, v) {
                            inst = INSTANCES(v);
                            if ((options === '!' && _plugin.valid(inst)) || (COMPATIBILITY.type(options) == TYPES.f && options(v, inst)))
                                arr.push(inst);
                            else if (options === undefined)
                                arr.push(inst);
                        });
                    }
                    result = arr[LEXICON.l] === 1 ? arr[0] : arr;
                }
                return result;
            };

            /**
             * Returns a object which contains global information about the plugin and each instance of it.
             * The returned object is just a copy, that means that changes to the returned object won't have any effect to the original object.
             */
            _plugin.globals = function () {
                initOverlayScrollbarsStatics();
                var globals = FRAMEWORK.extend(true, {}, _pluginsGlobals);
                delete globals['msie'];
                return globals;
            };

            /**
             * Gets or Sets the default options for each new plugin initialization.
             * @param newDefaultOptions The object with which the default options shall be extended.
             */
            _plugin.defaultOptions = function (newDefaultOptions) {
                initOverlayScrollbarsStatics();
                var currDefaultOptions = _pluginsGlobals.defaultOptions;
                if (newDefaultOptions === undefined)
                    return FRAMEWORK.extend(true, {}, currDefaultOptions);

                //set the new default options
                _pluginsGlobals.defaultOptions = FRAMEWORK.extend(true, {}, currDefaultOptions, _pluginsOptions._validate(newDefaultOptions, _pluginsOptions._template, true, currDefaultOptions)._default);
            };

            /**
             * Checks whether the passed instance is a non-destroyed OverlayScrollbars instance.
             * @param osInstance The potential OverlayScrollbars instance which shall be checked.
             * @returns {boolean} True if the passed value is a non-destroyed OverlayScrollbars instance, false otherwise.
             */
            _plugin.valid = function (osInstance) {
                return osInstance instanceof _plugin && !osInstance.getState().destroyed;
            };

            /**
             * Registers, Unregisters or returns a extension.
             * Register: Pass the name and the extension. (defaultOptions is optional)
             * Unregister: Pass the name and anything except a function as extension parameter.
             * Get extension: Pass the name of the extension which shall be got.
             * Get all extensions: Pass no arguments.
             * @param extensionName The name of the extension which shall be registered, unregistered or returned.
             * @param extension A function which generates the instance of the extension or anything other to remove a already registered extension.
             * @param defaultOptions The default options which shall be used for the registered extension.
             */
            _plugin.extension = function (extensionName, extension, defaultOptions) {
                var extNameTypeString = COMPATIBILITY.type(extensionName) == TYPES.s;
                var argLen = arguments[LEXICON.l];
                var i = 0;
                if (argLen < 1 || !extNameTypeString) {
                    //return a copy of all extension objects
                    return FRAMEWORK.extend(true, { length: _pluginsExtensions[LEXICON.l] }, _pluginsExtensions);
                }
                else if (extNameTypeString) {
                    if (COMPATIBILITY.type(extension) == TYPES.f) {
                        //register extension
                        _pluginsExtensions.push({
                            name: extensionName,
                            extensionFactory: extension,
                            defaultOptions: defaultOptions
                        });
                    }
                    else {
                        for (; i < _pluginsExtensions[LEXICON.l]; i++) {
                            if (_pluginsExtensions[i].name === extensionName) {
                                if (argLen > 1)
                                    _pluginsExtensions.splice(i, 1); //remove extension
                                else
                                    return FRAMEWORK.extend(true, {}, _pluginsExtensions[i]); //return extension with the given name
                            }
                        }
                    }
                }
            };

            return _plugin;
        })();

        if (JQUERY && JQUERY.fn) {
            /**
             * The jQuery initialization interface.
             * @param options The initial options for the construction of the plugin. To initialize the plugin, this option has to be a object! If it isn't a object, the instance(s) are returned and the plugin wont be initialized.
             * @param extensions The extension(s) which shall be added right after initialization.
             * @returns {*} After initialization it returns the jQuery element array, else it returns the instance(s) of the elements which are selected.
             */
            JQUERY.fn.overlayScrollbars = function (options, extensions) {
                var _elements = this;
                if (JQUERY.isPlainObject(options)) {
                    JQUERY.each(_elements, function () { PLUGIN(this, options, extensions); });
                    return _elements;
                }
                else
                    return PLUGIN(_elements, options);
            };
        }
        return PLUGIN;
    }
));

/***/ }),

/***/ "./node_modules/ssr-window/ssr-window.esm.js":
/*!***************************************************!*\
  !*** ./node_modules/ssr-window/ssr-window.esm.js ***!
  \***************************************************/
/*! exports provided: extend, getDocument, getWindow, ssrDocument, ssrWindow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDocument", function() { return getDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWindow", function() { return getWindow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ssrDocument", function() { return ssrDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ssrWindow", function() { return ssrWindow; });
/**
 * SSR Window 3.0.0
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2020, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: November 9, 2020
 */
/* eslint-disable no-param-reassign */
function isObject(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend(target, src) {
    if (target === void 0) { target = {}; }
    if (src === void 0) { src = {}; }
    Object.keys(src).forEach(function (key) {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject(src[key]) &&
            isObject(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend(target[key], src[key]);
        }
    });
}

var ssrDocument = {
    body: {},
    addEventListener: function () { },
    removeEventListener: function () { },
    activeElement: {
        blur: function () { },
        nodeName: '',
    },
    querySelector: function () {
        return null;
    },
    querySelectorAll: function () {
        return [];
    },
    getElementById: function () {
        return null;
    },
    createEvent: function () {
        return {
            initEvent: function () { },
        };
    },
    createElement: function () {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute: function () { },
            getElementsByTagName: function () {
                return [];
            },
        };
    },
    createElementNS: function () {
        return {};
    },
    importNode: function () {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    var doc = typeof document !== 'undefined' ? document : {};
    extend(doc, ssrDocument);
    return doc;
}

var ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState: function () { },
        pushState: function () { },
        go: function () { },
        back: function () { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener: function () { },
    removeEventListener: function () { },
    getComputedStyle: function () {
        return {
            getPropertyValue: function () {
                return '';
            },
        };
    },
    Image: function () { },
    Date: function () { },
    screen: {},
    setTimeout: function () { },
    clearTimeout: function () { },
    matchMedia: function () {
        return {};
    },
    requestAnimationFrame: function (callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame: function (id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function getWindow() {
    var win = typeof window !== 'undefined' ? window : {};
    extend(win, ssrWindow);
    return win;
}




/***/ }),

/***/ "./node_modules/swiper/esm/components/a11y/a11y.js":
/*!*********************************************************!*\
  !*** ./node_modules/swiper/esm/components/a11y/a11y.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var A11y = {
  getRandomNumber: function getRandomNumber(size) {
    if (size === void 0) {
      size = 16;
    }

    var randomChar = function randomChar() {
      return Math.round(16 * Math.random()).toString(16);
    };

    return 'x'.repeat(size).replace(/x/g, randomChar);
  },
  makeElFocusable: function makeElFocusable($el) {
    $el.attr('tabIndex', '0');
    return $el;
  },
  makeElNotFocusable: function makeElNotFocusable($el) {
    $el.attr('tabIndex', '-1');
    return $el;
  },
  addElRole: function addElRole($el, role) {
    $el.attr('role', role);
    return $el;
  },
  addElRoleDescription: function addElRoleDescription($el, description) {
    $el.attr('aria-roledescription', description);
    return $el;
  },
  addElControls: function addElControls($el, controls) {
    $el.attr('aria-controls', controls);
    return $el;
  },
  addElLabel: function addElLabel($el, label) {
    $el.attr('aria-label', label);
    return $el;
  },
  addElId: function addElId($el, id) {
    $el.attr('id', id);
    return $el;
  },
  addElLive: function addElLive($el, live) {
    $el.attr('aria-live', live);
    return $el;
  },
  disableEl: function disableEl($el) {
    $el.attr('aria-disabled', true);
    return $el;
  },
  enableEl: function enableEl($el) {
    $el.attr('aria-disabled', false);
    return $el;
  },
  onEnterOrSpaceKey: function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) return;
    var swiper = this;
    var params = swiper.params.a11y;
    var $targetEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(e.target);

    if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }

      if (swiper.isEnd) {
        swiper.a11y.notify(params.lastSlideMessage);
      } else {
        swiper.a11y.notify(params.nextSlideMessage);
      }
    }

    if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }

      if (swiper.isBeginning) {
        swiper.a11y.notify(params.firstSlideMessage);
      } else {
        swiper.a11y.notify(params.prevSlideMessage);
      }
    }

    if (swiper.pagination && $targetEl.is(Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(swiper.params.pagination.bulletClass))) {
      $targetEl[0].click();
    }
  },
  notify: function notify(message) {
    var swiper = this;
    var notification = swiper.a11y.liveRegion;
    if (notification.length === 0) return;
    notification.html('');
    notification.html(message);
  },
  updateNavigation: function updateNavigation() {
    var swiper = this;
    if (swiper.params.loop || !swiper.navigation) return;
    var _swiper$navigation = swiper.navigation,
        $nextEl = _swiper$navigation.$nextEl,
        $prevEl = _swiper$navigation.$prevEl;

    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        swiper.a11y.disableEl($prevEl);
        swiper.a11y.makeElNotFocusable($prevEl);
      } else {
        swiper.a11y.enableEl($prevEl);
        swiper.a11y.makeElFocusable($prevEl);
      }
    }

    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        swiper.a11y.disableEl($nextEl);
        swiper.a11y.makeElNotFocusable($nextEl);
      } else {
        swiper.a11y.enableEl($nextEl);
        swiper.a11y.makeElFocusable($nextEl);
      }
    }
  },
  updatePagination: function updatePagination() {
    var swiper = this;
    var params = swiper.params.a11y;

    if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
      swiper.pagination.bullets.each(function (bulletEl) {
        var $bulletEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(bulletEl);
        swiper.a11y.makeElFocusable($bulletEl);

        if (!swiper.params.pagination.renderBullet) {
          swiper.a11y.addElRole($bulletEl, 'button');
          swiper.a11y.addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
        }
      });
    }
  },
  init: function init() {
    var swiper = this;
    var params = swiper.params.a11y;
    swiper.$el.append(swiper.a11y.liveRegion); // Container

    var $containerEl = swiper.$el;

    if (params.containerRoleDescriptionMessage) {
      swiper.a11y.addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
    }

    if (params.containerMessage) {
      swiper.a11y.addElLabel($containerEl, params.containerMessage);
    } // Wrapper


    var $wrapperEl = swiper.$wrapperEl;
    var wrapperId = $wrapperEl.attr('id') || "swiper-wrapper-" + swiper.a11y.getRandomNumber(16);
    var live;
    swiper.a11y.addElId($wrapperEl, wrapperId);

    if (swiper.params.autoplay && swiper.params.autoplay.enabled) {
      live = 'off';
    } else {
      live = 'polite';
    }

    swiper.a11y.addElLive($wrapperEl, live); // Slide

    if (params.itemRoleDescriptionMessage) {
      swiper.a11y.addElRoleDescription(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(swiper.slides), params.itemRoleDescriptionMessage);
    }

    swiper.a11y.addElRole(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(swiper.slides), params.slideRole);
    swiper.slides.each(function (slideEl) {
      var $slideEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(slideEl);
      var ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, $slideEl.index() + 1).replace(/\{\{slidesLength\}\}/, swiper.slides.length);
      swiper.a11y.addElLabel($slideEl, ariaLabelMessage);
    }); // Navigation

    var $nextEl;
    var $prevEl;

    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }

    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }

    if ($nextEl && $nextEl.length) {
      swiper.a11y.makeElFocusable($nextEl);

      if ($nextEl[0].tagName !== 'BUTTON') {
        swiper.a11y.addElRole($nextEl, 'button');
        $nextEl.on('keydown', swiper.a11y.onEnterOrSpaceKey);
      }

      swiper.a11y.addElLabel($nextEl, params.nextSlideMessage);
      swiper.a11y.addElControls($nextEl, wrapperId);
    }

    if ($prevEl && $prevEl.length) {
      swiper.a11y.makeElFocusable($prevEl);

      if ($prevEl[0].tagName !== 'BUTTON') {
        swiper.a11y.addElRole($prevEl, 'button');
        $prevEl.on('keydown', swiper.a11y.onEnterOrSpaceKey);
      }

      swiper.a11y.addElLabel($prevEl, params.prevSlideMessage);
      swiper.a11y.addElControls($prevEl, wrapperId);
    } // Pagination


    if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
      swiper.pagination.$el.on('keydown', Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(swiper.params.pagination.bulletClass), swiper.a11y.onEnterOrSpaceKey);
    }
  },
  destroy: function destroy() {
    var swiper = this;
    if (swiper.a11y.liveRegion && swiper.a11y.liveRegion.length > 0) swiper.a11y.liveRegion.remove();
    var $nextEl;
    var $prevEl;

    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }

    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }

    if ($nextEl) {
      $nextEl.off('keydown', swiper.a11y.onEnterOrSpaceKey);
    }

    if ($prevEl) {
      $prevEl.off('keydown', swiper.a11y.onEnterOrSpaceKey);
    } // Pagination


    if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
      swiper.pagination.$el.off('keydown', Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(swiper.params.pagination.bulletClass), swiper.a11y.onEnterOrSpaceKey);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'a11y',
  params: {
    a11y: {
      enabled: true,
      notificationClass: 'swiper-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      slideLabelMessage: '{{index}} / {{slidesLength}}',
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: 'group'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      a11y: _extends({}, A11y, {
        liveRegion: Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<span class=\"" + swiper.params.a11y.notificationClass + "\" aria-live=\"assertive\" aria-atomic=\"true\"></span>")
      })
    });
  },
  on: {
    afterInit: function afterInit(swiper) {
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.init();
      swiper.a11y.updateNavigation();
    },
    toEdge: function toEdge(swiper) {
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.updateNavigation();
    },
    fromEdge: function fromEdge(swiper) {
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.updateNavigation();
    },
    paginationUpdate: function paginationUpdate(swiper) {
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.updatePagination();
    },
    destroy: function destroy(swiper) {
      if (!swiper.params.a11y.enabled) return;
      swiper.a11y.destroy();
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/autoplay/autoplay.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/autoplay/autoplay.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint no-underscore-dangle: "off" */


var Autoplay = {
  run: function run() {
    var swiper = this;
    var $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
    var delay = swiper.params.autoplay.delay;

    if ($activeSlideEl.attr('data-swiper-autoplay')) {
      delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
    }

    clearTimeout(swiper.autoplay.timeout);
    swiper.autoplay.timeout = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
      var autoplayResult;

      if (swiper.params.autoplay.reverseDirection) {
        if (swiper.params.loop) {
          swiper.loopFix();
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          swiper.emit('autoplay');
        } else if (!swiper.isBeginning) {
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          swiper.emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
          swiper.emit('autoplay');
        } else {
          swiper.autoplay.stop();
        }
      } else if (swiper.params.loop) {
        swiper.loopFix();
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        swiper.emit('autoplay');
      } else if (!swiper.isEnd) {
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        swiper.emit('autoplay');
      } else if (!swiper.params.autoplay.stopOnLastSlide) {
        autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
        swiper.emit('autoplay');
      } else {
        swiper.autoplay.stop();
      }

      if (swiper.params.cssMode && swiper.autoplay.running) swiper.autoplay.run();else if (autoplayResult === false) {
        swiper.autoplay.run();
      }
    }, delay);
  },
  start: function start() {
    var swiper = this;
    if (typeof swiper.autoplay.timeout !== 'undefined') return false;
    if (swiper.autoplay.running) return false;
    swiper.autoplay.running = true;
    swiper.emit('autoplayStart');
    swiper.autoplay.run();
    return true;
  },
  stop: function stop() {
    var swiper = this;
    if (!swiper.autoplay.running) return false;
    if (typeof swiper.autoplay.timeout === 'undefined') return false;

    if (swiper.autoplay.timeout) {
      clearTimeout(swiper.autoplay.timeout);
      swiper.autoplay.timeout = undefined;
    }

    swiper.autoplay.running = false;
    swiper.emit('autoplayStop');
    return true;
  },
  pause: function pause(speed) {
    var swiper = this;
    if (!swiper.autoplay.running) return;
    if (swiper.autoplay.paused) return;
    if (swiper.autoplay.timeout) clearTimeout(swiper.autoplay.timeout);
    swiper.autoplay.paused = true;

    if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
      swiper.autoplay.paused = false;
      swiper.autoplay.run();
    } else {
      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.autoplay.onTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.autoplay.onTransitionEnd);
    }
  },
  onVisibilityChange: function onVisibilityChange() {
    var swiper = this;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();

    if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
      swiper.autoplay.pause();
    }

    if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
      swiper.autoplay.run();
      swiper.autoplay.paused = false;
    }
  },
  onTransitionEnd: function onTransitionEnd(e) {
    var swiper = this;
    if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
    if (e.target !== swiper.$wrapperEl[0]) return;
    swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.autoplay.onTransitionEnd);
    swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.autoplay.onTransitionEnd);
    swiper.autoplay.paused = false;

    if (!swiper.autoplay.running) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.run();
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'autoplay',
  params: {
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      autoplay: _extends({}, Autoplay, {
        running: false,
        paused: false
      })
    });
  },
  on: {
    init: function init(swiper) {
      if (swiper.params.autoplay.enabled) {
        swiper.autoplay.start();
        var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
        document.addEventListener('visibilitychange', swiper.autoplay.onVisibilityChange);
      }
    },
    beforeTransitionStart: function beforeTransitionStart(swiper, speed, internal) {
      if (swiper.autoplay.running) {
        if (internal || !swiper.params.autoplay.disableOnInteraction) {
          swiper.autoplay.pause(speed);
        } else {
          swiper.autoplay.stop();
        }
      }
    },
    sliderFirstMove: function sliderFirstMove(swiper) {
      if (swiper.autoplay.running) {
        if (swiper.params.autoplay.disableOnInteraction) {
          swiper.autoplay.stop();
        } else {
          swiper.autoplay.pause();
        }
      }
    },
    touchEnd: function touchEnd(swiper) {
      if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
        swiper.autoplay.run();
      }
    },
    destroy: function destroy(swiper) {
      if (swiper.autoplay.running) {
        swiper.autoplay.stop();
      }

      var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
      document.removeEventListener('visibilitychange', swiper.autoplay.onVisibilityChange);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/controller/controller.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/controller/controller.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint no-bitwise: ["error", { "allow": [">>"] }] */

var Controller = {
  LinearSpline: function LinearSpline(x, y) {
    var binarySearch = function search() {
      var maxIndex;
      var minIndex;
      var guess;
      return function (array, val) {
        minIndex = -1;
        maxIndex = array.length;

        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;

          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }

        return maxIndex;
      };
    }();

    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.

    var i1;
    var i3;

    this.interpolate = function interpolate(x2) {
      if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };

    return this;
  },
  // xxx: for now i will just save one spline function to to
  getInterpolateFunction: function getInterpolateFunction(c) {
    var swiper = this;

    if (!swiper.controller.spline) {
      swiper.controller.spline = swiper.params.loop ? new Controller.LinearSpline(swiper.slidesGrid, c.slidesGrid) : new Controller.LinearSpline(swiper.snapGrid, c.snapGrid);
    }
  },
  setTranslate: function setTranslate(_setTranslate, byController) {
    var swiper = this;
    var controlled = swiper.controller.control;
    var multiplier;
    var controlledTranslate;
    var Swiper = swiper.constructor;

    function setControlledTranslate(c) {
      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      var translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

      if (swiper.params.controller.by === 'slide') {
        swiper.controller.getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out

        controlledTranslate = -swiper.controller.spline.interpolate(-translate);
      }

      if (!controlledTranslate || swiper.params.controller.by === 'container') {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
      }

      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }

      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }

    if (Array.isArray(controlled)) {
      for (var i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  },
  setTransition: function setTransition(duration, byController) {
    var swiper = this;
    var Swiper = swiper.constructor;
    var controlled = swiper.controller.control;
    var i;

    function setControlledTransition(c) {
      c.setTransition(duration, swiper);

      if (duration !== 0) {
        c.transitionStart();

        if (c.params.autoHeight) {
          Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["nextTick"])(function () {
            c.updateAutoHeight();
          });
        }

        c.$wrapperEl.transitionEnd(function () {
          if (!controlled) return;

          if (c.params.loop && swiper.params.controller.by === 'slide') {
            c.loopFix();
          }

          c.transitionEnd();
        });
      }
    }

    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'controller',
  params: {
    controller: {
      control: undefined,
      inverse: false,
      by: 'slide' // or 'container'

    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["bindModuleMethods"])(swiper, {
      controller: _extends({
        control: swiper.params.controller.control
      }, Controller)
    });
  },
  on: {
    update: function update(swiper) {
      if (!swiper.controller.control) return;

      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    },
    resize: function resize(swiper) {
      if (!swiper.controller.control) return;

      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    },
    observerUpdate: function observerUpdate(swiper) {
      if (!swiper.controller.control) return;

      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    },
    setTranslate: function setTranslate(swiper, translate, byController) {
      if (!swiper.controller.control) return;
      swiper.controller.setTranslate(translate, byController);
    },
    setTransition: function setTransition(swiper, duration, byController) {
      if (!swiper.controller.control) return;
      swiper.controller.setTransition(duration, byController);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/breakpoints/getBreakpoint.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/breakpoints/getBreakpoint.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getBreakpoint; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");

function getBreakpoint(breakpoints, base, containerEl) {
  if (base === void 0) {
    base = 'window';
  }

  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  var breakpoint = false;
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var currentWidth = base === 'window' ? window.innerWidth : containerEl.clientWidth;
  var currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  var points = Object.keys(breakpoints).map(function (point) {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      var minRatio = parseFloat(point.substr(1));
      var value = currentHeight * minRatio;
      return {
        value: value,
        point: point
      };
    }

    return {
      value: point,
      point: point
    };
  });
  points.sort(function (a, b) {
    return parseInt(a.value, 10) - parseInt(b.value, 10);
  });

  for (var i = 0; i < points.length; i += 1) {
    var _points$i = points[i],
        point = _points$i.point,
        value = _points$i.value;

    if (value <= currentWidth) {
      breakpoint = point;
    }
  }

  return breakpoint || 'max';
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/breakpoints/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/breakpoints/index.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setBreakpoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setBreakpoint */ "./node_modules/swiper/esm/components/core/breakpoints/setBreakpoint.js");
/* harmony import */ var _getBreakpoint__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getBreakpoint */ "./node_modules/swiper/esm/components/core/breakpoints/getBreakpoint.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  setBreakpoint: _setBreakpoint__WEBPACK_IMPORTED_MODULE_0__["default"],
  getBreakpoint: _getBreakpoint__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/breakpoints/setBreakpoint.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/breakpoints/setBreakpoint.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setBreakpoint; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function setBreakpoint() {
  var swiper = this;
  var activeIndex = swiper.activeIndex,
      initialized = swiper.initialized,
      _swiper$loopedSlides = swiper.loopedSlides,
      loopedSlides = _swiper$loopedSlides === void 0 ? 0 : _swiper$loopedSlides,
      params = swiper.params,
      $el = swiper.$el;
  var breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

  var breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);

  if (breakpoint && swiper.currentBreakpoint !== breakpoint) {
    var breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;

    if (breakpointOnlyParams) {
      ['slidesPerView', 'spaceBetween', 'slidesPerGroup', 'slidesPerGroupSkip', 'slidesPerColumn'].forEach(function (param) {
        var paramValue = breakpointOnlyParams[param];
        if (typeof paramValue === 'undefined') return;

        if (param === 'slidesPerView' && (paramValue === 'AUTO' || paramValue === 'auto')) {
          breakpointOnlyParams[param] = 'auto';
        } else if (param === 'slidesPerView') {
          breakpointOnlyParams[param] = parseFloat(paramValue);
        } else {
          breakpointOnlyParams[param] = parseInt(paramValue, 10);
        }
      });
    }

    var breakpointParams = breakpointOnlyParams || swiper.originalParams;
    var wasMultiRow = params.slidesPerColumn > 1;
    var isMultiRow = breakpointParams.slidesPerColumn > 1;

    if (wasMultiRow && !isMultiRow) {
      $el.removeClass(params.containerModifierClass + "multirow " + params.containerModifierClass + "multirow-column");
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      $el.addClass(params.containerModifierClass + "multirow");

      if (breakpointParams.slidesPerColumnFill === 'column') {
        $el.addClass(params.containerModifierClass + "multirow-column");
      }

      swiper.emitContainerClasses();
    }

    var directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    var needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

    if (directionChanged && initialized) {
      swiper.changeDirection();
    }

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper.params, breakpointParams);
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    swiper.currentBreakpoint = breakpoint;
    swiper.emit('_beforeBreakpoint', breakpointParams);

    if (needsReLoop && initialized) {
      swiper.loopDestroy();
      swiper.loopCreate();
      swiper.updateSlides();
      swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
    }

    swiper.emit('breakpoint', breakpointParams);
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/check-overflow/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/check-overflow/index.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function checkOverflow() {
  var swiper = this;
  var params = swiper.params;
  var wasLocked = swiper.isLocked;
  var lastSlidePosition = swiper.slides.length > 0 && params.slidesOffsetBefore + params.spaceBetween * (swiper.slides.length - 1) + swiper.slides[0].offsetWidth * swiper.slides.length;

  if (params.slidesOffsetBefore && params.slidesOffsetAfter && lastSlidePosition) {
    swiper.isLocked = lastSlidePosition <= swiper.size;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }

  swiper.allowSlideNext = !swiper.isLocked;
  swiper.allowSlidePrev = !swiper.isLocked; // events

  if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? 'lock' : 'unlock');

  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
    if (swiper.navigation) swiper.navigation.update();
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  checkOverflow: checkOverflow
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/classes/addClasses.js":
/*!***********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/classes/addClasses.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addClasses; });
function prepareClasses(entries, prefix) {
  var resultClasses = [];
  entries.forEach(function (item) {
    if (typeof item === 'object') {
      Object.keys(item).forEach(function (classNames) {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}

function addClasses() {
  var swiper = this;
  var classNames = swiper.classNames,
      params = swiper.params,
      rtl = swiper.rtl,
      $el = swiper.$el,
      device = swiper.device,
      support = swiper.support; // prettier-ignore

  var suffixes = prepareClasses(['initialized', params.direction, {
    'pointer-events': support.pointerEvents && !support.touch
  }, {
    'free-mode': params.freeMode
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'multirow': params.slidesPerColumn > 1
  }, {
    'multirow-column': params.slidesPerColumn > 1 && params.slidesPerColumnFill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }], params.containerModifierClass);
  classNames.push.apply(classNames, suffixes);
  $el.addClass([].concat(classNames).join(' '));
  swiper.emitContainerClasses();
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/classes/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/classes/index.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _addClasses__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addClasses */ "./node_modules/swiper/esm/components/core/classes/addClasses.js");
/* harmony import */ var _removeClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./removeClasses */ "./node_modules/swiper/esm/components/core/classes/removeClasses.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  addClasses: _addClasses__WEBPACK_IMPORTED_MODULE_0__["default"],
  removeClasses: _removeClasses__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/classes/removeClasses.js":
/*!**************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/classes/removeClasses.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return removeClasses; });
function removeClasses() {
  var swiper = this;
  var $el = swiper.$el,
      classNames = swiper.classNames;
  $el.removeClass(classNames.join(' '));
  swiper.emitContainerClasses();
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/core-class.js":
/*!***************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/core-class.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
/* harmony import */ var _utils_get_support__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/get-support */ "./node_modules/swiper/esm/utils/get-support.js");
/* harmony import */ var _utils_get_device__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/get-device */ "./node_modules/swiper/esm/utils/get-device.js");
/* harmony import */ var _utils_get_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/get-browser */ "./node_modules/swiper/esm/utils/get-browser.js");
/* harmony import */ var _modules_resize_resize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../modules/resize/resize */ "./node_modules/swiper/esm/modules/resize/resize.js");
/* harmony import */ var _modules_observer_observer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../modules/observer/observer */ "./node_modules/swiper/esm/modules/observer/observer.js");
/* harmony import */ var _modular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modular */ "./node_modules/swiper/esm/components/core/modular.js");
/* harmony import */ var _events_emitter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./events-emitter */ "./node_modules/swiper/esm/components/core/events-emitter.js");
/* harmony import */ var _update_index__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./update/index */ "./node_modules/swiper/esm/components/core/update/index.js");
/* harmony import */ var _translate_index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./translate/index */ "./node_modules/swiper/esm/components/core/translate/index.js");
/* harmony import */ var _transition_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./transition/index */ "./node_modules/swiper/esm/components/core/transition/index.js");
/* harmony import */ var _slide_index__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./slide/index */ "./node_modules/swiper/esm/components/core/slide/index.js");
/* harmony import */ var _loop_index__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./loop/index */ "./node_modules/swiper/esm/components/core/loop/index.js");
/* harmony import */ var _grab_cursor_index__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./grab-cursor/index */ "./node_modules/swiper/esm/components/core/grab-cursor/index.js");
/* harmony import */ var _manipulation_index__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./manipulation/index */ "./node_modules/swiper/esm/components/core/manipulation/index.js");
/* harmony import */ var _events_index__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./events/index */ "./node_modules/swiper/esm/components/core/events/index.js");
/* harmony import */ var _breakpoints_index__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./breakpoints/index */ "./node_modules/swiper/esm/components/core/breakpoints/index.js");
/* harmony import */ var _classes_index__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./classes/index */ "./node_modules/swiper/esm/components/core/classes/index.js");
/* harmony import */ var _images_index__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./images/index */ "./node_modules/swiper/esm/components/core/images/index.js");
/* harmony import */ var _check_overflow_index__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./check-overflow/index */ "./node_modules/swiper/esm/components/core/check-overflow/index.js");
/* harmony import */ var _defaults__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./defaults */ "./node_modules/swiper/esm/components/core/defaults.js");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint no-param-reassign: "off" */






















var prototypes = {
  modular: _modular__WEBPACK_IMPORTED_MODULE_7__["default"],
  eventsEmitter: _events_emitter__WEBPACK_IMPORTED_MODULE_8__["default"],
  update: _update_index__WEBPACK_IMPORTED_MODULE_9__["default"],
  translate: _translate_index__WEBPACK_IMPORTED_MODULE_10__["default"],
  transition: _transition_index__WEBPACK_IMPORTED_MODULE_11__["default"],
  slide: _slide_index__WEBPACK_IMPORTED_MODULE_12__["default"],
  loop: _loop_index__WEBPACK_IMPORTED_MODULE_13__["default"],
  grabCursor: _grab_cursor_index__WEBPACK_IMPORTED_MODULE_14__["default"],
  manipulation: _manipulation_index__WEBPACK_IMPORTED_MODULE_15__["default"],
  events: _events_index__WEBPACK_IMPORTED_MODULE_16__["default"],
  breakpoints: _breakpoints_index__WEBPACK_IMPORTED_MODULE_17__["default"],
  checkOverflow: _check_overflow_index__WEBPACK_IMPORTED_MODULE_20__["default"],
  classes: _classes_index__WEBPACK_IMPORTED_MODULE_18__["default"],
  images: _images_index__WEBPACK_IMPORTED_MODULE_19__["default"]
};
var extendedDefaults = {};

var Swiper = /*#__PURE__*/function () {
  function Swiper() {
    var el;
    var params;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      el = args[0];
      params = args[1];
    }

    if (!params) params = {};
    params = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, params);
    if (el && !params.el) params.el = el;

    if (params.el && Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(params.el).length > 1) {
      var swipers = [];
      Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(params.el).each(function (containerEl) {
        var newParams = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    } // Swiper Instance


    var swiper = this;
    swiper.__swiper__ = true;
    swiper.support = Object(_utils_get_support__WEBPACK_IMPORTED_MODULE_2__["getSupport"])();
    swiper.device = Object(_utils_get_device__WEBPACK_IMPORTED_MODULE_3__["getDevice"])({
      userAgent: params.userAgent
    });
    swiper.browser = Object(_utils_get_browser__WEBPACK_IMPORTED_MODULE_4__["getBrowser"])();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];

    if (typeof swiper.modules === 'undefined') {
      swiper.modules = {};
    }

    Object.keys(swiper.modules).forEach(function (moduleName) {
      var module = swiper.modules[moduleName];

      if (module.params) {
        var moduleParamName = Object.keys(module.params)[0];
        var moduleParams = module.params[moduleParamName];
        if (typeof moduleParams !== 'object' || moduleParams === null) return;
        if (!(moduleParamName in params && 'enabled' in moduleParams)) return;

        if (params[moduleParamName] === true) {
          params[moduleParamName] = {
            enabled: true
          };
        }

        if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
          params[moduleParamName].enabled = true;
        }

        if (!params[moduleParamName]) params[moduleParamName] = {
          enabled: false
        };
      }
    }); // Extend defaults with modules params

    var swiperParams = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, _defaults__WEBPACK_IMPORTED_MODULE_21__["default"]);
    swiper.useParams(swiperParams); // Extend defaults with passed params

    swiper.params = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, swiper.params);
    swiper.passedParams = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])({}, params); // add event listeners

    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(function (eventName) {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }

    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    } // Save Dom lib


    swiper.$ = _utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"]; // Extend Swiper

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper, {
      el: el,
      // Classes
      classNames: [],
      // Slides
      slides: Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal: function isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },
      isVertical: function isVertical() {
        return swiper.params.direction === 'vertical';
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEvents: function touchEvents() {
        var touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        var desktop = ['mousedown', 'mousemove', 'mouseup'];

        if (swiper.support.pointerEvents) {
          desktop = ['pointerdown', 'pointermove', 'pointerup'];
        }

        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        formElements: 'input, select, option, textarea, button, video, label',
        // Last click time
        lastClickTime: Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["now"])(),
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        isTouchEvent: undefined,
        startMoving: undefined
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    }); // Install Modules

    swiper.useModules();
    swiper.emit('_swiper'); // Init

    if (swiper.params.init) {
      swiper.init();
    } // Return app instance


    return swiper;
  }

  var _proto = Swiper.prototype;

  _proto.setProgress = function setProgress(progress, speed) {
    var swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    var min = swiper.minTranslate();
    var max = swiper.maxTranslate();
    var current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  };

  _proto.emitContainerClasses = function emitContainerClasses() {
    var swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    var classes = swiper.el.className.split(' ').filter(function (className) {
      return className.indexOf('swiper-container') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', classes.join(' '));
  };

  _proto.getSlideClasses = function getSlideClasses(slideEl) {
    var swiper = this;
    return slideEl.className.split(' ').filter(function (className) {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  };

  _proto.emitSlidesClasses = function emitSlidesClasses() {
    var swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    var updates = [];
    swiper.slides.each(function (slideEl) {
      var classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl: slideEl,
        classNames: classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  };

  _proto.slidesPerViewDynamic = function slidesPerViewDynamic() {
    var swiper = this;
    var params = swiper.params,
        slides = swiper.slides,
        slidesGrid = swiper.slidesGrid,
        swiperSize = swiper.size,
        activeIndex = swiper.activeIndex;
    var spv = 1;

    if (params.centeredSlides) {
      var slideSize = slides[activeIndex].swiperSlideSize;
      var breakLoop;

      for (var i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }

      for (var _i = activeIndex - 1; _i >= 0; _i -= 1) {
        if (slides[_i] && !breakLoop) {
          slideSize += slides[_i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      for (var _i2 = activeIndex + 1; _i2 < slides.length; _i2 += 1) {
        if (slidesGrid[_i2] - slidesGrid[activeIndex] < swiperSize) {
          spv += 1;
        }
      }
    }

    return spv;
  };

  _proto.update = function update() {
    var swiper = this;
    if (!swiper || swiper.destroyed) return;
    var snapGrid = swiper.snapGrid,
        params = swiper.params; // Breakpoints

    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();

    function setTranslate() {
      var translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      var newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    var translated;

    if (swiper.params.freeMode) {
      setTranslate();

      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (!translated) {
        setTranslate();
      }
    }

    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }

    swiper.emit('update');
  };

  _proto.changeDirection = function changeDirection(newDirection, needUpdate) {
    if (needUpdate === void 0) {
      needUpdate = true;
    }

    var swiper = this;
    var currentDirection = swiper.params.direction;

    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }

    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }

    swiper.$el.removeClass("" + swiper.params.containerModifierClass + currentDirection).addClass("" + swiper.params.containerModifierClass + newDirection);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each(function (slideEl) {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  };

  _proto.mount = function mount(el) {
    var swiper = this;
    if (swiper.mounted) return true; // Find el

    var $el = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(el || swiper.params.el);
    el = $el[0];

    if (!el) {
      return false;
    }

    el.swiper = swiper; // Find Wrapper

    var $wrapperEl;

    if (el && el.shadowRoot && el.shadowRoot.querySelector) {
      $wrapperEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(el.shadowRoot.querySelector("." + swiper.params.wrapperClass)); // Children needs to return slot items

      $wrapperEl.children = function (options) {
        return $el.children(options);
      };
    } else {
      $wrapperEl = $el.children("." + swiper.params.wrapperClass);
    }

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper, {
      $el: $el,
      el: el,
      $wrapperEl: $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
      wrongRTL: $wrapperEl.css('display') === '-webkit-box'
    });
    return true;
  };

  _proto.init = function init(el) {
    var swiper = this;
    if (swiper.initialized) return swiper;
    var mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit'); // Set breakpoint

    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    } // Add Classes


    swiper.addClasses(); // Create loop

    if (swiper.params.loop) {
      swiper.loopCreate();
    } // Update size


    swiper.updateSize(); // Update slides

    swiper.updateSlides();

    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    } // Set Grab Cursor


    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }

    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    } // Slide To Initial Slide


    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit);
    } // Attach events


    swiper.attachEvents(); // Init Flag

    swiper.initialized = true; // Emit

    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  };

  _proto.destroy = function destroy(deleteInstance, cleanStyles) {
    if (deleteInstance === void 0) {
      deleteInstance = true;
    }

    if (cleanStyles === void 0) {
      cleanStyles = true;
    }

    var swiper = this;
    var params = swiper.params,
        $el = swiper.$el,
        $wrapperEl = swiper.$wrapperEl,
        slides = swiper.slides;

    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }

    swiper.emit('beforeDestroy'); // Init Flag

    swiper.initialized = false; // Detach events

    swiper.detachEvents(); // Destroy loop

    if (params.loop) {
      swiper.loopDestroy();
    } // Cleanup styles


    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr('style');
      $wrapperEl.removeAttr('style');

      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
      }
    }

    swiper.emit('destroy'); // Detach emitter events

    Object.keys(swiper.eventsListeners).forEach(function (eventName) {
      swiper.off(eventName);
    });

    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["deleteProps"])(swiper);
    }

    swiper.destroyed = true;
    return null;
  };

  Swiper.extendDefaults = function extendDefaults(newDefaults) {
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(extendedDefaults, newDefaults);
  };

  Swiper.installModule = function installModule(module) {
    if (!Swiper.prototype.modules) Swiper.prototype.modules = {};
    var name = module.name || Object.keys(Swiper.prototype.modules).length + "_" + Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["now"])();
    Swiper.prototype.modules[name] = module;
  };

  Swiper.use = function use(module) {
    if (Array.isArray(module)) {
      module.forEach(function (m) {
        return Swiper.installModule(m);
      });
      return Swiper;
    }

    Swiper.installModule(module);
    return Swiper;
  };

  _createClass(Swiper, null, [{
    key: "extendedDefaults",
    get: function get() {
      return extendedDefaults;
    }
  }, {
    key: "defaults",
    get: function get() {
      return _defaults__WEBPACK_IMPORTED_MODULE_21__["default"];
    }
  }]);

  return Swiper;
}();

Object.keys(prototypes).forEach(function (prototypeGroup) {
  Object.keys(prototypes[prototypeGroup]).forEach(function (protoMethod) {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([_modules_resize_resize__WEBPACK_IMPORTED_MODULE_5__["default"], _modules_observer_observer__WEBPACK_IMPORTED_MODULE_6__["default"]]);
/* harmony default export */ __webpack_exports__["default"] = (Swiper);

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/defaults.js":
/*!*************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/defaults.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  init: true,
  direction: 'horizontal',
  touchEventsTarget: 'container',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: false,
  nested: false,
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Free mode
  freeMode: false,
  freeModeMomentum: true,
  freeModeMomentumRatio: 1,
  freeModeMomentumBounce: true,
  freeModeMomentumBounceRatio: 1,
  freeModeMomentumVelocityRatio: 1,
  freeModeSticky: false,
  freeModeMinimumVelocity: 0.02,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerColumnFill: 'column',
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: false,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  watchSlidesVisibility: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // Images
  preloadImages: true,
  updateOnImagesReady: true,
  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  // NS
  containerModifierClass: 'swiper-container-',
  // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-invisible-blank',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events-emitter.js":
/*!*******************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events-emitter.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable no-underscore-dangle */
/* harmony default export */ __webpack_exports__["default"] = ({
  on: function on(events, handler, priority) {
    var self = this;
    if (typeof handler !== 'function') return self;
    var method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(function (event) {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },
  once: function once(events, handler, priority) {
    var self = this;
    if (typeof handler !== 'function') return self;

    function onceHandler() {
      self.off(events, onceHandler);

      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      handler.apply(self, args);
    }

    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },
  onAny: function onAny(handler, priority) {
    var self = this;
    if (typeof handler !== 'function') return self;
    var method = priority ? 'unshift' : 'push';

    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }

    return self;
  },
  offAny: function offAny(handler) {
    var self = this;
    if (!self.eventsAnyListeners) return self;
    var index = self.eventsAnyListeners.indexOf(handler);

    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }

    return self;
  },
  off: function off(events, handler) {
    var self = this;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(function (event) {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(function (eventHandler, index) {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit: function emit() {
    var self = this;
    if (!self.eventsListeners) return self;
    var events;
    var data;
    var context;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }

    data.unshift(context);
    var eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(function (event) {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(function (eventHandler) {
          eventHandler.apply(context, [event].concat(data));
        });
      }

      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(function (eventHandler) {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/index.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _onTouchStart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./onTouchStart */ "./node_modules/swiper/esm/components/core/events/onTouchStart.js");
/* harmony import */ var _onTouchMove__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./onTouchMove */ "./node_modules/swiper/esm/components/core/events/onTouchMove.js");
/* harmony import */ var _onTouchEnd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./onTouchEnd */ "./node_modules/swiper/esm/components/core/events/onTouchEnd.js");
/* harmony import */ var _onResize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./onResize */ "./node_modules/swiper/esm/components/core/events/onResize.js");
/* harmony import */ var _onClick__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./onClick */ "./node_modules/swiper/esm/components/core/events/onClick.js");
/* harmony import */ var _onScroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./onScroll */ "./node_modules/swiper/esm/components/core/events/onScroll.js");







var dummyEventAttached = false;

function dummyEventListener() {}

function attachEvents() {
  var swiper = this;
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var params = swiper.params,
      touchEvents = swiper.touchEvents,
      el = swiper.el,
      wrapperEl = swiper.wrapperEl,
      device = swiper.device,
      support = swiper.support;
  swiper.onTouchStart = _onTouchStart__WEBPACK_IMPORTED_MODULE_1__["default"].bind(swiper);
  swiper.onTouchMove = _onTouchMove__WEBPACK_IMPORTED_MODULE_2__["default"].bind(swiper);
  swiper.onTouchEnd = _onTouchEnd__WEBPACK_IMPORTED_MODULE_3__["default"].bind(swiper);

  if (params.cssMode) {
    swiper.onScroll = _onScroll__WEBPACK_IMPORTED_MODULE_6__["default"].bind(swiper);
  }

  swiper.onClick = _onClick__WEBPACK_IMPORTED_MODULE_5__["default"].bind(swiper);
  var capture = !!params.nested; // Touch Events

  if (!support.touch && support.pointerEvents) {
    el.addEventListener(touchEvents.start, swiper.onTouchStart, false);
    document.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
    document.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
  } else {
    if (support.touch) {
      var passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      el.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
      el.addEventListener(touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
        passive: false,
        capture: capture
      } : capture);
      el.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);

      if (touchEvents.cancel) {
        el.addEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
      }

      if (!dummyEventAttached) {
        document.addEventListener('touchstart', dummyEventListener);
        dummyEventAttached = true;
      }
    }

    if (params.simulateTouch && !device.ios && !device.android || params.simulateTouch && !support.touch && device.ios) {
      el.addEventListener('mousedown', swiper.onTouchStart, false);
      document.addEventListener('mousemove', swiper.onTouchMove, capture);
      document.addEventListener('mouseup', swiper.onTouchEnd, false);
    }
  } // Prevent Links Clicks


  if (params.preventClicks || params.preventClicksPropagation) {
    el.addEventListener('click', swiper.onClick, true);
  }

  if (params.cssMode) {
    wrapperEl.addEventListener('scroll', swiper.onScroll);
  } // Resize handler


  if (params.updateOnWindowResize) {
    swiper.on(device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', _onResize__WEBPACK_IMPORTED_MODULE_4__["default"], true);
  } else {
    swiper.on('observerUpdate', _onResize__WEBPACK_IMPORTED_MODULE_4__["default"], true);
  }
}

function detachEvents() {
  var swiper = this;
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var params = swiper.params,
      touchEvents = swiper.touchEvents,
      el = swiper.el,
      wrapperEl = swiper.wrapperEl,
      device = swiper.device,
      support = swiper.support;
  var capture = !!params.nested; // Touch Events

  if (!support.touch && support.pointerEvents) {
    el.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
    document.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
    document.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
  } else {
    if (support.touch) {
      var passiveListener = touchEvents.start === 'onTouchStart' && support.passiveListener && params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      el.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
      el.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
      el.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);

      if (touchEvents.cancel) {
        el.removeEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
      }
    }

    if (params.simulateTouch && !device.ios && !device.android || params.simulateTouch && !support.touch && device.ios) {
      el.removeEventListener('mousedown', swiper.onTouchStart, false);
      document.removeEventListener('mousemove', swiper.onTouchMove, capture);
      document.removeEventListener('mouseup', swiper.onTouchEnd, false);
    }
  } // Prevent Links Clicks


  if (params.preventClicks || params.preventClicksPropagation) {
    el.removeEventListener('click', swiper.onClick, true);
  }

  if (params.cssMode) {
    wrapperEl.removeEventListener('scroll', swiper.onScroll);
  } // Resize handler


  swiper.off(device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', _onResize__WEBPACK_IMPORTED_MODULE_4__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = ({
  attachEvents: attachEvents,
  detachEvents: detachEvents
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/onClick.js":
/*!*******************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/onClick.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onClick; });
function onClick(e) {
  var swiper = this;

  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();

    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/onResize.js":
/*!********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/onResize.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onResize; });
function onResize() {
  var swiper = this;
  var params = swiper.params,
      el = swiper.el;
  if (el && el.offsetWidth === 0) return; // Breakpoints

  if (params.breakpoints) {
    swiper.setBreakpoint();
  } // Save locks


  var allowSlideNext = swiper.allowSlideNext,
      allowSlidePrev = swiper.allowSlidePrev,
      snapGrid = swiper.snapGrid; // Disable locks on resize

  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();

  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }

  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  } // Return locks after resize


  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;

  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/onScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/onScroll.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onScroll; });
function onScroll() {
  var swiper = this;
  var wrapperEl = swiper.wrapperEl,
      rtlTranslate = swiper.rtlTranslate;
  swiper.previousTranslate = swiper.translate;

  if (swiper.isHorizontal()) {
    if (rtlTranslate) {
      swiper.translate = wrapperEl.scrollWidth - wrapperEl.offsetWidth - wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollLeft;
    }
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  } // eslint-disable-next-line


  if (swiper.translate === -0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  var newProgress;
  var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }

  swiper.emit('setTranslate', swiper.translate, false);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/onTouchEnd.js":
/*!**********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/onTouchEnd.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onTouchEnd; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function onTouchEnd(event) {
  var swiper = this;
  var data = swiper.touchEventsData;
  var params = swiper.params,
      touches = swiper.touches,
      rtl = swiper.rtlTranslate,
      $wrapperEl = swiper.$wrapperEl,
      slidesGrid = swiper.slidesGrid,
      snapGrid = swiper.snapGrid;
  var e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }

  data.allowTouchCallbacks = false;

  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }

    data.isMoved = false;
    data.startMoving = false;
    return;
  } // Return Grab Cursor


  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  } // Time diff


  var touchEndTime = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["now"])();
  var timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

  if (swiper.allowClick) {
    swiper.updateClickedSlide(e);
    swiper.emit('tap click', e);

    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }

  data.lastClickTime = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["now"])();
  Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["nextTick"])(function () {
    if (!swiper.destroyed) swiper.allowClick = true;
  });

  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }

  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  var currentPos;

  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }

  if (params.cssMode) {
    return;
  }

  if (params.freeMode) {
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }

      return;
    }

    if (params.freeModeMomentum) {
      if (data.velocities.length > 1) {
        var lastMoveEvent = data.velocities.pop();
        var velocityEvent = data.velocities.pop();
        var distance = lastMoveEvent.position - velocityEvent.position;
        var time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;

        if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) {
          swiper.velocity = 0;
        } // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.


        if (time > 150 || Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["now"])() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }

      swiper.velocity *= params.freeModeMomentumVelocityRatio;
      data.velocities.length = 0;
      var momentumDuration = 1000 * params.freeModeMomentumRatio;
      var momentumDistance = swiper.velocity * momentumDuration;
      var newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      var doBounce = false;
      var afterBouncePosition;
      var bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
      var needsLoopFix;

      if (newPosition < swiper.maxTranslate()) {
        if (params.freeModeMomentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }

          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }

        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeModeMomentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }

          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }

        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeModeSticky) {
        var nextSlide;

        for (var j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }

        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }

        newPosition = -newPosition;
      }

      if (needsLoopFix) {
        swiper.once('transitionEnd', function () {
          swiper.loopFix();
        });
      } // Fix duration


      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }

        if (params.freeModeSticky) {
          // If freeModeSticky is active and the user ends a swipe with a slow-velocity
          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
          // It's easy to see this when simulating touch with mouse events. To fix this,
          // limit single-slide swipes to the default slide duration. This also has the
          // nice side effect of matching slide speed if the user stopped moving before
          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
          // For faster swipes, also apply limits (albeit higher ones).
          var moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          var currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeModeSticky) {
        swiper.slideToClosest();
        return;
      }

      if (params.freeModeMomentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        $wrapperEl.transitionEnd(function () {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          swiper.emit('momentumBounce');
          swiper.setTransition(params.speed);
          setTimeout(function () {
            swiper.setTranslate(afterBouncePosition);
            $wrapperEl.transitionEnd(function () {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);

        if (!swiper.animating) {
          swiper.animating = true;
          $wrapperEl.transitionEnd(function () {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.emit('_freeModeNoMomentumRelease');
        swiper.updateProgress(newPosition);
      }

      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeModeSticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      swiper.emit('_freeModeNoMomentumRelease');
    }

    if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    return;
  } // Find current slide


  var stopIndex = 0;
  var groupSize = swiper.slidesSizesGrid[0];

  for (var i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    var _increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

    if (typeof slidesGrid[i + _increment] !== 'undefined') {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + _increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + _increment] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  } // Find current slide size


  var ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  var increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
    }

    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    var isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(stopIndex + increment);
      }

      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/onTouchMove.js":
/*!***********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/onTouchMove.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onTouchMove; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");



function onTouchMove(event) {
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var swiper = this;
  var data = swiper.touchEventsData;
  var params = swiper.params,
      touches = swiper.touches,
      rtl = swiper.rtlTranslate;
  var e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }

    return;
  }

  if (data.isTouchEvent && e.type !== 'touchmove') return;
  var targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  var pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
  var pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }

  if (!swiper.allowTouchMove) {
    // isMoved = true;
    swiper.allowClick = false;

    if (data.isTouched) {
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["extend"])(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])();
    }

    return;
  }

  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }

  if (data.isTouchEvent && document.activeElement) {
    if (e.target === document.activeElement && Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(e.target).is(data.formElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }

  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }

  if (e.targetTouches && e.targetTouches.length > 1) return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  var diffX = touches.currentX - touches.startX;
  var diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) < swiper.params.threshold) return;

  if (typeof data.isScrolling === 'undefined') {
    var touchAngle;

    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }

  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }

  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }

  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }

  if (!data.startMoving) {
    return;
  }

  swiper.allowClick = false;

  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }

  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }

  if (!data.isMoved) {
    if (params.loop) {
      swiper.loopFix();
    }

    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);

    if (swiper.animating) {
      swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
    }

    data.allowMomentumBounce = false; // Grab Cursor

    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }

    swiper.emit('sliderFirstMove', e);
  }

  swiper.emit('sliderMove', e);
  data.isMoved = true;
  var diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) diff = -diff;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  data.currentTranslate = diff + data.startTranslate;
  var disableParentSwiper = true;
  var resistanceRatio = params.resistanceRatio;

  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }

  if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + Math.pow(-swiper.minTranslate() + data.startTranslate + diff, resistanceRatio);
  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - Math.pow(swiper.maxTranslate() - data.startTranslate - diff, resistanceRatio);
  }

  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  } // Directions locks


  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  } // Threshold


  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }

  if (!params.followFinger || params.cssMode) return; // Update active index in free mode

  if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  if (params.freeMode) {
    // Velocity
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data.touchStartTime
      });
    }

    data.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])()
    });
  } // Update progress


  swiper.updateProgress(data.currentTranslate); // Update translate

  swiper.setTranslate(data.currentTranslate);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/events/onTouchStart.js":
/*!************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/events/onTouchStart.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return onTouchStart; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");



function onTouchStart(event) {
  var swiper = this;
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var data = swiper.touchEventsData;
  var params = swiper.params,
      touches = swiper.touches;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }

  var e = event;
  if (e.originalEvent) e = e.originalEvent;
  var $targetEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(e.target);

  if (params.touchEventsTarget === 'wrapper') {
    if (!$targetEl.closest(swiper.wrapperEl).length) return;
  }

  data.isTouchEvent = e.type === 'touchstart';
  if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
  if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return; // change target el for shadow root componenet

  var swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

  if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
    $targetEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(event.path[0]);
  }

  if (params.noSwiping && $targetEl.closest(params.noSwipingSelector ? params.noSwipingSelector : "." + params.noSwipingClass)[0]) {
    swiper.allowClick = true;
    return;
  }

  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0]) return;
  }

  touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  var startX = touches.currentX;
  var startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  var edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  var edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
    } else {
      return;
    }
  }

  Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["extend"])(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;

  if (e.type !== 'touchstart') {
    var preventDefault = true;
    if ($targetEl.is(data.formElements)) preventDefault = false;

    if (document.activeElement && Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(document.activeElement).is(data.formElements) && document.activeElement !== $targetEl[0]) {
      document.activeElement.blur();
    }

    var shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }

  swiper.emit('touchStart', e);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/grab-cursor/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/grab-cursor/index.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setGrabCursor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setGrabCursor */ "./node_modules/swiper/esm/components/core/grab-cursor/setGrabCursor.js");
/* harmony import */ var _unsetGrabCursor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./unsetGrabCursor */ "./node_modules/swiper/esm/components/core/grab-cursor/unsetGrabCursor.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  setGrabCursor: _setGrabCursor__WEBPACK_IMPORTED_MODULE_0__["default"],
  unsetGrabCursor: _unsetGrabCursor__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/grab-cursor/setGrabCursor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/grab-cursor/setGrabCursor.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setGrabCursor; });
function setGrabCursor(moving) {
  var swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  var el = swiper.el;
  el.style.cursor = 'move';
  el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
  el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
  el.style.cursor = moving ? 'grabbing' : 'grab';
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/grab-cursor/unsetGrabCursor.js":
/*!********************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/grab-cursor/unsetGrabCursor.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return unsetGrabCursor; });
function unsetGrabCursor() {
  var swiper = this;

  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }

  swiper.el.style.cursor = '';
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/images/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/images/index.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _loadImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadImage */ "./node_modules/swiper/esm/components/core/images/loadImage.js");
/* harmony import */ var _preloadImages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./preloadImages */ "./node_modules/swiper/esm/components/core/images/preloadImages.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  loadImage: _loadImage__WEBPACK_IMPORTED_MODULE_0__["default"],
  preloadImages: _preloadImages__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/images/loadImage.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/images/loadImage.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loadImage; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");


function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var image;

  function onReady() {
    if (callback) callback();
  }

  var isPicture = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(imageEl).parent('picture')[0];

  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window.Image();
      image.onload = onReady;
      image.onerror = onReady;

      if (sizes) {
        image.sizes = sizes;
      }

      if (srcset) {
        image.srcset = srcset;
      }

      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    // image already loaded...
    onReady();
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/images/preloadImages.js":
/*!*************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/images/preloadImages.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return preloadImages; });
function preloadImages() {
  var swiper = this;
  swiper.imagesToLoad = swiper.$el.find('img');

  function onReady() {
    if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
    if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady) swiper.update();
      swiper.emit('imagesReady');
    }
  }

  for (var i = 0; i < swiper.imagesToLoad.length; i += 1) {
    var imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/loop/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/loop/index.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _loopCreate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loopCreate */ "./node_modules/swiper/esm/components/core/loop/loopCreate.js");
/* harmony import */ var _loopFix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loopFix */ "./node_modules/swiper/esm/components/core/loop/loopFix.js");
/* harmony import */ var _loopDestroy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loopDestroy */ "./node_modules/swiper/esm/components/core/loop/loopDestroy.js");



/* harmony default export */ __webpack_exports__["default"] = ({
  loopCreate: _loopCreate__WEBPACK_IMPORTED_MODULE_0__["default"],
  loopFix: _loopFix__WEBPACK_IMPORTED_MODULE_1__["default"],
  loopDestroy: _loopDestroy__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/loop/loopCreate.js":
/*!********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/loop/loopCreate.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loopCreate; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");


function loopCreate() {
  var swiper = this;
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl; // Remove duplicated slides

  $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass).remove();
  var slides = $wrapperEl.children("." + params.slideClass);

  if (params.loopFillGroupWithBlank) {
    var blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

    if (blankSlidesNum !== params.slidesPerGroup) {
      for (var i = 0; i < blankSlidesNum; i += 1) {
        var blankNode = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(document.createElement('div')).addClass(params.slideClass + " " + params.slideBlankClass);
        $wrapperEl.append(blankNode);
      }

      slides = $wrapperEl.children("." + params.slideClass);
    }
  }

  if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;

  if (swiper.loopedSlides > slides.length) {
    swiper.loopedSlides = slides.length;
  }

  var prependSlides = [];
  var appendSlides = [];
  slides.each(function (el, index) {
    var slide = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(el);

    if (index < swiper.loopedSlides) {
      appendSlides.push(el);
    }

    if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
      prependSlides.push(el);
    }

    slide.attr('data-swiper-slide-index', index);
  });

  for (var _i = 0; _i < appendSlides.length; _i += 1) {
    $wrapperEl.append(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(appendSlides[_i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }

  for (var _i2 = prependSlides.length - 1; _i2 >= 0; _i2 -= 1) {
    $wrapperEl.prepend(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(prependSlides[_i2].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/loop/loopDestroy.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/loop/loopDestroy.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loopDestroy; });
function loopDestroy() {
  var swiper = this;
  var $wrapperEl = swiper.$wrapperEl,
      params = swiper.params,
      slides = swiper.slides;
  $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + ",." + params.slideClass + "." + params.slideBlankClass).remove();
  slides.removeAttr('data-swiper-slide-index');
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/loop/loopFix.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/loop/loopFix.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return loopFix; });
function loopFix() {
  var swiper = this;
  swiper.emit('beforeLoopFix');
  var activeIndex = swiper.activeIndex,
      slides = swiper.slides,
      loopedSlides = swiper.loopedSlides,
      allowSlidePrev = swiper.allowSlidePrev,
      allowSlideNext = swiper.allowSlideNext,
      snapGrid = swiper.snapGrid,
      rtl = swiper.rtlTranslate;
  var newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  var snapTranslate = -snapGrid[activeIndex];
  var diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    var slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    // Fix For Positive Oversliding
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;

    var _slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (_slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }

  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit('loopFix');
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/manipulation/addSlide.js":
/*!**************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/manipulation/addSlide.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addSlide; });
function addSlide(index, slides) {
  var swiper = this;
  var $wrapperEl = swiper.$wrapperEl,
      params = swiper.params,
      activeIndex = swiper.activeIndex;
  var activeIndexBuffer = activeIndex;

  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children("." + params.slideClass);
  }

  var baseLength = swiper.slides.length;

  if (index <= 0) {
    swiper.prependSlide(slides);
    return;
  }

  if (index >= baseLength) {
    swiper.appendSlide(slides);
    return;
  }

  var newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
  var slidesBuffer = [];

  for (var i = baseLength - 1; i >= index; i -= 1) {
    var currentSlide = swiper.slides.eq(i);
    currentSlide.remove();
    slidesBuffer.unshift(currentSlide);
  }

  if (typeof slides === 'object' && 'length' in slides) {
    for (var _i = 0; _i < slides.length; _i += 1) {
      if (slides[_i]) $wrapperEl.append(slides[_i]);
    }

    newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
  } else {
    $wrapperEl.append(slides);
  }

  for (var _i2 = 0; _i2 < slidesBuffer.length; _i2 += 1) {
    $wrapperEl.append(slidesBuffer[_i2]);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!(params.observer && swiper.support.observer)) {
    swiper.update();
  }

  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/manipulation/appendSlide.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/manipulation/appendSlide.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return appendSlide; });
function appendSlide(slides) {
  var swiper = this;
  var $wrapperEl = swiper.$wrapperEl,
      params = swiper.params;

  if (params.loop) {
    swiper.loopDestroy();
  }

  if (typeof slides === 'object' && 'length' in slides) {
    for (var i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.append(slides[i]);
    }
  } else {
    $wrapperEl.append(slides);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!(params.observer && swiper.support.observer)) {
    swiper.update();
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/manipulation/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/manipulation/index.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _appendSlide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./appendSlide */ "./node_modules/swiper/esm/components/core/manipulation/appendSlide.js");
/* harmony import */ var _prependSlide__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prependSlide */ "./node_modules/swiper/esm/components/core/manipulation/prependSlide.js");
/* harmony import */ var _addSlide__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addSlide */ "./node_modules/swiper/esm/components/core/manipulation/addSlide.js");
/* harmony import */ var _removeSlide__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./removeSlide */ "./node_modules/swiper/esm/components/core/manipulation/removeSlide.js");
/* harmony import */ var _removeAllSlides__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./removeAllSlides */ "./node_modules/swiper/esm/components/core/manipulation/removeAllSlides.js");





/* harmony default export */ __webpack_exports__["default"] = ({
  appendSlide: _appendSlide__WEBPACK_IMPORTED_MODULE_0__["default"],
  prependSlide: _prependSlide__WEBPACK_IMPORTED_MODULE_1__["default"],
  addSlide: _addSlide__WEBPACK_IMPORTED_MODULE_2__["default"],
  removeSlide: _removeSlide__WEBPACK_IMPORTED_MODULE_3__["default"],
  removeAllSlides: _removeAllSlides__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/manipulation/prependSlide.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/manipulation/prependSlide.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return prependSlide; });
function prependSlide(slides) {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      activeIndex = swiper.activeIndex;

  if (params.loop) {
    swiper.loopDestroy();
  }

  var newActiveIndex = activeIndex + 1;

  if (typeof slides === 'object' && 'length' in slides) {
    for (var i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.prepend(slides[i]);
    }

    newActiveIndex = activeIndex + slides.length;
  } else {
    $wrapperEl.prepend(slides);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!(params.observer && swiper.support.observer)) {
    swiper.update();
  }

  swiper.slideTo(newActiveIndex, 0, false);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/manipulation/removeAllSlides.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/manipulation/removeAllSlides.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return removeAllSlides; });
function removeAllSlides() {
  var swiper = this;
  var slidesIndexes = [];

  for (var i = 0; i < swiper.slides.length; i += 1) {
    slidesIndexes.push(i);
  }

  swiper.removeSlide(slidesIndexes);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/manipulation/removeSlide.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/manipulation/removeSlide.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return removeSlide; });
function removeSlide(slidesIndexes) {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      activeIndex = swiper.activeIndex;
  var activeIndexBuffer = activeIndex;

  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children("." + params.slideClass);
  }

  var newActiveIndex = activeIndexBuffer;
  var indexToRemove;

  if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
    for (var i = 0; i < slidesIndexes.length; i += 1) {
      indexToRemove = slidesIndexes[i];
      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    }

    newActiveIndex = Math.max(newActiveIndex, 0);
  } else {
    indexToRemove = slidesIndexes;
    if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!(params.observer && swiper.support.observer)) {
    swiper.update();
  }

  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/modular.js":
/*!************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/modular.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  useParams: function useParams(instanceParams) {
    var instance = this;
    if (!instance.modules) return;
    Object.keys(instance.modules).forEach(function (moduleName) {
      var module = instance.modules[moduleName]; // Extend params

      if (module.params) {
        Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(instanceParams, module.params);
      }
    });
  },
  useModules: function useModules(modulesParams) {
    if (modulesParams === void 0) {
      modulesParams = {};
    }

    var instance = this;
    if (!instance.modules) return;
    Object.keys(instance.modules).forEach(function (moduleName) {
      var module = instance.modules[moduleName];
      var moduleParams = modulesParams[moduleName] || {}; // Add event listeners

      if (module.on && instance.on) {
        Object.keys(module.on).forEach(function (moduleEventName) {
          instance.on(moduleEventName, module.on[moduleEventName]);
        });
      } // Module create callback


      if (module.create) {
        module.create.bind(instance)(moduleParams);
      }
    });
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/index.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _slideTo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./slideTo */ "./node_modules/swiper/esm/components/core/slide/slideTo.js");
/* harmony import */ var _slideToLoop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./slideToLoop */ "./node_modules/swiper/esm/components/core/slide/slideToLoop.js");
/* harmony import */ var _slideNext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./slideNext */ "./node_modules/swiper/esm/components/core/slide/slideNext.js");
/* harmony import */ var _slidePrev__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./slidePrev */ "./node_modules/swiper/esm/components/core/slide/slidePrev.js");
/* harmony import */ var _slideReset__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./slideReset */ "./node_modules/swiper/esm/components/core/slide/slideReset.js");
/* harmony import */ var _slideToClosest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./slideToClosest */ "./node_modules/swiper/esm/components/core/slide/slideToClosest.js");
/* harmony import */ var _slideToClickedSlide__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./slideToClickedSlide */ "./node_modules/swiper/esm/components/core/slide/slideToClickedSlide.js");







/* harmony default export */ __webpack_exports__["default"] = ({
  slideTo: _slideTo__WEBPACK_IMPORTED_MODULE_0__["default"],
  slideToLoop: _slideToLoop__WEBPACK_IMPORTED_MODULE_1__["default"],
  slideNext: _slideNext__WEBPACK_IMPORTED_MODULE_2__["default"],
  slidePrev: _slidePrev__WEBPACK_IMPORTED_MODULE_3__["default"],
  slideReset: _slideReset__WEBPACK_IMPORTED_MODULE_4__["default"],
  slideToClosest: _slideToClosest__WEBPACK_IMPORTED_MODULE_5__["default"],
  slideToClickedSlide: _slideToClickedSlide__WEBPACK_IMPORTED_MODULE_6__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slideNext.js":
/*!********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slideNext.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slideNext; });
/* eslint no-unused-vars: "off" */
function slideNext(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  var swiper = this;
  var params = swiper.params,
      animating = swiper.animating;
  var increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slidePrev.js":
/*!********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slidePrev.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slidePrev; });
/* eslint no-unused-vars: "off" */
function slidePrev(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  var swiper = this;
  var params = swiper.params,
      animating = swiper.animating,
      snapGrid = swiper.snapGrid,
      slidesGrid = swiper.slidesGrid,
      rtlTranslate = swiper.rtlTranslate;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  var translate = rtlTranslate ? swiper.translate : -swiper.translate;

  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }

  var normalizedTranslate = normalize(translate);
  var normalizedSnapGrid = snapGrid.map(function (val) {
    return normalize(val);
  });
  var currentSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate)];
  var prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

  if (typeof prevSnap === 'undefined' && params.cssMode) {
    snapGrid.forEach(function (snap) {
      if (!prevSnap && normalizedTranslate >= snap) prevSnap = snap;
    });
  }

  var prevIndex;

  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
  }

  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slideReset.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slideReset.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slideReset; });
/* eslint no-unused-vars: "off" */
function slideReset(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  var swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slideTo.js":
/*!******************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slideTo.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slideTo; });
function slideTo(index, speed, runCallbacks, internal) {
  if (index === void 0) {
    index = 0;
  }

  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  if (typeof index !== 'number' && typeof index !== 'string') {
    throw new Error("The 'index' argument cannot have type other than 'number' or 'string'. [" + typeof index + "] given.");
  }

  if (typeof index === 'string') {
    /**
     * The `index` argument converted from `string` to `number`.
     * @type {number}
     */
    var indexAsNumber = parseInt(index, 10);
    /**
     * Determines whether the `index` argument is a valid `number`
     * after being converted from the `string` type.
     * @type {boolean}
     */

    var isValidNumber = isFinite(indexAsNumber);

    if (!isValidNumber) {
      throw new Error("The passed-in 'index' (string) couldn't be converted to 'number'. [" + index + "] given.");
    } // Knowing that the converted `index` is a valid number,
    // we can update the original argument's value.


    index = indexAsNumber;
  }

  var swiper = this;
  var slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  var params = swiper.params,
      snapGrid = swiper.snapGrid,
      slidesGrid = swiper.slidesGrid,
      previousIndex = swiper.previousIndex,
      activeIndex = swiper.activeIndex,
      rtl = swiper.rtlTranslate,
      wrapperEl = swiper.wrapperEl;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }

  var skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  var snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  }

  var translate = -snapGrid[snapIndex]; // Update progress

  swiper.updateProgress(translate); // Normalize slideIndex

  if (params.normalizeSlideIndex) {
    for (var i = 0; i < slidesGrid.length; i += 1) {
      var normalizedTranslate = -Math.floor(translate * 100);
      var normalizedGird = Math.floor(slidesGrid[i] * 100);
      var normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGird && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGird) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGird && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGird) {
        slideIndex = i;
      }
    }
  } // Directions locks


  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
      return false;
    }

    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) return false;
    }
  }

  var direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex); // Update Height

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    swiper.updateSlidesClasses();

    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }

    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }

    return false;
  }

  if (params.cssMode) {
    var isH = swiper.isHorizontal();
    var t = -translate;

    if (rtl) {
      t = wrapperEl.scrollWidth - wrapperEl.offsetWidth - t;
    }

    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
    } else {
      // eslint-disable-next-line
      if (wrapperEl.scrollTo) {
        var _wrapperEl$scrollTo;

        wrapperEl.scrollTo((_wrapperEl$scrollTo = {}, _wrapperEl$scrollTo[isH ? 'left' : 'top'] = t, _wrapperEl$scrollTo.behavior = 'smooth', _wrapperEl$scrollTo));
      } else {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
      }
    }

    return true;
  }

  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    swiper.transitionEnd(runCallbacks, direction);
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);

    if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
    }
  }

  return true;
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slideToClickedSlide.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slideToClickedSlide.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slideToClickedSlide; });
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");


function slideToClickedSlide() {
  var swiper = this;
  var params = swiper.params,
      $wrapperEl = swiper.$wrapperEl;
  var slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  var slideToIndex = swiper.clickedIndex;
  var realIndex;

  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children("." + params.slideClass + "[data-swiper-slide-index=\"" + realIndex + "\"]:not(." + params.slideDuplicateClass + ")").eq(0).index();
        Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children("." + params.slideClass + "[data-swiper-slide-index=\"" + realIndex + "\"]:not(." + params.slideDuplicateClass + ")").eq(0).index();
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["nextTick"])(function () {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slideToClosest.js":
/*!*************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slideToClosest.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slideToClosest; });
/* eslint no-unused-vars: "off" */
function slideToClosest(speed, runCallbacks, internal, threshold) {
  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  if (threshold === void 0) {
    threshold = 0.5;
  }

  var swiper = this;
  var index = swiper.activeIndex;
  var skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  var snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    var currentSnap = swiper.snapGrid[snapIndex];
    var nextSnap = swiper.snapGrid[snapIndex + 1];

    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    var prevSnap = swiper.snapGrid[snapIndex - 1];
    var _currentSnap = swiper.snapGrid[snapIndex];

    if (translate - prevSnap <= (_currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }

  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/slide/slideToLoop.js":
/*!**********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/slide/slideToLoop.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return slideToLoop; });
function slideToLoop(index, speed, runCallbacks, internal) {
  if (index === void 0) {
    index = 0;
  }

  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  var swiper = this;
  var newIndex = index;

  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }

  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/transition/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/transition/index.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setTransition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setTransition */ "./node_modules/swiper/esm/components/core/transition/setTransition.js");
/* harmony import */ var _transitionStart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitionStart */ "./node_modules/swiper/esm/components/core/transition/transitionStart.js");
/* harmony import */ var _transitionEnd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transitionEnd */ "./node_modules/swiper/esm/components/core/transition/transitionEnd.js");



/* harmony default export */ __webpack_exports__["default"] = ({
  setTransition: _setTransition__WEBPACK_IMPORTED_MODULE_0__["default"],
  transitionStart: _transitionStart__WEBPACK_IMPORTED_MODULE_1__["default"],
  transitionEnd: _transitionEnd__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/transition/setTransition.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/transition/setTransition.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setTransition; });
function setTransition(duration, byController) {
  var swiper = this;

  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }

  swiper.emit('setTransition', duration, byController);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/transition/transitionEnd.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/transition/transitionEnd.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return transitionEnd; });
function transitionEnd(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  var swiper = this;
  var activeIndex = swiper.activeIndex,
      previousIndex = swiper.previousIndex,
      params = swiper.params;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  var dir = direction;

  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit('transitionEnd');

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit('slideResetTransitionEnd');
      return;
    }

    swiper.emit('slideChangeTransitionEnd');

    if (dir === 'next') {
      swiper.emit('slideNextTransitionEnd');
    } else {
      swiper.emit('slidePrevTransitionEnd');
    }
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/transition/transitionStart.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/transition/transitionStart.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return transitionStart; });
function transitionStart(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  var swiper = this;
  var activeIndex = swiper.activeIndex,
      params = swiper.params,
      previousIndex = swiper.previousIndex;
  if (params.cssMode) return;

  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }

  var dir = direction;

  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit('transitionStart');

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit('slideResetTransitionStart');
      return;
    }

    swiper.emit('slideChangeTransitionStart');

    if (dir === 'next') {
      swiper.emit('slideNextTransitionStart');
    } else {
      swiper.emit('slidePrevTransitionStart');
    }
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/translate/getTranslate.js":
/*!***************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/translate/getTranslate.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getSwiperTranslate; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function getSwiperTranslate(axis) {
  if (axis === void 0) {
    axis = this.isHorizontal() ? 'x' : 'y';
  }

  var swiper = this;
  var params = swiper.params,
      rtl = swiper.rtlTranslate,
      translate = swiper.translate,
      $wrapperEl = swiper.$wrapperEl;

  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }

  if (params.cssMode) {
    return translate;
  }

  var currentTranslate = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["getTranslate"])($wrapperEl[0], axis);
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/translate/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/translate/index.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getTranslate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getTranslate */ "./node_modules/swiper/esm/components/core/translate/getTranslate.js");
/* harmony import */ var _setTranslate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setTranslate */ "./node_modules/swiper/esm/components/core/translate/setTranslate.js");
/* harmony import */ var _minTranslate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./minTranslate */ "./node_modules/swiper/esm/components/core/translate/minTranslate.js");
/* harmony import */ var _maxTranslate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./maxTranslate */ "./node_modules/swiper/esm/components/core/translate/maxTranslate.js");
/* harmony import */ var _translateTo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./translateTo */ "./node_modules/swiper/esm/components/core/translate/translateTo.js");





/* harmony default export */ __webpack_exports__["default"] = ({
  getTranslate: _getTranslate__WEBPACK_IMPORTED_MODULE_0__["default"],
  setTranslate: _setTranslate__WEBPACK_IMPORTED_MODULE_1__["default"],
  minTranslate: _minTranslate__WEBPACK_IMPORTED_MODULE_2__["default"],
  maxTranslate: _maxTranslate__WEBPACK_IMPORTED_MODULE_3__["default"],
  translateTo: _translateTo__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/translate/maxTranslate.js":
/*!***************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/translate/maxTranslate.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return maxTranslate; });
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/translate/minTranslate.js":
/*!***************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/translate/minTranslate.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return minTranslate; });
function minTranslate() {
  return -this.snapGrid[0];
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/translate/setTranslate.js":
/*!***************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/translate/setTranslate.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setTranslate; });
function setTranslate(translate, byController) {
  var swiper = this;
  var rtl = swiper.rtlTranslate,
      params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      wrapperEl = swiper.wrapperEl,
      progress = swiper.progress;
  var x = 0;
  var y = 0;
  var z = 0;

  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }

  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }

  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform("translate3d(" + x + "px, " + y + "px, " + z + "px)");
  }

  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

  var newProgress;
  var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }

  swiper.emit('setTranslate', swiper.translate, byController);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/translate/translateTo.js":
/*!**************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/translate/translateTo.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return translateTo; });
function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
  if (translate === void 0) {
    translate = 0;
  }

  if (speed === void 0) {
    speed = this.params.speed;
  }

  if (runCallbacks === void 0) {
    runCallbacks = true;
  }

  if (translateBounds === void 0) {
    translateBounds = true;
  }

  var swiper = this;
  var params = swiper.params,
      wrapperEl = swiper.wrapperEl;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }

  var minTranslate = swiper.minTranslate();
  var maxTranslate = swiper.maxTranslate();
  var newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

  swiper.updateProgress(newTranslate);

  if (params.cssMode) {
    var isH = swiper.isHorizontal();

    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      // eslint-disable-next-line
      if (wrapperEl.scrollTo) {
        var _wrapperEl$scrollTo;

        wrapperEl.scrollTo((_wrapperEl$scrollTo = {}, _wrapperEl$scrollTo[isH ? 'left' : 'top'] = -newTranslate, _wrapperEl$scrollTo.behavior = 'smooth', _wrapperEl$scrollTo));
      } else {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
      }
    }

    return true;
  }

  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }

    if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;

          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
    }
  }

  return true;
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/index.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _updateSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateSize */ "./node_modules/swiper/esm/components/core/update/updateSize.js");
/* harmony import */ var _updateSlides__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateSlides */ "./node_modules/swiper/esm/components/core/update/updateSlides.js");
/* harmony import */ var _updateAutoHeight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./updateAutoHeight */ "./node_modules/swiper/esm/components/core/update/updateAutoHeight.js");
/* harmony import */ var _updateSlidesOffset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./updateSlidesOffset */ "./node_modules/swiper/esm/components/core/update/updateSlidesOffset.js");
/* harmony import */ var _updateSlidesProgress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./updateSlidesProgress */ "./node_modules/swiper/esm/components/core/update/updateSlidesProgress.js");
/* harmony import */ var _updateProgress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./updateProgress */ "./node_modules/swiper/esm/components/core/update/updateProgress.js");
/* harmony import */ var _updateSlidesClasses__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./updateSlidesClasses */ "./node_modules/swiper/esm/components/core/update/updateSlidesClasses.js");
/* harmony import */ var _updateActiveIndex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./updateActiveIndex */ "./node_modules/swiper/esm/components/core/update/updateActiveIndex.js");
/* harmony import */ var _updateClickedSlide__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./updateClickedSlide */ "./node_modules/swiper/esm/components/core/update/updateClickedSlide.js");









/* harmony default export */ __webpack_exports__["default"] = ({
  updateSize: _updateSize__WEBPACK_IMPORTED_MODULE_0__["default"],
  updateSlides: _updateSlides__WEBPACK_IMPORTED_MODULE_1__["default"],
  updateAutoHeight: _updateAutoHeight__WEBPACK_IMPORTED_MODULE_2__["default"],
  updateSlidesOffset: _updateSlidesOffset__WEBPACK_IMPORTED_MODULE_3__["default"],
  updateSlidesProgress: _updateSlidesProgress__WEBPACK_IMPORTED_MODULE_4__["default"],
  updateProgress: _updateProgress__WEBPACK_IMPORTED_MODULE_5__["default"],
  updateSlidesClasses: _updateSlidesClasses__WEBPACK_IMPORTED_MODULE_6__["default"],
  updateActiveIndex: _updateActiveIndex__WEBPACK_IMPORTED_MODULE_7__["default"],
  updateClickedSlide: _updateClickedSlide__WEBPACK_IMPORTED_MODULE_8__["default"]
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateActiveIndex.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateActiveIndex.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateActiveIndex; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function updateActiveIndex(newActiveIndex) {
  var swiper = this;
  var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  var slidesGrid = swiper.slidesGrid,
      snapGrid = swiper.snapGrid,
      params = swiper.params,
      previousIndex = swiper.activeIndex,
      previousRealIndex = swiper.realIndex,
      previousSnapIndex = swiper.snapIndex;
  var activeIndex = newActiveIndex;
  var snapIndex;

  if (typeof activeIndex === 'undefined') {
    for (var i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate >= slidesGrid[i]) {
        activeIndex = i;
      }
    } // Normalize slideIndex


    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
    }
  }

  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    var skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }

  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }

    return;
  } // Get real index


  var realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
  Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper, {
    snapIndex: snapIndex,
    realIndex: realIndex,
    previousIndex: previousIndex,
    activeIndex: activeIndex
  });
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');

  if (previousRealIndex !== realIndex) {
    swiper.emit('realIndexChange');
  }

  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit('slideChange');
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateAutoHeight.js":
/*!****************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateAutoHeight.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateAutoHeight; });
function updateAutoHeight(speed) {
  var swiper = this;
  var activeSlides = [];
  var newHeight = 0;
  var i;

  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  } // Find slides currently in view


  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      swiper.visibleSlides.each(function (slide) {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        var index = swiper.activeIndex + i;
        if (index > swiper.slides.length) break;
        activeSlides.push(swiper.slides.eq(index)[0]);
      }
    }
  } else {
    activeSlides.push(swiper.slides.eq(swiper.activeIndex)[0]);
  } // Find new height from highest slide in view


  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      var height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  } // Update Height


  if (newHeight) swiper.$wrapperEl.css('height', newHeight + "px");
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateClickedSlide.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateClickedSlide.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateClickedSlide; });
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");

function updateClickedSlide(e) {
  var swiper = this;
  var params = swiper.params;
  var slide = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(e.target).closest("." + params.slideClass)[0];
  var slideFound = false;
  var slideIndex;

  if (slide) {
    for (var i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }

  if (slide && slideFound) {
    swiper.clickedSlide = slide;

    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(slide).attr('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }

  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateProgress.js":
/*!**************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateProgress.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateProgress; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function updateProgress(translate) {
  var swiper = this;

  if (typeof translate === 'undefined') {
    var multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }

  var params = swiper.params;
  var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  var progress = swiper.progress,
      isBeginning = swiper.isBeginning,
      isEnd = swiper.isEnd;
  var wasBeginning = isBeginning;
  var wasEnd = isEnd;

  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }

  Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper, {
    progress: progress,
    isBeginning: isBeginning,
    isEnd: isEnd
  });
  if (params.watchSlidesProgress || params.watchSlidesVisibility || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }

  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }

  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }

  swiper.emit('progress', progress);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateSize.js":
/*!**********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateSize.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateSize; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function updateSize() {
  var swiper = this;
  var width;
  var height;
  var $el = swiper.$el;

  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }

  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }

  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  } // Subtract paddings


  width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
  height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper, {
    width: width,
    height: height,
    size: swiper.isHorizontal() ? width : height
  });
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateSlides.js":
/*!************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateSlides.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateSlides; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");

function updateSlides() {
  var swiper = this;

  var getDirectionLabel = function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    } // prettier-ignore


    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  };

  var getDirectionPropertyValue = function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  };

  var params = swiper.params;
  var $wrapperEl = swiper.$wrapperEl,
      swiperSize = swiper.size,
      rtl = swiper.rtlTranslate,
      wrongRTL = swiper.wrongRTL;
  var isVirtual = swiper.virtual && params.virtual.enabled;
  var previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  var slides = $wrapperEl.children("." + swiper.params.slideClass);
  var slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  var snapGrid = [];
  var slidesGrid = [];
  var slidesSizesGrid = [];

  function slidesForMargin(slideEl, slideIndex) {
    if (!params.cssMode) return true;

    if (slideIndex === slides.length - 1) {
      return false;
    }

    return true;
  }

  var offsetBefore = params.slidesOffsetBefore;

  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }

  var offsetAfter = params.slidesOffsetAfter;

  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }

  var previousSnapGridLength = swiper.snapGrid.length;
  var previousSlidesGridLength = swiper.slidesGrid.length;
  var spaceBetween = params.spaceBetween;
  var slidePosition = -offsetBefore;
  var prevSlideSize = 0;
  var index = 0;

  if (typeof swiperSize === 'undefined') {
    return;
  }

  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  }

  swiper.virtualSize = -spaceBetween; // reset margins

  if (rtl) slides.css({
    marginLeft: '',
    marginTop: ''
  });else slides.css({
    marginRight: '',
    marginBottom: ''
  });
  var slidesNumberEvenToRows;

  if (params.slidesPerColumn > 1) {
    if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
    }

    if (params.slidesPerView !== 'auto' && params.slidesPerColumnFill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
    }
  } // Calc slides


  var slideSize;
  var slidesPerColumn = params.slidesPerColumn;
  var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
  var numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);

  for (var i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    var slide = slides.eq(i);

    if (params.slidesPerColumn > 1) {
      // Set slides order
      var newSlideOrderIndex = void 0;
      var column = void 0;
      var row = void 0;

      if (params.slidesPerColumnFill === 'row' && params.slidesPerGroup > 1) {
        var groupIndex = Math.floor(i / (params.slidesPerGroup * params.slidesPerColumn));
        var slideIndexInGroup = i - params.slidesPerColumn * params.slidesPerGroup * groupIndex;
        var columnsInGroup = groupIndex === 0 ? params.slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * slidesPerColumn * params.slidesPerGroup) / slidesPerColumn), params.slidesPerGroup);
        row = Math.floor(slideIndexInGroup / columnsInGroup);
        column = slideIndexInGroup - row * columnsInGroup + groupIndex * params.slidesPerGroup;
        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
        slide.css({
          '-webkit-box-ordinal-group': newSlideOrderIndex,
          '-moz-box-ordinal-group': newSlideOrderIndex,
          '-ms-flex-order': newSlideOrderIndex,
          '-webkit-order': newSlideOrderIndex,
          order: newSlideOrderIndex
        });
      } else if (params.slidesPerColumnFill === 'column') {
        column = Math.floor(i / slidesPerColumn);
        row = i - column * slidesPerColumn;

        if (column > numFullColumns || column === numFullColumns && row === slidesPerColumn - 1) {
          row += 1;

          if (row >= slidesPerColumn) {
            row = 0;
            column += 1;
          }
        }
      } else {
        row = Math.floor(i / slidesPerRow);
        column = i - row * slidesPerRow;
      }

      slide.css(getDirectionLabel('margin-top'), row !== 0 && params.spaceBetween && params.spaceBetween + "px");
    }

    if (slide.css('display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      var slideStyles = getComputedStyle(slide[0]);
      var currentTransform = slide[0].style.transform;
      var currentWebKitTransform = slide[0].style.webkitTransform;

      if (currentTransform) {
        slide[0].style.transform = 'none';
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = 'none';
      }

      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
      } else {
        // eslint-disable-next-line
        var width = getDirectionPropertyValue(slideStyles, 'width');
        var paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        var paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        var marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        var marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        var boxSizing = slideStyles.getPropertyValue('box-sizing');

        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          var _slide$ = slide[0],
              clientWidth = _slide$.clientWidth,
              offsetWidth = _slide$.offsetWidth;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }

      if (currentTransform) {
        slide[0].style.transform = currentTransform;
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = currentWebKitTransform;
      }

      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);

      if (slides[i]) {
        slides[i].style[getDirectionLabel('width')] = slideSize + "px";
      }
    }

    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }

    slidesSizesGrid.push(slideSize);

    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }

    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }

  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  var newSlidesGrid;

  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    $wrapperEl.css({
      width: swiper.virtualSize + params.spaceBetween + "px"
    });
  }

  if (params.setWrapperSize) {
    var _$wrapperEl$css;

    $wrapperEl.css((_$wrapperEl$css = {}, _$wrapperEl$css[getDirectionLabel('width')] = swiper.virtualSize + params.spaceBetween + "px", _$wrapperEl$css));
  }

  if (params.slidesPerColumn > 1) {
    var _$wrapperEl$css2;

    swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
    $wrapperEl.css((_$wrapperEl$css2 = {}, _$wrapperEl$css2[getDirectionLabel('width')] = swiper.virtualSize + params.spaceBetween + "px", _$wrapperEl$css2));

    if (params.centeredSlides) {
      newSlidesGrid = [];

      for (var _i = 0; _i < snapGrid.length; _i += 1) {
        var slidesGridItem = snapGrid[_i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[_i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }

      snapGrid = newSlidesGrid;
    }
  } // Remove last grid elements depending on width


  if (!params.centeredSlides) {
    newSlidesGrid = [];

    for (var _i2 = 0; _i2 < snapGrid.length; _i2 += 1) {
      var _slidesGridItem = snapGrid[_i2];
      if (params.roundLengths) _slidesGridItem = Math.floor(_slidesGridItem);

      if (snapGrid[_i2] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(_slidesGridItem);
      }
    }

    snapGrid = newSlidesGrid;

    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }

  if (snapGrid.length === 0) snapGrid = [0];

  if (params.spaceBetween !== 0) {
    var _slides$filter$css;

    var key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
    slides.filter(slidesForMargin).css((_slides$filter$css = {}, _slides$filter$css[key] = spaceBetween + "px", _slides$filter$css));
  }

  if (params.centeredSlides && params.centeredSlidesBounds) {
    var allSlidesSize = 0;
    slidesSizesGrid.forEach(function (slideSizeValue) {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    var maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map(function (snap) {
      if (snap < 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }

  if (params.centerInsufficientSlides) {
    var _allSlidesSize = 0;
    slidesSizesGrid.forEach(function (slideSizeValue) {
      _allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    _allSlidesSize -= params.spaceBetween;

    if (_allSlidesSize < swiperSize) {
      var allSlidesOffset = (swiperSize - _allSlidesSize) / 2;
      snapGrid.forEach(function (snap, snapIndex) {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach(function (snap, snapIndex) {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }

  Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper, {
    slides: slides,
    snapGrid: snapGrid,
    slidesGrid: slidesGrid,
    slidesSizesGrid: slidesSizesGrid
  });

  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }

  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }

  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }

  if (params.watchSlidesProgress || params.watchSlidesVisibility) {
    swiper.updateSlidesOffset();
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateSlidesClasses.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateSlidesClasses.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateSlidesClasses; });
function updateSlidesClasses() {
  var swiper = this;
  var slides = swiper.slides,
      params = swiper.params,
      $wrapperEl = swiper.$wrapperEl,
      activeIndex = swiper.activeIndex,
      realIndex = swiper.realIndex;
  var isVirtual = swiper.virtual && params.virtual.enabled;
  slides.removeClass(params.slideActiveClass + " " + params.slideNextClass + " " + params.slidePrevClass + " " + params.slideDuplicateActiveClass + " " + params.slideDuplicateNextClass + " " + params.slideDuplicatePrevClass);
  var activeSlide;

  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find("." + params.slideClass + "[data-swiper-slide-index=\"" + activeIndex + "\"]");
  } else {
    activeSlide = slides.eq(activeIndex);
  } // Active classes


  activeSlide.addClass(params.slideActiveClass);

  if (params.loop) {
    // Duplicate to all looped slides
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ")[data-swiper-slide-index=\"" + realIndex + "\"]").addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + "[data-swiper-slide-index=\"" + realIndex + "\"]").addClass(params.slideDuplicateActiveClass);
    }
  } // Next Slide


  var nextSlide = activeSlide.nextAll("." + params.slideClass).eq(0).addClass(params.slideNextClass);

  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  } // Prev Slide


  var prevSlide = activeSlide.prevAll("." + params.slideClass).eq(0).addClass(params.slidePrevClass);

  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }

  if (params.loop) {
    // Duplicate to all looped slides
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ")[data-swiper-slide-index=\"" + nextSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + "[data-swiper-slide-index=\"" + nextSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicateNextClass);
    }

    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ")[data-swiper-slide-index=\"" + prevSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + "[data-swiper-slide-index=\"" + prevSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicatePrevClass);
    }
  }

  swiper.emitSlidesClasses();
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateSlidesOffset.js":
/*!******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateSlidesOffset.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateSlidesOffset; });
function updateSlidesOffset() {
  var swiper = this;
  var slides = swiper.slides;

  for (var i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/core/update/updateSlidesProgress.js":
/*!********************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/core/update/updateSlidesProgress.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return updateSlidesProgress; });
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");

function updateSlidesProgress(translate) {
  if (translate === void 0) {
    translate = this && this.translate || 0;
  }

  var swiper = this;
  var params = swiper.params;
  var slides = swiper.slides,
      rtl = swiper.rtlTranslate;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  var offsetCenter = -translate;
  if (rtl) offsetCenter = translate; // Visible Slides

  slides.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];

  for (var i = 0; i < slides.length; i += 1) {
    var slide = slides[i];
    var slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + params.spaceBetween);

    if (params.watchSlidesVisibility || params.centeredSlides && params.autoHeight) {
      var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
      var slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      var isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

      if (isVisible) {
        swiper.visibleSlides.push(slide);
        swiper.visibleSlidesIndexes.push(i);
        slides.eq(i).addClass(params.slideVisibleClass);
      }
    }

    slide.progress = rtl ? -slideProgress : slideProgress;
  }

  swiper.visibleSlides = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(swiper.visibleSlides);
}

/***/ }),

/***/ "./node_modules/swiper/esm/components/effect-coverflow/effect-coverflow.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/effect-coverflow/effect-coverflow.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Coverflow = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var swiperWidth = swiper.width,
        swiperHeight = swiper.height,
        slides = swiper.slides,
        slidesSizesGrid = swiper.slidesSizesGrid;
    var params = swiper.params.coverflowEffect;
    var isHorizontal = swiper.isHorizontal();
    var transform = swiper.translate;
    var center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
    var rotate = isHorizontal ? params.rotate : -params.rotate;
    var translate = params.depth; // Each slide offset from center

    for (var i = 0, length = slides.length; i < length; i += 1) {
      var $slideEl = slides.eq(i);
      var slideSize = slidesSizesGrid[i];
      var slideOffset = $slideEl[0].swiperSlideOffset;
      var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * params.modifier;
      var rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      var rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

      var translateZ = -translate * Math.abs(offsetMultiplier);
      var stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

      if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
        stretch = parseFloat(params.stretch) / 100 * slideSize;
      }

      var translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
      var translateX = isHorizontal ? stretch * offsetMultiplier : 0;
      var scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;
      if (Math.abs(scale) < 0.001) scale = 0;
      var slideTransform = "translate3d(" + translateX + "px," + translateY + "px," + translateZ + "px)  rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(" + scale + ")";
      $slideEl.transform(slideTransform);
      $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

      if (params.slideShadows) {
        // Set shadows
        var $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        var $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if ($shadowBeforeEl.length === 0) {
          $shadowBeforeEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'left' : 'top') + "\"></div>");
          $slideEl.append($shadowBeforeEl);
        }

        if ($shadowAfterEl.length === 0) {
          $shadowAfterEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'right' : 'bottom') + "\"></div>");
          $slideEl.append($shadowAfterEl);
        }

        if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    swiper.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'effect-coverflow',
  params: {
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      scale: 1,
      modifier: 1,
      slideShadows: true
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      coverflowEffect: _extends({}, Coverflow)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (swiper.params.effect !== 'coverflow') return;
      swiper.classNames.push(swiper.params.containerModifierClass + "coverflow");
      swiper.classNames.push(swiper.params.containerModifierClass + "3d");
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    setTranslate: function setTranslate(swiper) {
      if (swiper.params.effect !== 'coverflow') return;
      swiper.coverflowEffect.setTranslate();
    },
    setTransition: function setTransition(swiper, duration) {
      if (swiper.params.effect !== 'coverflow') return;
      swiper.coverflowEffect.setTransition(duration);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/effect-cube/effect-cube.js":
/*!***********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/effect-cube/effect-cube.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Cube = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var $el = swiper.$el,
        $wrapperEl = swiper.$wrapperEl,
        slides = swiper.slides,
        swiperWidth = swiper.width,
        swiperHeight = swiper.height,
        rtl = swiper.rtlTranslate,
        swiperSize = swiper.size,
        browser = swiper.browser;
    var params = swiper.params.cubeEffect;
    var isHorizontal = swiper.isHorizontal();
    var isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    var wrapperRotate = 0;
    var $cubeShadowEl;

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])('<div class="swiper-cube-shadow"></div>');
          $wrapperEl.append($cubeShadowEl);
        }

        $cubeShadowEl.css({
          height: swiperWidth + "px"
        });
      } else {
        $cubeShadowEl = $el.find('.swiper-cube-shadow');

        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])('<div class="swiper-cube-shadow"></div>');
          $el.append($cubeShadowEl);
        }
      }
    }

    for (var i = 0; i < slides.length; i += 1) {
      var $slideEl = slides.eq(i);
      var slideIndex = i;

      if (isVirtual) {
        slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
      }

      var slideAngle = slideIndex * 90;
      var round = Math.floor(slideAngle / 360);

      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }

      var progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      var tx = 0;
      var ty = 0;
      var tz = 0;

      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }

      if (rtl) {
        tx = -tx;
      }

      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }

      var transform = "rotateX(" + (isHorizontal ? 0 : -slideAngle) + "deg) rotateY(" + (isHorizontal ? slideAngle : 0) + "deg) translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";

      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
      }

      $slideEl.transform(transform);

      if (params.slideShadows) {
        // Set shadows
        var shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        var shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if (shadowBefore.length === 0) {
          shadowBefore = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'left' : 'top') + "\"></div>");
          $slideEl.append(shadowBefore);
        }

        if (shadowAfter.length === 0) {
          shadowAfter = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'right' : 'bottom') + "\"></div>");
          $slideEl.append(shadowAfter);
        }

        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
      }
    }

    $wrapperEl.css({
      '-webkit-transform-origin': "50% 50% -" + swiperSize / 2 + "px",
      '-moz-transform-origin': "50% 50% -" + swiperSize / 2 + "px",
      '-ms-transform-origin': "50% 50% -" + swiperSize / 2 + "px",
      'transform-origin': "50% 50% -" + swiperSize / 2 + "px"
    });

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl.transform("translate3d(0px, " + (swiperWidth / 2 + params.shadowOffset) + "px, " + -swiperWidth / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + params.shadowScale + ")");
      } else {
        var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        var scale1 = params.shadowScale;
        var scale2 = params.shadowScale / multiplier;
        var offset = params.shadowOffset;
        $cubeShadowEl.transform("scale3d(" + scale1 + ", 1, " + scale2 + ") translate3d(0px, " + (swiperHeight / 2 + offset) + "px, " + -swiperHeight / 2 / scale2 + "px) rotateX(-90deg)");
      }
    }

    var zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
    $wrapperEl.transform("translate3d(0px,0," + zFactor + "px) rotateX(" + (swiper.isHorizontal() ? 0 : wrapperRotate) + "deg) rotateY(" + (swiper.isHorizontal() ? -wrapperRotate : 0) + "deg)");
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    var $el = swiper.$el,
        slides = swiper.slides;
    slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      $el.find('.swiper-cube-shadow').transition(duration);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'effect-cube',
  params: {
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      cubeEffect: _extends({}, Cube)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (swiper.params.effect !== 'cube') return;
      swiper.classNames.push(swiper.params.containerModifierClass + "cube");
      swiper.classNames.push(swiper.params.containerModifierClass + "3d");
      var overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true
      };
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.params, overwriteParams);
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.originalParams, overwriteParams);
    },
    setTranslate: function setTranslate(swiper) {
      if (swiper.params.effect !== 'cube') return;
      swiper.cubeEffect.setTranslate();
    },
    setTransition: function setTransition(swiper, duration) {
      if (swiper.params.effect !== 'cube') return;
      swiper.cubeEffect.setTransition(duration);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/effect-fade/effect-fade.js":
/*!***********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/effect-fade/effect-fade.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }


var Fade = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var slides = swiper.slides;

    for (var i = 0; i < slides.length; i += 1) {
      var $slideEl = swiper.slides.eq(i);
      var offset = $slideEl[0].swiperSlideOffset;
      var tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      var ty = 0;

      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }

      var slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
      $slideEl.css({
        opacity: slideOpacity
      }).transform("translate3d(" + tx + "px, " + ty + "px, 0px)");
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    var slides = swiper.slides,
        $wrapperEl = swiper.$wrapperEl;
    slides.transition(duration);

    if (swiper.params.virtualTranslate && duration !== 0) {
      var eventTriggered = false;
      slides.transitionEnd(function () {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        var triggerEvents = ['webkitTransitionEnd', 'transitionend'];

        for (var i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'effect-fade',
  params: {
    fadeEffect: {
      crossFade: false
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["bindModuleMethods"])(swiper, {
      fadeEffect: _extends({}, Fade)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (swiper.params.effect !== 'fade') return;
      swiper.classNames.push(swiper.params.containerModifierClass + "fade");
      var overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: true
      };
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper.params, overwriteParams);
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper.originalParams, overwriteParams);
    },
    setTranslate: function setTranslate(swiper) {
      if (swiper.params.effect !== 'fade') return;
      swiper.fadeEffect.setTranslate();
    },
    setTransition: function setTransition(swiper, duration) {
      if (swiper.params.effect !== 'fade') return;
      swiper.fadeEffect.setTransition(duration);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/effect-flip/effect-flip.js":
/*!***********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/effect-flip/effect-flip.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Flip = {
  setTranslate: function setTranslate() {
    var swiper = this;
    var slides = swiper.slides,
        rtl = swiper.rtlTranslate;

    for (var i = 0; i < slides.length; i += 1) {
      var $slideEl = slides.eq(i);
      var progress = $slideEl[0].progress;

      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      }

      var offset = $slideEl[0].swiperSlideOffset;
      var rotate = -180 * progress;
      var rotateY = rotate;
      var rotateX = 0;
      var tx = -offset;
      var ty = 0;

      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }

      $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

      if (swiper.params.flipEffect.slideShadows) {
        // Set shadows
        var shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        var shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if (shadowBefore.length === 0) {
          shadowBefore = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"swiper-slide-shadow-" + (swiper.isHorizontal() ? 'left' : 'top') + "\"></div>");
          $slideEl.append(shadowBefore);
        }

        if (shadowAfter.length === 0) {
          shadowAfter = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"swiper-slide-shadow-" + (swiper.isHorizontal() ? 'right' : 'bottom') + "\"></div>");
          $slideEl.append(shadowAfter);
        }

        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
      }

      $slideEl.transform("translate3d(" + tx + "px, " + ty + "px, 0px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)");
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    var slides = swiper.slides,
        activeIndex = swiper.activeIndex,
        $wrapperEl = swiper.$wrapperEl;
    slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

    if (swiper.params.virtualTranslate && duration !== 0) {
      var eventTriggered = false; // eslint-disable-next-line

      slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return; // if (!$(this).hasClass(swiper.params.slideActiveClass)) return;

        eventTriggered = true;
        swiper.animating = false;
        var triggerEvents = ['webkitTransitionEnd', 'transitionend'];

        for (var i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'effect-flip',
  params: {
    flipEffect: {
      slideShadows: true,
      limitRotation: true
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      flipEffect: _extends({}, Flip)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (swiper.params.effect !== 'flip') return;
      swiper.classNames.push(swiper.params.containerModifierClass + "flip");
      swiper.classNames.push(swiper.params.containerModifierClass + "3d");
      var overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: true
      };
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.params, overwriteParams);
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.originalParams, overwriteParams);
    },
    setTranslate: function setTranslate(swiper) {
      if (swiper.params.effect !== 'flip') return;
      swiper.flipEffect.setTranslate();
    },
    setTransition: function setTransition(swiper, duration) {
      if (swiper.params.effect !== 'flip') return;
      swiper.flipEffect.setTransition(duration);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/hash-navigation/hash-navigation.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/swiper/esm/components/hash-navigation/hash-navigation.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var HashNavigation = {
  onHashCange: function onHashCange() {
    var swiper = this;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    swiper.emit('hashChange');
    var newHash = document.location.hash.replace('#', '');
    var activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

    if (newHash !== activeSlideHash) {
      var newIndex = swiper.$wrapperEl.children("." + swiper.params.slideClass + "[data-hash=\"" + newHash + "\"]").index();
      if (typeof newIndex === 'undefined') return;
      swiper.slideTo(newIndex);
    }
  },
  setHash: function setHash() {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    if (!swiper.hashNavigation.initialized || !swiper.params.hashNavigation.enabled) return;

    if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, "#" + swiper.slides.eq(swiper.activeIndex).attr('data-hash') || false);
      swiper.emit('hashSet');
    } else {
      var slide = swiper.slides.eq(swiper.activeIndex);
      var hash = slide.attr('data-hash') || slide.attr('data-history');
      document.location.hash = hash || '';
      swiper.emit('hashSet');
    }
  },
  init: function init() {
    var swiper = this;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    swiper.hashNavigation.initialized = true;
    var hash = document.location.hash.replace('#', '');

    if (hash) {
      var speed = 0;

      for (var i = 0, length = swiper.slides.length; i < length; i += 1) {
        var slide = swiper.slides.eq(i);
        var slideHash = slide.attr('data-hash') || slide.attr('data-history');

        if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
          var index = slide.index();
          swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
        }
      }
    }

    if (swiper.params.hashNavigation.watchState) {
      Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(window).on('hashchange', swiper.hashNavigation.onHashCange);
    }
  },
  destroy: function destroy() {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

    if (swiper.params.hashNavigation.watchState) {
      Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(window).off('hashchange', swiper.hashNavigation.onHashCange);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'hash-navigation',
  params: {
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["bindModuleMethods"])(swiper, {
      hashNavigation: _extends({
        initialized: false
      }, HashNavigation)
    });
  },
  on: {
    init: function init(swiper) {
      if (swiper.params.hashNavigation.enabled) {
        swiper.hashNavigation.init();
      }
    },
    destroy: function destroy(swiper) {
      if (swiper.params.hashNavigation.enabled) {
        swiper.hashNavigation.destroy();
      }
    },
    transitionEnd: function transitionEnd(swiper) {
      if (swiper.hashNavigation.initialized) {
        swiper.hashNavigation.setHash();
      }
    },
    slideChange: function slideChange(swiper) {
      if (swiper.hashNavigation.initialized && swiper.params.cssMode) {
        swiper.hashNavigation.setHash();
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/history/history.js":
/*!***************************************************************!*\
  !*** ./node_modules/swiper/esm/components/history/history.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var History = {
  init: function init() {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    if (!swiper.params.history) return;

    if (!window.history || !window.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }

    var history = swiper.history;
    history.initialized = true;
    history.paths = History.getPathValues(swiper.params.url);
    if (!history.paths.key && !history.paths.value) return;
    history.scrollToSlide(0, history.paths.value, swiper.params.runCallbacksOnInit);

    if (!swiper.params.history.replaceState) {
      window.addEventListener('popstate', swiper.history.setHistoryPopState);
    }
  },
  destroy: function destroy() {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

    if (!swiper.params.history.replaceState) {
      window.removeEventListener('popstate', swiper.history.setHistoryPopState);
    }
  },
  setHistoryPopState: function setHistoryPopState() {
    var swiper = this;
    swiper.history.paths = History.getPathValues(swiper.params.url);
    swiper.history.scrollToSlide(swiper.params.speed, swiper.history.paths.value, false);
  },
  getPathValues: function getPathValues(urlOverride) {
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var location;

    if (urlOverride) {
      location = new URL(urlOverride);
    } else {
      location = window.location;
    }

    var pathArray = location.pathname.slice(1).split('/').filter(function (part) {
      return part !== '';
    });
    var total = pathArray.length;
    var key = pathArray[total - 2];
    var value = pathArray[total - 1];
    return {
      key: key,
      value: value
    };
  },
  setHistory: function setHistory(key, index) {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    if (!swiper.history.initialized || !swiper.params.history.enabled) return;
    var location;

    if (swiper.params.url) {
      location = new URL(swiper.params.url);
    } else {
      location = window.location;
    }

    var slide = swiper.slides.eq(index);
    var value = History.slugify(slide.attr('data-history'));

    if (swiper.params.history.root.length > 0) {
      var root = swiper.params.history.root;
      if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
      value = root + "/" + key + "/" + value;
    } else if (!location.pathname.includes(key)) {
      value = key + "/" + value;
    }

    var currentState = window.history.state;

    if (currentState && currentState.value === value) {
      return;
    }

    if (swiper.params.history.replaceState) {
      window.history.replaceState({
        value: value
      }, null, value);
    } else {
      window.history.pushState({
        value: value
      }, null, value);
    }
  },
  slugify: function slugify(text) {
    return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  },
  scrollToSlide: function scrollToSlide(speed, value, runCallbacks) {
    var swiper = this;

    if (value) {
      for (var i = 0, length = swiper.slides.length; i < length; i += 1) {
        var slide = swiper.slides.eq(i);
        var slideHistory = History.slugify(slide.attr('data-history'));

        if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
          var index = slide.index();
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'history',
  params: {
    history: {
      enabled: false,
      root: '',
      replaceState: false,
      key: 'slides'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      history: _extends({}, History)
    });
  },
  on: {
    init: function init(swiper) {
      if (swiper.params.history.enabled) {
        swiper.history.init();
      }
    },
    destroy: function destroy(swiper) {
      if (swiper.params.history.enabled) {
        swiper.history.destroy();
      }
    },
    transitionEnd: function transitionEnd(swiper) {
      if (swiper.history.initialized) {
        swiper.history.setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    },
    slideChange: function slideChange(swiper) {
      if (swiper.history.initialized && swiper.params.cssMode) {
        swiper.history.setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/keyboard/keyboard.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/keyboard/keyboard.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var Keyboard = {
  handle: function handle(event) {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    var rtl = swiper.rtlTranslate;
    var e = event;
    if (e.originalEvent) e = e.originalEvent; // jquery fix

    var kc = e.keyCode || e.charCode;
    var pageUpDown = swiper.params.keyboard.pageUpDown;
    var isPageUp = pageUpDown && kc === 33;
    var isPageDown = pageUpDown && kc === 34;
    var isArrowLeft = kc === 37;
    var isArrowRight = kc === 39;
    var isArrowUp = kc === 38;
    var isArrowDown = kc === 40; // Directions locks

    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }

    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }

    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return undefined;
    }

    if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
      return undefined;
    }

    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      var inView = false; // Check that swiper should be inside of visible area of window

      if (swiper.$el.parents("." + swiper.params.slideClass).length > 0 && swiper.$el.parents("." + swiper.params.slideActiveClass).length === 0) {
        return undefined;
      }

      var $el = swiper.$el;
      var swiperWidth = $el[0].clientWidth;
      var swiperHeight = $el[0].clientHeight;
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var swiperOffset = swiper.$el.offset();
      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
      var swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

      for (var i = 0; i < swiperCoord.length; i += 1) {
        var point = swiperCoord[i];

        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

          inView = true;
        }
      }

      if (!inView) return undefined;
    }

    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }

      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }

      if (isPageDown || isArrowDown) swiper.slideNext();
      if (isPageUp || isArrowUp) swiper.slidePrev();
    }

    swiper.emit('keyPress', kc);
    return undefined;
  },
  enable: function enable() {
    var swiper = this;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    if (swiper.keyboard.enabled) return;
    Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(document).on('keydown', swiper.keyboard.handle);
    swiper.keyboard.enabled = true;
  },
  disable: function disable() {
    var swiper = this;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    if (!swiper.keyboard.enabled) return;
    Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(document).off('keydown', swiper.keyboard.handle);
    swiper.keyboard.enabled = false;
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'keyboard',
  params: {
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["bindModuleMethods"])(swiper, {
      keyboard: _extends({
        enabled: false
      }, Keyboard)
    });
  },
  on: {
    init: function init(swiper) {
      if (swiper.params.keyboard.enabled) {
        swiper.keyboard.enable();
      }
    },
    destroy: function destroy(swiper) {
      if (swiper.keyboard.enabled) {
        swiper.keyboard.disable();
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/lazy/lazy.js":
/*!*********************************************************!*\
  !*** ./node_modules/swiper/esm/components/lazy/lazy.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var Lazy = {
  loadInSlide: function loadInSlide(index, loadInDuplicate) {
    if (loadInDuplicate === void 0) {
      loadInDuplicate = true;
    }

    var swiper = this;
    var params = swiper.params.lazy;
    if (typeof index === 'undefined') return;
    if (swiper.slides.length === 0) return;
    var isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    var $slideEl = isVirtual ? swiper.$wrapperEl.children("." + swiper.params.slideClass + "[data-swiper-slide-index=\"" + index + "\"]") : swiper.slides.eq(index);
    var $images = $slideEl.find("." + params.elementClass + ":not(." + params.loadedClass + "):not(." + params.loadingClass + ")");

    if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
      $images.push($slideEl[0]);
    }

    if ($images.length === 0) return;
    $images.each(function (imageEl) {
      var $imageEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(imageEl);
      $imageEl.addClass(params.loadingClass);
      var background = $imageEl.attr('data-background');
      var src = $imageEl.attr('data-src');
      var srcset = $imageEl.attr('data-srcset');
      var sizes = $imageEl.attr('data-sizes');
      var $pictureEl = $imageEl.parent('picture');
      swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, function () {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

        if (background) {
          $imageEl.css('background-image', "url(\"" + background + "\")");
          $imageEl.removeAttr('data-background');
        } else {
          if (srcset) {
            $imageEl.attr('srcset', srcset);
            $imageEl.removeAttr('data-srcset');
          }

          if (sizes) {
            $imageEl.attr('sizes', sizes);
            $imageEl.removeAttr('data-sizes');
          }

          if ($pictureEl.length) {
            $pictureEl.children('source').each(function (sourceEl) {
              var $source = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(sourceEl);

              if ($source.attr('data-srcset')) {
                $source.attr('srcset', $source.attr('data-srcset'));
                $source.removeAttr('data-srcset');
              }
            });
          }

          if (src) {
            $imageEl.attr('src', src);
            $imageEl.removeAttr('data-src');
          }
        }

        $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
        $slideEl.find("." + params.preloaderClass).remove();

        if (swiper.params.loop && loadInDuplicate) {
          var slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

          if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
            var originalSlide = swiper.$wrapperEl.children("[data-swiper-slide-index=\"" + slideOriginalIndex + "\"]:not(." + swiper.params.slideDuplicateClass + ")");
            swiper.lazy.loadInSlide(originalSlide.index(), false);
          } else {
            var duplicatedSlide = swiper.$wrapperEl.children("." + swiper.params.slideDuplicateClass + "[data-swiper-slide-index=\"" + slideOriginalIndex + "\"]");
            swiper.lazy.loadInSlide(duplicatedSlide.index(), false);
          }
        }

        swiper.emit('lazyImageReady', $slideEl[0], $imageEl[0]);

        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      });
      swiper.emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
    });
  },
  load: function load() {
    var swiper = this;
    var $wrapperEl = swiper.$wrapperEl,
        swiperParams = swiper.params,
        slides = swiper.slides,
        activeIndex = swiper.activeIndex;
    var isVirtual = swiper.virtual && swiperParams.virtual.enabled;
    var params = swiperParams.lazy;
    var slidesPerView = swiperParams.slidesPerView;

    if (slidesPerView === 'auto') {
      slidesPerView = 0;
    }

    function slideExist(index) {
      if (isVirtual) {
        if ($wrapperEl.children("." + swiperParams.slideClass + "[data-swiper-slide-index=\"" + index + "\"]").length) {
          return true;
        }
      } else if (slides[index]) return true;

      return false;
    }

    function slideIndex(slideEl) {
      if (isVirtual) {
        return Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(slideEl).attr('data-swiper-slide-index');
      }

      return Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(slideEl).index();
    }

    if (!swiper.lazy.initialImageLoaded) swiper.lazy.initialImageLoaded = true;

    if (swiper.params.watchSlidesVisibility) {
      $wrapperEl.children("." + swiperParams.slideVisibleClass).each(function (slideEl) {
        var index = isVirtual ? Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(slideEl).attr('data-swiper-slide-index') : Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(slideEl).index();
        swiper.lazy.loadInSlide(index);
      });
    } else if (slidesPerView > 1) {
      for (var i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
        if (slideExist(i)) swiper.lazy.loadInSlide(i);
      }
    } else {
      swiper.lazy.loadInSlide(activeIndex);
    }

    if (params.loadPrevNext) {
      if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
        var amount = params.loadPrevNextAmount;
        var spv = slidesPerView;
        var maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
        var minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

        for (var _i = activeIndex + slidesPerView; _i < maxIndex; _i += 1) {
          if (slideExist(_i)) swiper.lazy.loadInSlide(_i);
        } // Prev Slides


        for (var _i2 = minIndex; _i2 < activeIndex; _i2 += 1) {
          if (slideExist(_i2)) swiper.lazy.loadInSlide(_i2);
        }
      } else {
        var nextSlide = $wrapperEl.children("." + swiperParams.slideNextClass);
        if (nextSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(nextSlide));
        var prevSlide = $wrapperEl.children("." + swiperParams.slidePrevClass);
        if (prevSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(prevSlide));
      }
    }
  },
  checkInViewOnLoad: function checkInViewOnLoad() {
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var swiper = this;
    if (!swiper || swiper.destroyed) return;
    var $scrollElement = swiper.params.lazy.scrollingElement ? Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(swiper.params.lazy.scrollingElement) : Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(window);
    var isWindow = $scrollElement[0] === window;
    var scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
    var scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
    var swiperOffset = swiper.$el.offset();
    var rtl = swiper.rtlTranslate;
    var inView = false;
    if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
    var swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

    for (var i = 0; i < swiperCoord.length; i += 1) {
      var point = swiperCoord[i];

      if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
        if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

        inView = true;
      }
    }

    if (inView) {
      swiper.lazy.load();
      $scrollElement.off('scroll', swiper.lazy.checkInViewOnLoad);
    } else if (!swiper.lazy.scrollHandlerAttached) {
      swiper.lazy.scrollHandlerAttached = true;
      $scrollElement.on('scroll', swiper.lazy.checkInViewOnLoad);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'lazy',
  params: {
    lazy: {
      checkInView: false,
      enabled: false,
      loadPrevNext: false,
      loadPrevNextAmount: 1,
      loadOnTransitionStart: false,
      scrollingElement: '',
      elementClass: 'swiper-lazy',
      loadingClass: 'swiper-lazy-loading',
      loadedClass: 'swiper-lazy-loaded',
      preloaderClass: 'swiper-lazy-preloader'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["bindModuleMethods"])(swiper, {
      lazy: _extends({
        initialImageLoaded: false
      }, Lazy)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
        swiper.params.preloadImages = false;
      }
    },
    init: function init(swiper) {
      if (swiper.params.lazy.enabled && !swiper.params.loop && swiper.params.initialSlide === 0) {
        if (swiper.params.lazy.checkInView) {
          swiper.lazy.checkInViewOnLoad();
        } else {
          swiper.lazy.load();
        }
      }
    },
    scroll: function scroll(swiper) {
      if (swiper.params.freeMode && !swiper.params.freeModeSticky) {
        swiper.lazy.load();
      }
    },
    'scrollbarDragMove resize _freeModeNoMomentumRelease': function lazyLoad(swiper) {
      if (swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }
    },
    transitionStart: function transitionStart(swiper) {
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !swiper.lazy.initialImageLoaded) {
          swiper.lazy.load();
        }
      }
    },
    transitionEnd: function transitionEnd(swiper) {
      if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
        swiper.lazy.load();
      }
    },
    slideChange: function slideChange(swiper) {
      if (swiper.params.lazy.enabled && swiper.params.cssMode) {
        swiper.lazy.load();
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/mousewheel/mousewheel.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/mousewheel/mousewheel.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");




function isEventSupported() {
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  var eventName = 'onwheel';
  var isSupported = (eventName in document);

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && document.implementation && document.implementation.hasFeature && // always returns true in newer browsers as per the standard.
  // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
  document.implementation.hasFeature('', '') !== true) {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

var Mousewheel = {
  lastScrollTime: Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])(),
  lastEventBeforeSnap: undefined,
  recentWheelEvents: [],
  event: function event() {
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    if (window.navigator.userAgent.indexOf('firefox') > -1) return 'DOMMouseScroll';
    return isEventSupported() ? 'wheel' : 'mousewheel';
  },
  normalize: function normalize(e) {
    // Reasonable defaults
    var PIXEL_STEP = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;
    var sX = 0;
    var sY = 0; // spinX, spinY

    var pX = 0;
    var pY = 0; // pixelX, pixelY
    // Legacy

    if ('detail' in e) {
      sY = e.detail;
    }

    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }

    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }

    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    } // side scrolling on FF with DOMMouseScroll


    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in e) {
      pY = e.deltaY;
    }

    if ('deltaX' in e) {
      pX = e.deltaX;
    }

    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }

    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    } // Fall-back if spin cannot be determined


    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }

    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  },
  handleMouseEnter: function handleMouseEnter() {
    var swiper = this;
    swiper.mouseEntered = true;
  },
  handleMouseLeave: function handleMouseLeave() {
    var swiper = this;
    swiper.mouseEntered = false;
  },
  handle: function handle(event) {
    var e = event;
    var disableParentSwiper = true;
    var swiper = this;
    var params = swiper.params.mousewheel;

    if (swiper.params.cssMode) {
      e.preventDefault();
    }

    var target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(swiper.params.mousewheel.eventsTarget);
    }

    if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
    if (e.originalEvent) e = e.originalEvent; // jquery fix

    var delta = 0;
    var rtlFactor = swiper.rtlTranslate ? -1 : 1;
    var data = Mousewheel.normalize(e);

    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }

    if (delta === 0) return true;
    if (params.invert) delta = -delta; // Get the scroll positions

    var positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
    //     the disableParentSwiper will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentSwiper will be true.
    //     if the scroll on edge positions,
    //     then the disableParentSwiper will be false.

    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

    if (!swiper.params.freeMode) {
      // Register the new event in a variable which stores the relevant data
      var newEvent = {
        time: Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event
      }; // Keep the most recent events

      var recentWheelEvents = swiper.mousewheel.recentWheelEvents;

      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }

      var prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
      recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.

      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          swiper.mousewheel.animateSlider(newEvent);
        }
      } else {
        swiper.mousewheel.animateSlider(newEvent);
      } // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.


      if (swiper.mousewheel.releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:
      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      var _newEvent = {
        time: Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      var lastEventBeforeSnap = swiper.mousewheel.lastEventBeforeSnap;
      var ignoreWheelEvents = lastEventBeforeSnap && _newEvent.time < lastEventBeforeSnap.time + 500 && _newEvent.delta <= lastEventBeforeSnap.delta && _newEvent.direction === lastEventBeforeSnap.direction;

      if (!ignoreWheelEvents) {
        swiper.mousewheel.lastEventBeforeSnap = undefined;

        if (swiper.params.loop) {
          swiper.loopFix();
        }

        var position = swiper.getTranslate() + delta * params.sensitivity;
        var wasBeginning = swiper.isBeginning;
        var wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();

        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }

        if (swiper.params.freeModeSticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(swiper.mousewheel.timeout);
          swiper.mousewheel.timeout = undefined;
          var _recentWheelEvents = swiper.mousewheel.recentWheelEvents;

          if (_recentWheelEvents.length >= 15) {
            _recentWheelEvents.shift(); // only store the last N events

          }

          var _prevEvent = _recentWheelEvents.length ? _recentWheelEvents[_recentWheelEvents.length - 1] : undefined;

          var firstEvent = _recentWheelEvents[0];

          _recentWheelEvents.push(_newEvent);

          if (_prevEvent && (_newEvent.delta > _prevEvent.delta || _newEvent.direction !== _prevEvent.direction)) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            _recentWheelEvents.splice(0);
          } else if (_recentWheelEvents.length >= 15 && _newEvent.time - firstEvent.time < 500 && firstEvent.delta - _newEvent.delta >= 1 && _newEvent.delta <= 6) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            var snapToThreshold = delta > 0 ? 0.8 : 0.2;
            swiper.mousewheel.lastEventBeforeSnap = _newEvent;

            _recentWheelEvents.splice(0);

            swiper.mousewheel.timeout = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["nextTick"])(function () {
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }

          if (!swiper.mousewheel.timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            swiper.mousewheel.timeout = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["nextTick"])(function () {
              var snapToThreshold = 0.5;
              swiper.mousewheel.lastEventBeforeSnap = _newEvent;

              _recentWheelEvents.splice(0);

              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        } // Emit event


        if (!ignoreWheelEvents) swiper.emit('scroll', e); // Stop autoplay

        if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

        if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
      }
    }

    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  },
  animateSlider: function animateSlider(newEvent) {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

    if (this.params.mousewheel.thresholdDelta && newEvent.delta < this.params.mousewheel.thresholdDelta) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }

    if (this.params.mousewheel.thresholdTime && Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])() - swiper.mousewheel.lastScrollTime < this.params.mousewheel.thresholdTime) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    } // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).


    if (newEvent.delta >= 6 && Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])() - swiper.mousewheel.lastScrollTime < 60) {
      // Return false as a default
      return true;
    } // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.


    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        swiper.emit('scroll', newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      swiper.emit('scroll', newEvent.raw);
    } // If you got here is because an animation has been triggered so store the current time


    swiper.mousewheel.lastScrollTime = new window.Date().getTime(); // Return false as a default

    return false;
  },
  releaseScroll: function releaseScroll(newEvent) {
    var swiper = this;
    var params = swiper.params.mousewheel;

    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }

    return false;
  },
  enable: function enable() {
    var swiper = this;
    var event = Mousewheel.event();

    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener(event, swiper.mousewheel.handle);
      return true;
    }

    if (!event) return false;
    if (swiper.mousewheel.enabled) return false;
    var target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(swiper.params.mousewheel.eventsTarget);
    }

    target.on('mouseenter', swiper.mousewheel.handleMouseEnter);
    target.on('mouseleave', swiper.mousewheel.handleMouseLeave);
    target.on(event, swiper.mousewheel.handle);
    swiper.mousewheel.enabled = true;
    return true;
  },
  disable: function disable() {
    var swiper = this;
    var event = Mousewheel.event();

    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, swiper.mousewheel.handle);
      return true;
    }

    if (!event) return false;
    if (!swiper.mousewheel.enabled) return false;
    var target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(swiper.params.mousewheel.eventsTarget);
    }

    target.off(event, swiper.mousewheel.handle);
    swiper.mousewheel.enabled = false;
    return true;
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'mousewheel',
  params: {
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["bindModuleMethods"])(swiper, {
      mousewheel: {
        enabled: false,
        lastScrollTime: Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["now"])(),
        lastEventBeforeSnap: undefined,
        recentWheelEvents: [],
        enable: Mousewheel.enable,
        disable: Mousewheel.disable,
        handle: Mousewheel.handle,
        handleMouseEnter: Mousewheel.handleMouseEnter,
        handleMouseLeave: Mousewheel.handleMouseLeave,
        animateSlider: Mousewheel.animateSlider,
        releaseScroll: Mousewheel.releaseScroll
      }
    });
  },
  on: {
    init: function init(swiper) {
      if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
        swiper.mousewheel.disable();
      }

      if (swiper.params.mousewheel.enabled) swiper.mousewheel.enable();
    },
    destroy: function destroy(swiper) {
      if (swiper.params.cssMode) {
        swiper.mousewheel.enable();
      }

      if (swiper.mousewheel.enabled) swiper.mousewheel.disable();
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/navigation/navigation.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/navigation/navigation.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Navigation = {
  toggleEl: function toggleEl($el, disabled) {
    $el[disabled ? 'addClass' : 'removeClass'](this.params.navigation.disabledClass);
    if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;
  },
  update: function update() {
    // Update Navigation Buttons
    var swiper = this;
    var params = swiper.params.navigation;
    var toggleEl = swiper.navigation.toggleEl;
    if (swiper.params.loop) return;
    var _swiper$navigation = swiper.navigation,
        $nextEl = _swiper$navigation.$nextEl,
        $prevEl = _swiper$navigation.$prevEl;

    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        toggleEl($prevEl, true);
      } else {
        toggleEl($prevEl, false);
      }

      $prevEl[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }

    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        toggleEl($nextEl, true);
      } else {
        toggleEl($nextEl, false);
      }

      $nextEl[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }
  },
  onPrevClick: function onPrevClick(e) {
    var swiper = this;
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop) return;
    swiper.slidePrev();
  },
  onNextClick: function onNextClick(e) {
    var swiper = this;
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop) return;
    swiper.slideNext();
  },
  init: function init() {
    var swiper = this;
    var params = swiper.params.navigation;
    if (!(params.nextEl || params.prevEl)) return;
    var $nextEl;
    var $prevEl;

    if (params.nextEl) {
      $nextEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(params.nextEl);

      if (swiper.params.uniqueNavElements && typeof params.nextEl === 'string' && $nextEl.length > 1 && swiper.$el.find(params.nextEl).length === 1) {
        $nextEl = swiper.$el.find(params.nextEl);
      }
    }

    if (params.prevEl) {
      $prevEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(params.prevEl);

      if (swiper.params.uniqueNavElements && typeof params.prevEl === 'string' && $prevEl.length > 1 && swiper.$el.find(params.prevEl).length === 1) {
        $prevEl = swiper.$el.find(params.prevEl);
      }
    }

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', swiper.navigation.onNextClick);
    }

    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', swiper.navigation.onPrevClick);
    }

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.navigation, {
      $nextEl: $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl: $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });
  },
  destroy: function destroy() {
    var swiper = this;
    var _swiper$navigation2 = swiper.navigation,
        $nextEl = _swiper$navigation2.$nextEl,
        $prevEl = _swiper$navigation2.$prevEl;

    if ($nextEl && $nextEl.length) {
      $nextEl.off('click', swiper.navigation.onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }

    if ($prevEl && $prevEl.length) {
      $prevEl.off('click', swiper.navigation.onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'navigation',
  params: {
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      navigation: _extends({}, Navigation)
    });
  },
  on: {
    init: function init(swiper) {
      swiper.navigation.init();
      swiper.navigation.update();
    },
    toEdge: function toEdge(swiper) {
      swiper.navigation.update();
    },
    fromEdge: function fromEdge(swiper) {
      swiper.navigation.update();
    },
    destroy: function destroy(swiper) {
      swiper.navigation.destroy();
    },
    click: function click(swiper, e) {
      var _swiper$navigation3 = swiper.navigation,
          $nextEl = _swiper$navigation3.$nextEl,
          $prevEl = _swiper$navigation3.$prevEl;
      var targetEl = e.target;

      if (swiper.params.navigation.hideOnClick && !Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(targetEl).is($prevEl) && !Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(targetEl).is($nextEl)) {
        if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
        var isHidden;

        if ($nextEl) {
          isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
        } else if ($prevEl) {
          isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
        }

        if (isHidden === true) {
          swiper.emit('navigationShow');
        } else {
          swiper.emit('navigationHide');
        }

        if ($nextEl) {
          $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
        }

        if ($prevEl) {
          $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
        }
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/pagination/pagination.js":
/*!*********************************************************************!*\
  !*** ./node_modules/swiper/esm/components/pagination/pagination.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Pagination = {
  update: function update() {
    // Render || Update Pagination bullets/items
    var swiper = this;
    var rtl = swiper.rtl;
    var params = swiper.params.pagination;
    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
    var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    var $el = swiper.pagination.$el; // Current/Total

    var current;
    var total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

    if (swiper.params.loop) {
      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

      if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
        current -= slidesLength - swiper.loopedSlides * 2;
      }

      if (current > total - 1) current -= total;
      if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
    } else {
      current = swiper.activeIndex || 0;
    } // Types


    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      var bullets = swiper.pagination.bullets;
      var firstIndex;
      var lastIndex;
      var midIndex;

      if (params.dynamicBullets) {
        swiper.pagination.bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
        $el.css(swiper.isHorizontal() ? 'width' : 'height', swiper.pagination.bulletSize * (params.dynamicMainBullets + 4) + "px");

        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
          swiper.pagination.dynamicBulletIndex += current - swiper.previousIndex;

          if (swiper.pagination.dynamicBulletIndex > params.dynamicMainBullets - 1) {
            swiper.pagination.dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (swiper.pagination.dynamicBulletIndex < 0) {
            swiper.pagination.dynamicBulletIndex = 0;
          }
        }

        firstIndex = current - swiper.pagination.dynamicBulletIndex;
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }

      bullets.removeClass(params.bulletActiveClass + " " + params.bulletActiveClass + "-next " + params.bulletActiveClass + "-next-next " + params.bulletActiveClass + "-prev " + params.bulletActiveClass + "-prev-prev " + params.bulletActiveClass + "-main");

      if ($el.length > 1) {
        bullets.each(function (bullet) {
          var $bullet = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(bullet);
          var bulletIndex = $bullet.index();

          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }

          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(params.bulletActiveClass + "-main");
            }

            if (bulletIndex === firstIndex) {
              $bullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
            }

            if (bulletIndex === lastIndex) {
              $bullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
            }
          }
        });
      } else {
        var $bullet = bullets.eq(current);
        var bulletIndex = $bullet.index();
        $bullet.addClass(params.bulletActiveClass);

        if (params.dynamicBullets) {
          var $firstDisplayedBullet = bullets.eq(firstIndex);
          var $lastDisplayedBullet = bullets.eq(lastIndex);

          for (var i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(params.bulletActiveClass + "-main");
          }

          if (swiper.params.loop) {
            if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
              for (var _i = params.dynamicMainBullets; _i >= 0; _i -= 1) {
                bullets.eq(bullets.length - _i).addClass(params.bulletActiveClass + "-main");
              }

              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(params.bulletActiveClass + "-prev");
            } else {
              $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
              $lastDisplayedBullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
            }
          } else {
            $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
            $lastDisplayedBullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
          }
        }
      }

      if (params.dynamicBullets) {
        var dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        var bulletsOffset = (swiper.pagination.bulletSize * dynamicBulletsLength - swiper.pagination.bulletSize) / 2 - midIndex * swiper.pagination.bulletSize;
        var offsetProp = rtl ? 'right' : 'left';
        bullets.css(swiper.isHorizontal() ? offsetProp : 'top', bulletsOffset + "px");
      }
    }

    if (params.type === 'fraction') {
      $el.find(Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(params.currentClass)).text(params.formatFractionCurrent(current + 1));
      $el.find(Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(params.totalClass)).text(params.formatFractionTotal(total));
    }

    if (params.type === 'progressbar') {
      var progressbarDirection;

      if (params.progressbarOpposite) {
        progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
      } else {
        progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
      }

      var scale = (current + 1) / total;
      var scaleX = 1;
      var scaleY = 1;

      if (progressbarDirection === 'horizontal') {
        scaleX = scale;
      } else {
        scaleY = scale;
      }

      $el.find(Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(params.progressbarFillClass)).transform("translate3d(0,0,0) scaleX(" + scaleX + ") scaleY(" + scaleY + ")").transition(swiper.params.speed);
    }

    if (params.type === 'custom' && params.renderCustom) {
      $el.html(params.renderCustom(swiper, current + 1, total));
      swiper.emit('paginationRender', $el[0]);
    } else {
      swiper.emit('paginationUpdate', $el[0]);
    }

    $el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
  },
  render: function render() {
    // Render Container
    var swiper = this;
    var params = swiper.params.pagination;
    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
    var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    var $el = swiper.pagination.$el;
    var paginationHTML = '';

    if (params.type === 'bullets') {
      var numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

      if (swiper.params.freeMode && !swiper.params.loop && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }

      for (var i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          paginationHTML += "<" + params.bulletElement + " class=\"" + params.bulletClass + "\"></" + params.bulletElement + ">";
        }
      }

      $el.html(paginationHTML);
      swiper.pagination.bullets = $el.find(Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(params.bulletClass));
    }

    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = "<span class=\"" + params.currentClass + "\"></span>" + ' / ' + ("<span class=\"" + params.totalClass + "\"></span>");
      }

      $el.html(paginationHTML);
    }

    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = "<span class=\"" + params.progressbarFillClass + "\"></span>";
      }

      $el.html(paginationHTML);
    }

    if (params.type !== 'custom') {
      swiper.emit('paginationRender', swiper.pagination.$el[0]);
    }
  },
  init: function init() {
    var swiper = this;
    var params = swiper.params.pagination;
    if (!params.el) return;
    var $el = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(params.el);
    if ($el.length === 0) return;

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
      $el = swiper.$el.find(params.el);
    }

    if (params.type === 'bullets' && params.clickable) {
      $el.addClass(params.clickableClass);
    }

    $el.addClass(params.modifierClass + params.type);

    if (params.type === 'bullets' && params.dynamicBullets) {
      $el.addClass("" + params.modifierClass + params.type + "-dynamic");
      swiper.pagination.dynamicBulletIndex = 0;

      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }

    if (params.type === 'progressbar' && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }

    if (params.clickable) {
      $el.on('click', Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(params.bulletClass), function onClick(e) {
        e.preventDefault();
        var index = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(this).index() * swiper.params.slidesPerGroup;
        if (swiper.params.loop) index += swiper.loopedSlides;
        swiper.slideTo(index);
      });
    }

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.pagination, {
      $el: $el,
      el: $el[0]
    });
  },
  destroy: function destroy() {
    var swiper = this;
    var params = swiper.params.pagination;
    if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
    var $el = swiper.pagination.$el;
    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    if (swiper.pagination.bullets) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

    if (params.clickable) {
      $el.off('click', Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["classesToSelector"])(params.bulletClass));
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'pagination',
  params: {
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets',
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: function formatFractionCurrent(number) {
        return number;
      },
      formatFractionTotal: function formatFractionTotal(number) {
        return number;
      },
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active',
      modifierClass: 'swiper-pagination-',
      // NEW
      currentClass: 'swiper-pagination-current',
      totalClass: 'swiper-pagination-total',
      hiddenClass: 'swiper-pagination-hidden',
      progressbarFillClass: 'swiper-pagination-progressbar-fill',
      progressbarOppositeClass: 'swiper-pagination-progressbar-opposite',
      clickableClass: 'swiper-pagination-clickable',
      // NEW
      lockClass: 'swiper-pagination-lock'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      pagination: _extends({
        dynamicBulletIndex: 0
      }, Pagination)
    });
  },
  on: {
    init: function init(swiper) {
      swiper.pagination.init();
      swiper.pagination.render();
      swiper.pagination.update();
    },
    activeIndexChange: function activeIndexChange(swiper) {
      if (swiper.params.loop) {
        swiper.pagination.update();
      } else if (typeof swiper.snapIndex === 'undefined') {
        swiper.pagination.update();
      }
    },
    snapIndexChange: function snapIndexChange(swiper) {
      if (!swiper.params.loop) {
        swiper.pagination.update();
      }
    },
    slidesLengthChange: function slidesLengthChange(swiper) {
      if (swiper.params.loop) {
        swiper.pagination.render();
        swiper.pagination.update();
      }
    },
    snapGridLengthChange: function snapGridLengthChange(swiper) {
      if (!swiper.params.loop) {
        swiper.pagination.render();
        swiper.pagination.update();
      }
    },
    destroy: function destroy(swiper) {
      swiper.pagination.destroy();
    },
    click: function click(swiper, e) {
      var targetEl = e.target;

      if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && swiper.pagination.$el.length > 0 && !Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
        if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
        var isHidden = swiper.pagination.$el.hasClass(swiper.params.pagination.hiddenClass);

        if (isHidden === true) {
          swiper.emit('paginationShow');
        } else {
          swiper.emit('paginationHide');
        }

        swiper.pagination.$el.toggleClass(swiper.params.pagination.hiddenClass);
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/parallax/parallax.js":
/*!*****************************************************************!*\
  !*** ./node_modules/swiper/esm/components/parallax/parallax.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Parallax = {
  setTransform: function setTransform(el, progress) {
    var swiper = this;
    var rtl = swiper.rtl;
    var $el = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(el);
    var rtlFactor = rtl ? -1 : 1;
    var p = $el.attr('data-swiper-parallax') || '0';
    var x = $el.attr('data-swiper-parallax-x');
    var y = $el.attr('data-swiper-parallax-y');
    var scale = $el.attr('data-swiper-parallax-scale');
    var opacity = $el.attr('data-swiper-parallax-opacity');

    if (x || y) {
      x = x || '0';
      y = y || '0';
    } else if (swiper.isHorizontal()) {
      x = p;
      y = '0';
    } else {
      y = p;
      x = '0';
    }

    if (x.indexOf('%') >= 0) {
      x = parseInt(x, 10) * progress * rtlFactor + "%";
    } else {
      x = x * progress * rtlFactor + "px";
    }

    if (y.indexOf('%') >= 0) {
      y = parseInt(y, 10) * progress + "%";
    } else {
      y = y * progress + "px";
    }

    if (typeof opacity !== 'undefined' && opacity !== null) {
      var currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      $el[0].style.opacity = currentOpacity;
    }

    if (typeof scale === 'undefined' || scale === null) {
      $el.transform("translate3d(" + x + ", " + y + ", 0px)");
    } else {
      var currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      $el.transform("translate3d(" + x + ", " + y + ", 0px) scale(" + currentScale + ")");
    }
  },
  setTranslate: function setTranslate() {
    var swiper = this;
    var $el = swiper.$el,
        slides = swiper.slides,
        progress = swiper.progress,
        snapGrid = swiper.snapGrid;
    $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(function (el) {
      swiper.parallax.setTransform(el, progress);
    });
    slides.each(function (slideEl, slideIndex) {
      var slideProgress = slideEl.progress;

      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }

      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(function (el) {
        swiper.parallax.setTransform(el, slideProgress);
      });
    });
  },
  setTransition: function setTransition(duration) {
    if (duration === void 0) {
      duration = this.params.speed;
    }

    var swiper = this;
    var $el = swiper.$el;
    $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(function (parallaxEl) {
      var $parallaxEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(parallaxEl);
      var parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      $parallaxEl.transition(parallaxDuration);
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'parallax',
  params: {
    parallax: {
      enabled: false
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      parallax: _extends({}, Parallax)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (!swiper.params.parallax.enabled) return;
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    init: function init(swiper) {
      if (!swiper.params.parallax.enabled) return;
      swiper.parallax.setTranslate();
    },
    setTranslate: function setTranslate(swiper) {
      if (!swiper.params.parallax.enabled) return;
      swiper.parallax.setTranslate();
    },
    setTransition: function setTransition(swiper, duration) {
      if (!swiper.params.parallax.enabled) return;
      swiper.parallax.setTransition(duration);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/scrollbar/scrollbar.js":
/*!*******************************************************************!*\
  !*** ./node_modules/swiper/esm/components/scrollbar/scrollbar.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var Scrollbar = {
  setTranslate: function setTranslate() {
    var swiper = this;
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    var scrollbar = swiper.scrollbar,
        rtl = swiper.rtlTranslate,
        progress = swiper.progress;
    var dragSize = scrollbar.dragSize,
        trackSize = scrollbar.trackSize,
        $dragEl = scrollbar.$dragEl,
        $el = scrollbar.$el;
    var params = swiper.params.scrollbar;
    var newSize = dragSize;
    var newPos = (trackSize - dragSize) * progress;

    if (rtl) {
      newPos = -newPos;

      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }

    if (swiper.isHorizontal()) {
      $dragEl.transform("translate3d(" + newPos + "px, 0, 0)");
      $dragEl[0].style.width = newSize + "px";
    } else {
      $dragEl.transform("translate3d(0px, " + newPos + "px, 0)");
      $dragEl[0].style.height = newSize + "px";
    }

    if (params.hide) {
      clearTimeout(swiper.scrollbar.timeout);
      $el[0].style.opacity = 1;
      swiper.scrollbar.timeout = setTimeout(function () {
        $el[0].style.opacity = 0;
        $el.transition(400);
      }, 1000);
    }
  },
  setTransition: function setTransition(duration) {
    var swiper = this;
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.$dragEl.transition(duration);
  },
  updateSize: function updateSize() {
    var swiper = this;
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    var scrollbar = swiper.scrollbar;
    var $dragEl = scrollbar.$dragEl,
        $el = scrollbar.$el;
    $dragEl[0].style.width = '';
    $dragEl[0].style.height = '';
    var trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
    var divider = swiper.size / swiper.virtualSize;
    var moveDivider = divider * (trackSize / swiper.size);
    var dragSize;

    if (swiper.params.scrollbar.dragSize === 'auto') {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }

    if (swiper.isHorizontal()) {
      $dragEl[0].style.width = dragSize + "px";
    } else {
      $dragEl[0].style.height = dragSize + "px";
    }

    if (divider >= 1) {
      $el[0].style.display = 'none';
    } else {
      $el[0].style.display = '';
    }

    if (swiper.params.scrollbar.hide) {
      $el[0].style.opacity = 0;
    }

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["extend"])(scrollbar, {
      trackSize: trackSize,
      divider: divider,
      moveDivider: moveDivider,
      dragSize: dragSize
    });
    scrollbar.$el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
  },
  getPointerPosition: function getPointerPosition(e) {
    var swiper = this;

    if (swiper.isHorizontal()) {
      return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
    }

    return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
  },
  setDragPosition: function setDragPosition(e) {
    var swiper = this;
    var scrollbar = swiper.scrollbar,
        rtl = swiper.rtlTranslate;
    var $el = scrollbar.$el,
        dragSize = scrollbar.dragSize,
        trackSize = scrollbar.trackSize,
        dragStartPos = scrollbar.dragStartPos;
    var positionRatio;
    positionRatio = (scrollbar.getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);

    if (rtl) {
      positionRatio = 1 - positionRatio;
    }

    var position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  },
  onDragStart: function onDragStart(e) {
    var swiper = this;
    var params = swiper.params.scrollbar;
    var scrollbar = swiper.scrollbar,
        $wrapperEl = swiper.$wrapperEl;
    var $el = scrollbar.$el,
        $dragEl = scrollbar.$dragEl;
    swiper.scrollbar.isTouched = true;
    swiper.scrollbar.dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? scrollbar.getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
    e.preventDefault();
    e.stopPropagation();
    $wrapperEl.transition(100);
    $dragEl.transition(100);
    scrollbar.setDragPosition(e);
    clearTimeout(swiper.scrollbar.dragTimeout);
    $el.transition(0);

    if (params.hide) {
      $el.css('opacity', 1);
    }

    if (swiper.params.cssMode) {
      swiper.$wrapperEl.css('scroll-snap-type', 'none');
    }

    swiper.emit('scrollbarDragStart', e);
  },
  onDragMove: function onDragMove(e) {
    var swiper = this;
    var scrollbar = swiper.scrollbar,
        $wrapperEl = swiper.$wrapperEl;
    var $el = scrollbar.$el,
        $dragEl = scrollbar.$dragEl;
    if (!swiper.scrollbar.isTouched) return;
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    scrollbar.setDragPosition(e);
    $wrapperEl.transition(0);
    $el.transition(0);
    $dragEl.transition(0);
    swiper.emit('scrollbarDragMove', e);
  },
  onDragEnd: function onDragEnd(e) {
    var swiper = this;
    var params = swiper.params.scrollbar;
    var scrollbar = swiper.scrollbar,
        $wrapperEl = swiper.$wrapperEl;
    var $el = scrollbar.$el;
    if (!swiper.scrollbar.isTouched) return;
    swiper.scrollbar.isTouched = false;

    if (swiper.params.cssMode) {
      swiper.$wrapperEl.css('scroll-snap-type', '');
      $wrapperEl.transition('');
    }

    if (params.hide) {
      clearTimeout(swiper.scrollbar.dragTimeout);
      swiper.scrollbar.dragTimeout = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["nextTick"])(function () {
        $el.css('opacity', 0);
        $el.transition(400);
      }, 1000);
    }

    swiper.emit('scrollbarDragEnd', e);

    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  },
  enableDraggable: function enableDraggable() {
    var swiper = this;
    if (!swiper.params.scrollbar.el) return;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    var scrollbar = swiper.scrollbar,
        touchEventsTouch = swiper.touchEventsTouch,
        touchEventsDesktop = swiper.touchEventsDesktop,
        params = swiper.params,
        support = swiper.support;
    var $el = scrollbar.$el;
    var target = $el[0];
    var activeListener = support.passiveListener && params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    var passiveListener = support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;

    if (!support.touch) {
      target.addEventListener(touchEventsDesktop.start, swiper.scrollbar.onDragStart, activeListener);
      document.addEventListener(touchEventsDesktop.move, swiper.scrollbar.onDragMove, activeListener);
      document.addEventListener(touchEventsDesktop.end, swiper.scrollbar.onDragEnd, passiveListener);
    } else {
      target.addEventListener(touchEventsTouch.start, swiper.scrollbar.onDragStart, activeListener);
      target.addEventListener(touchEventsTouch.move, swiper.scrollbar.onDragMove, activeListener);
      target.addEventListener(touchEventsTouch.end, swiper.scrollbar.onDragEnd, passiveListener);
    }
  },
  disableDraggable: function disableDraggable() {
    var swiper = this;
    if (!swiper.params.scrollbar.el) return;
    var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
    var scrollbar = swiper.scrollbar,
        touchEventsTouch = swiper.touchEventsTouch,
        touchEventsDesktop = swiper.touchEventsDesktop,
        params = swiper.params,
        support = swiper.support;
    var $el = scrollbar.$el;
    var target = $el[0];
    var activeListener = support.passiveListener && params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    var passiveListener = support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;

    if (!support.touch) {
      target.removeEventListener(touchEventsDesktop.start, swiper.scrollbar.onDragStart, activeListener);
      document.removeEventListener(touchEventsDesktop.move, swiper.scrollbar.onDragMove, activeListener);
      document.removeEventListener(touchEventsDesktop.end, swiper.scrollbar.onDragEnd, passiveListener);
    } else {
      target.removeEventListener(touchEventsTouch.start, swiper.scrollbar.onDragStart, activeListener);
      target.removeEventListener(touchEventsTouch.move, swiper.scrollbar.onDragMove, activeListener);
      target.removeEventListener(touchEventsTouch.end, swiper.scrollbar.onDragEnd, passiveListener);
    }
  },
  init: function init() {
    var swiper = this;
    if (!swiper.params.scrollbar.el) return;
    var scrollbar = swiper.scrollbar,
        $swiperEl = swiper.$el;
    var params = swiper.params.scrollbar;
    var $el = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(params.el);

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
      $el = $swiperEl.find(params.el);
    }

    var $dragEl = $el.find("." + swiper.params.scrollbar.dragClass);

    if ($dragEl.length === 0) {
      $dragEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])("<div class=\"" + swiper.params.scrollbar.dragClass + "\"></div>");
      $el.append($dragEl);
    }

    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["extend"])(scrollbar, {
      $el: $el,
      el: $el[0],
      $dragEl: $dragEl,
      dragEl: $dragEl[0]
    });

    if (params.draggable) {
      scrollbar.enableDraggable();
    }
  },
  destroy: function destroy() {
    var swiper = this;
    swiper.scrollbar.disableDraggable();
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'scrollbar',
  params: {
    scrollbar: {
      el: null,
      dragSize: 'auto',
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: 'swiper-scrollbar-lock',
      dragClass: 'swiper-scrollbar-drag'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["bindModuleMethods"])(swiper, {
      scrollbar: _extends({
        isTouched: false,
        timeout: null,
        dragTimeout: null
      }, Scrollbar)
    });
  },
  on: {
    init: function init(swiper) {
      swiper.scrollbar.init();
      swiper.scrollbar.updateSize();
      swiper.scrollbar.setTranslate();
    },
    update: function update(swiper) {
      swiper.scrollbar.updateSize();
    },
    resize: function resize(swiper) {
      swiper.scrollbar.updateSize();
    },
    observerUpdate: function observerUpdate(swiper) {
      swiper.scrollbar.updateSize();
    },
    setTranslate: function setTranslate(swiper) {
      swiper.scrollbar.setTranslate();
    },
    setTransition: function setTransition(swiper, duration) {
      swiper.scrollbar.setTransition(duration);
    },
    destroy: function destroy(swiper) {
      swiper.scrollbar.destroy();
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/thumbs/thumbs.js":
/*!*************************************************************!*\
  !*** ./node_modules/swiper/esm/components/thumbs/thumbs.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Thumbs = {
  init: function init() {
    var swiper = this;
    var thumbsParams = swiper.params.thumbs;
    if (swiper.thumbs.initialized) return false;
    swiper.thumbs.initialized = true;
    var SwiperClass = swiper.constructor;

    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
    } else if (Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["isObject"])(thumbsParams.swiper)) {
      swiper.thumbs.swiper = new SwiperClass(Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["extend"])({}, thumbsParams.swiper, {
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slideToClickedSlide: false
      }));
      swiper.thumbs.swiperCreated = true;
    }

    swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on('tap', swiper.thumbs.onThumbClick);
    return true;
  },
  onThumbClick: function onThumbClick() {
    var swiper = this;
    var thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper) return;
    var clickedIndex = thumbsSwiper.clickedIndex;
    var clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
    var slideToIndex;

    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
    } else {
      slideToIndex = clickedIndex;
    }

    if (swiper.params.loop) {
      var currentIndex = swiper.activeIndex;

      if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        currentIndex = swiper.activeIndex;
      }

      var prevIndex = swiper.slides.eq(currentIndex).prevAll("[data-swiper-slide-index=\"" + slideToIndex + "\"]").eq(0).index();
      var nextIndex = swiper.slides.eq(currentIndex).nextAll("[data-swiper-slide-index=\"" + slideToIndex + "\"]").eq(0).index();
      if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
    }

    swiper.slideTo(slideToIndex);
  },
  update: function update(initial) {
    var swiper = this;
    var thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper) return;
    var slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
    var autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    var useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      var currentThumbsIndex = thumbsSwiper.activeIndex;
      var newThumbsIndex;
      var direction;

      if (thumbsSwiper.params.loop) {
        if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
          thumbsSwiper.loopFix(); // eslint-disable-next-line

          thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
          currentThumbsIndex = thumbsSwiper.activeIndex;
        } // Find actual thumbs index to slide to


        var prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll("[data-swiper-slide-index=\"" + swiper.realIndex + "\"]").eq(0).index();
        var nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll("[data-swiper-slide-index=\"" + swiper.realIndex + "\"]").eq(0).index();
        if (typeof prevThumbsIndex === 'undefined') newThumbsIndex = nextThumbsIndex;else if (typeof nextThumbsIndex === 'undefined') newThumbsIndex = prevThumbsIndex;else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) newThumbsIndex = currentThumbsIndex;else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) newThumbsIndex = nextThumbsIndex;else newThumbsIndex = prevThumbsIndex;
        direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
      }

      if (useOffset) {
        newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
      }

      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex) {
          newThumbsIndex = newThumbsIndex - slidesPerView + 1;
        }

        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
      }
    } // Activate thumbs


    var thumbsToActivate = 1;
    var thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }

    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }

    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.removeClass(thumbActiveClass);

    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (var i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.$wrapperEl.children("[data-swiper-slide-index=\"" + (swiper.realIndex + i) + "\"]").addClass(thumbActiveClass);
      }
    } else {
      for (var _i = 0; _i < thumbsToActivate; _i += 1) {
        thumbsSwiper.slides.eq(swiper.realIndex + _i).addClass(thumbActiveClass);
      }
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'thumbs',
  params: {
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: 'swiper-slide-thumb-active',
      thumbsContainerClass: 'swiper-container-thumbs'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["bindModuleMethods"])(swiper, {
      thumbs: _extends({
        swiper: null,
        initialized: false
      }, Thumbs)
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      var thumbs = swiper.params.thumbs;
      if (!thumbs || !thumbs.swiper) return;
      swiper.thumbs.init();
      swiper.thumbs.update(true);
    },
    slideChange: function slideChange(swiper) {
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    update: function update(swiper) {
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    resize: function resize(swiper) {
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    observerUpdate: function observerUpdate(swiper) {
      if (!swiper.thumbs.swiper) return;
      swiper.thumbs.update();
    },
    setTransition: function setTransition(swiper, duration) {
      var thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      thumbsSwiper.setTransition(duration);
    },
    beforeDestroy: function beforeDestroy(swiper) {
      var thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;

      if (swiper.thumbs.swiperCreated && thumbsSwiper) {
        thumbsSwiper.destroy();
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/virtual/virtual.js":
/*!***************************************************************!*\
  !*** ./node_modules/swiper/esm/components/virtual/virtual.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Virtual = {
  update: function update(force) {
    var swiper = this;
    var _swiper$params = swiper.params,
        slidesPerView = _swiper$params.slidesPerView,
        slidesPerGroup = _swiper$params.slidesPerGroup,
        centeredSlides = _swiper$params.centeredSlides;
    var _swiper$params$virtua = swiper.params.virtual,
        addSlidesBefore = _swiper$params$virtua.addSlidesBefore,
        addSlidesAfter = _swiper$params$virtua.addSlidesAfter;
    var _swiper$virtual = swiper.virtual,
        previousFrom = _swiper$virtual.from,
        previousTo = _swiper$virtual.to,
        slides = _swiper$virtual.slides,
        previousSlidesGrid = _swiper$virtual.slidesGrid,
        renderSlide = _swiper$virtual.renderSlide,
        previousOffset = _swiper$virtual.offset;
    swiper.updateActiveIndex();
    var activeIndex = swiper.activeIndex || 0;
    var offsetProp;
    if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
    var slidesAfter;
    var slidesBefore;

    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
      slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
    } else {
      slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
      slidesBefore = slidesPerGroup + addSlidesBefore;
    }

    var from = Math.max((activeIndex || 0) - slidesBefore, 0);
    var to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
    var offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.virtual, {
      from: from,
      to: to,
      offset: offset,
      slidesGrid: swiper.slidesGrid
    });

    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      if (swiper.lazy && swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }
    }

    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
        swiper.slides.css(offsetProp, offset + "px");
      }

      swiper.updateProgress();
      return;
    }

    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset: offset,
        from: from,
        to: to,
        slides: function getSlides() {
          var slidesToRender = [];

          for (var i = from; i <= to; i += 1) {
            slidesToRender.push(slides[i]);
          }

          return slidesToRender;
        }()
      });

      if (swiper.params.virtual.renderExternalUpdate) {
        onRendered();
      }

      return;
    }

    var prependIndexes = [];
    var appendIndexes = [];

    if (force) {
      swiper.$wrapperEl.find("." + swiper.params.slideClass).remove();
    } else {
      for (var i = previousFrom; i <= previousTo; i += 1) {
        if (i < from || i > to) {
          swiper.$wrapperEl.find("." + swiper.params.slideClass + "[data-swiper-slide-index=\"" + i + "\"]").remove();
        }
      }
    }

    for (var _i = 0; _i < slides.length; _i += 1) {
      if (_i >= from && _i <= to) {
        if (typeof previousTo === 'undefined' || force) {
          appendIndexes.push(_i);
        } else {
          if (_i > previousTo) appendIndexes.push(_i);
          if (_i < previousFrom) prependIndexes.push(_i);
        }
      }
    }

    appendIndexes.forEach(function (index) {
      swiper.$wrapperEl.append(renderSlide(slides[index], index));
    });
    prependIndexes.sort(function (a, b) {
      return b - a;
    }).forEach(function (index) {
      swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
    });
    swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, offset + "px");
    onRendered();
  },
  renderSlide: function renderSlide(slide, index) {
    var swiper = this;
    var params = swiper.params.virtual;

    if (params.cache && swiper.virtual.cache[index]) {
      return swiper.virtual.cache[index];
    }

    var $slideEl = params.renderSlide ? Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(params.renderSlide.call(swiper, slide, index)) : Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["default"])("<div class=\"" + swiper.params.slideClass + "\" data-swiper-slide-index=\"" + index + "\">" + slide + "</div>");
    if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
    if (params.cache) swiper.virtual.cache[index] = $slideEl;
    return $slideEl;
  },
  appendSlide: function appendSlide(slides) {
    var swiper = this;

    if (typeof slides === 'object' && 'length' in slides) {
      for (var i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.push(slides[i]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }

    swiper.virtual.update(true);
  },
  prependSlide: function prependSlide(slides) {
    var swiper = this;
    var activeIndex = swiper.activeIndex;
    var newActiveIndex = activeIndex + 1;
    var numberOfNewSlides = 1;

    if (Array.isArray(slides)) {
      for (var i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
      }

      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }

    if (swiper.params.virtual.cache) {
      var cache = swiper.virtual.cache;
      var newCache = {};
      Object.keys(cache).forEach(function (cachedIndex) {
        var $cachedEl = cache[cachedIndex];
        var cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

        if (cachedElIndex) {
          $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + 1);
        }

        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
      });
      swiper.virtual.cache = newCache;
    }

    swiper.virtual.update(true);
    swiper.slideTo(newActiveIndex, 0);
  },
  removeSlide: function removeSlide(slidesIndexes) {
    var swiper = this;
    if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
    var activeIndex = swiper.activeIndex;

    if (Array.isArray(slidesIndexes)) {
      for (var i = slidesIndexes.length - 1; i >= 0; i -= 1) {
        swiper.virtual.slides.splice(slidesIndexes[i], 1);

        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i]];
        }

        if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      swiper.virtual.slides.splice(slidesIndexes, 1);

      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
      }

      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }

    swiper.virtual.update(true);
    swiper.slideTo(activeIndex, 0);
  },
  removeAllSlides: function removeAllSlides() {
    var swiper = this;
    swiper.virtual.slides = [];

    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }

    swiper.virtual.update(true);
    swiper.slideTo(0, 0);
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'virtual',
  params: {
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      renderSlide: null,
      renderExternal: null,
      renderExternalUpdate: true,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      virtual: _extends({}, Virtual, {
        slides: swiper.params.virtual.slides,
        cache: {}
      })
    });
  },
  on: {
    beforeInit: function beforeInit(swiper) {
      if (!swiper.params.virtual.enabled) return;
      swiper.classNames.push(swiper.params.containerModifierClass + "virtual");
      var overwriteParams = {
        watchSlidesProgress: true
      };
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.params, overwriteParams);
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper.originalParams, overwriteParams);

      if (!swiper.params.initialSlide) {
        swiper.virtual.update();
      }
    },
    setTranslate: function setTranslate(swiper) {
      if (!swiper.params.virtual.enabled) return;
      swiper.virtual.update();
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/components/zoom/zoom.js":
/*!*********************************************************!*\
  !*** ./node_modules/swiper/esm/components/zoom/zoom.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dom */ "./node_modules/swiper/esm/utils/dom.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




var Zoom = {
  // Calc Scale From Multi-touches
  getDistanceBetweenTouches: function getDistanceBetweenTouches(e) {
    if (e.targetTouches.length < 2) return 1;
    var x1 = e.targetTouches[0].pageX;
    var y1 = e.targetTouches[0].pageY;
    var x2 = e.targetTouches[1].pageX;
    var y2 = e.targetTouches[1].pageY;
    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
  },
  // Events
  onGestureStart: function onGestureStart(e) {
    var swiper = this;
    var support = swiper.support;
    var params = swiper.params.zoom;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;
    zoom.fakeGestureTouched = false;
    zoom.fakeGestureMoved = false;

    if (!support.gestures) {
      if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
        return;
      }

      zoom.fakeGestureTouched = true;
      gesture.scaleStart = Zoom.getDistanceBetweenTouches(e);
    }

    if (!gesture.$slideEl || !gesture.$slideEl.length) {
      gesture.$slideEl = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_1__["default"])(e.target).closest("." + swiper.params.slideClass);
      if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas, picture, .swiper-zoom-target');
      gesture.$imageWrapEl = gesture.$imageEl.parent("." + params.containerClass);
      gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

      if (gesture.$imageWrapEl.length === 0) {
        gesture.$imageEl = undefined;
        return;
      }
    }

    if (gesture.$imageEl) {
      gesture.$imageEl.transition(0);
    }

    swiper.zoom.isScaling = true;
  },
  onGestureChange: function onGestureChange(e) {
    var swiper = this;
    var support = swiper.support;
    var params = swiper.params.zoom;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    if (!support.gestures) {
      if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
        return;
      }

      zoom.fakeGestureMoved = true;
      gesture.scaleMove = Zoom.getDistanceBetweenTouches(e);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
      if (e.type === 'gesturechange') zoom.onGestureStart(e);
      return;
    }

    if (support.gestures) {
      zoom.scale = e.scale * zoom.currentScale;
    } else {
      zoom.scale = gesture.scaleMove / gesture.scaleStart * zoom.currentScale;
    }

    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + Math.pow(zoom.scale - gesture.maxRatio + 1, 0.5);
    }

    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - Math.pow(params.minRatio - zoom.scale + 1, 0.5);
    }

    gesture.$imageEl.transform("translate3d(0,0,0) scale(" + zoom.scale + ")");
  },
  onGestureEnd: function onGestureEnd(e) {
    var swiper = this;
    var device = swiper.device;
    var support = swiper.support;
    var params = swiper.params.zoom;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    if (!support.gestures) {
      if (!zoom.fakeGestureTouched || !zoom.fakeGestureMoved) {
        return;
      }

      if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
        return;
      }

      zoom.fakeGestureTouched = false;
      zoom.fakeGestureMoved = false;
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.$imageEl.transition(swiper.params.speed).transform("translate3d(0,0,0) scale(" + zoom.scale + ")");
    zoom.currentScale = zoom.scale;
    zoom.isScaling = false;
    if (zoom.scale === 1) gesture.$slideEl = undefined;
  },
  onTouchStart: function onTouchStart(e) {
    var swiper = this;
    var device = swiper.device;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture,
        image = zoom.image;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    if (image.isTouched) return;
    if (device.android && e.cancelable) e.preventDefault();
    image.isTouched = true;
    image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  },
  onTouchMove: function onTouchMove(e) {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture,
        image = zoom.image,
        velocity = zoom.velocity;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    swiper.allowClick = false;
    if (!image.isTouched || !gesture.$slideEl) return;

    if (!image.isMoved) {
      image.width = gesture.$imageEl[0].offsetWidth;
      image.height = gesture.$imageEl[0].offsetHeight;
      image.startX = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["getTranslate"])(gesture.$imageWrapEl[0], 'x') || 0;
      image.startY = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["getTranslate"])(gesture.$imageWrapEl[0], 'y') || 0;
      gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
      gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
      gesture.$imageWrapEl.transition(0);

      if (swiper.rtl) {
        image.startX = -image.startX;
        image.startY = -image.startY;
      }
    } // Define if we need image drag


    var scaledWidth = image.width * zoom.scale;
    var scaledHeight = image.height * zoom.scale;
    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

    if (!image.isMoved && !zoom.isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }

      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    e.stopPropagation();
    image.isMoved = true;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - Math.pow(image.minX - image.currentX + 1, 0.8);
    }

    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + Math.pow(image.currentX - image.maxX + 1, 0.8);
    }

    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - Math.pow(image.minY - image.currentY + 1, 0.8);
    }

    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + Math.pow(image.currentY - image.maxY + 1, 0.8);
    } // Velocity


    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.$imageWrapEl.transform("translate3d(" + image.currentX + "px, " + image.currentY + "px,0)");
  },
  onTouchEnd: function onTouchEnd() {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture,
        image = zoom.image,
        velocity = zoom.velocity;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }

    image.isTouched = false;
    image.isMoved = false;
    var momentumDurationX = 300;
    var momentumDurationY = 300;
    var momentumDistanceX = velocity.x * momentumDurationX;
    var newPositionX = image.currentX + momentumDistanceX;
    var momentumDistanceY = velocity.y * momentumDurationY;
    var newPositionY = image.currentY + momentumDistanceY; // Fix duration

    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    var momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY; // Define if we need image drag

    var scaledWidth = image.width * zoom.scale;
    var scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.$imageWrapEl.transition(momentumDuration).transform("translate3d(" + image.currentX + "px, " + image.currentY + "px,0)");
  },
  onTransitionEnd: function onTransitionEnd() {
    var swiper = this;
    var zoom = swiper.zoom;
    var gesture = zoom.gesture;

    if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
      if (gesture.$imageEl) {
        gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
      }

      if (gesture.$imageWrapEl) {
        gesture.$imageWrapEl.transform('translate3d(0,0,0)');
      }

      zoom.scale = 1;
      zoom.currentScale = 1;
      gesture.$slideEl = undefined;
      gesture.$imageEl = undefined;
      gesture.$imageWrapEl = undefined;
    }
  },
  // Toggle Zoom
  toggle: function toggle(e) {
    var swiper = this;
    var zoom = swiper.zoom;

    if (zoom.scale && zoom.scale !== 1) {
      // Zoom Out
      zoom.out();
    } else {
      // Zoom In
      zoom.in(e);
    }
  },
  in: function _in(e) {
    var swiper = this;
    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var zoom = swiper.zoom;
    var params = swiper.params.zoom;
    var gesture = zoom.gesture,
        image = zoom.image;

    if (!gesture.$slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.$slideEl = swiper.$wrapperEl.children("." + swiper.params.slideActiveClass);
      } else {
        gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      }

      gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas, picture, .swiper-zoom-target');
      gesture.$imageWrapEl = gesture.$imageEl.parent("." + params.containerClass);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    gesture.$slideEl.addClass("" + params.zoomedSlideClass);
    var touchX;
    var touchY;
    var offsetX;
    var offsetY;
    var diffX;
    var diffY;
    var translateX;
    var translateY;
    var imageWidth;
    var imageHeight;
    var scaledWidth;
    var scaledHeight;
    var translateMinX;
    var translateMinY;
    var translateMaxX;
    var translateMaxY;
    var slideWidth;
    var slideHeight;

    if (typeof image.touchesStart.x === 'undefined' && e) {
      touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
      touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }

    zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
    zoom.currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

    if (e) {
      slideWidth = gesture.$slideEl[0].offsetWidth;
      slideHeight = gesture.$slideEl[0].offsetHeight;
      offsetX = gesture.$slideEl.offset().left + window.scrollX;
      offsetY = gesture.$slideEl.offset().top + window.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.$imageEl[0].offsetWidth;
      imageHeight = gesture.$imageEl[0].offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;

      if (translateX < translateMinX) {
        translateX = translateMinX;
      }

      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }

      if (translateY < translateMinY) {
        translateY = translateMinY;
      }

      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }

    gesture.$imageWrapEl.transition(300).transform("translate3d(" + translateX + "px, " + translateY + "px,0)");
    gesture.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + zoom.scale + ")");
  },
  out: function out() {
    var swiper = this;
    var zoom = swiper.zoom;
    var params = swiper.params.zoom;
    var gesture = zoom.gesture;

    if (!gesture.$slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.$slideEl = swiper.$wrapperEl.children("." + swiper.params.slideActiveClass);
      } else {
        gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      }

      gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas, picture, .swiper-zoom-target');
      gesture.$imageWrapEl = gesture.$imageEl.parent("." + params.containerClass);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    zoom.scale = 1;
    zoom.currentScale = 1;
    gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
    gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
    gesture.$slideEl.removeClass("" + params.zoomedSlideClass);
    gesture.$slideEl = undefined;
  },
  toggleGestures: function toggleGestures(method) {
    var swiper = this;
    var zoom = swiper.zoom;
    var selector = zoom.slideSelector,
        passive = zoom.passiveListener;
    swiper.$wrapperEl[method]('gesturestart', selector, zoom.onGestureStart, passive);
    swiper.$wrapperEl[method]('gesturechange', selector, zoom.onGestureChange, passive);
    swiper.$wrapperEl[method]('gestureend', selector, zoom.onGestureEnd, passive);
  },
  enableGestures: function enableGestures() {
    if (this.zoom.gesturesEnabled) return;
    this.zoom.gesturesEnabled = true;
    this.zoom.toggleGestures('on');
  },
  disableGestures: function disableGestures() {
    if (!this.zoom.gesturesEnabled) return;
    this.zoom.gesturesEnabled = false;
    this.zoom.toggleGestures('off');
  },
  // Attach/Detach Events
  enable: function enable() {
    var swiper = this;
    var support = swiper.support;
    var zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;
    var passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    var activeListenerWithCapture = support.passiveListener ? {
      passive: false,
      capture: true
    } : true;
    var slideSelector = "." + swiper.params.slideClass;
    swiper.zoom.passiveListener = passiveListener;
    swiper.zoom.slideSelector = slideSelector; // Scale image

    if (support.gestures) {
      swiper.$wrapperEl.on(swiper.touchEvents.start, swiper.zoom.enableGestures, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.end, swiper.zoom.disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, zoom.onGestureStart, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, zoom.onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, zoom.onGestureEnd, passiveListener);

      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, zoom.onGestureEnd, passiveListener);
      }
    } // Move image


    swiper.$wrapperEl.on(swiper.touchEvents.move, "." + swiper.params.zoom.containerClass, zoom.onTouchMove, activeListenerWithCapture);
  },
  disable: function disable() {
    var swiper = this;
    var zoom = swiper.zoom;
    if (!zoom.enabled) return;
    var support = swiper.support;
    swiper.zoom.enabled = false;
    var passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    var activeListenerWithCapture = support.passiveListener ? {
      passive: false,
      capture: true
    } : true;
    var slideSelector = "." + swiper.params.slideClass; // Scale image

    if (support.gestures) {
      swiper.$wrapperEl.off(swiper.touchEvents.start, swiper.zoom.enableGestures, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.end, swiper.zoom.disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, zoom.onGestureStart, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, zoom.onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, zoom.onGestureEnd, passiveListener);

      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, zoom.onGestureEnd, passiveListener);
      }
    } // Move image


    swiper.$wrapperEl.off(swiper.touchEvents.move, "." + swiper.params.zoom.containerClass, zoom.onTouchMove, activeListenerWithCapture);
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'zoom',
  params: {
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: 'swiper-zoom-container',
      zoomedSlideClass: 'swiper-slide-zoomed'
    }
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["bindModuleMethods"])(swiper, {
      zoom: _extends({
        enabled: false,
        scale: 1,
        currentScale: 1,
        isScaling: false,
        gesture: {
          $slideEl: undefined,
          slideWidth: undefined,
          slideHeight: undefined,
          $imageEl: undefined,
          $imageWrapEl: undefined,
          maxRatio: 3
        },
        image: {
          isTouched: undefined,
          isMoved: undefined,
          currentX: undefined,
          currentY: undefined,
          minX: undefined,
          minY: undefined,
          maxX: undefined,
          maxY: undefined,
          width: undefined,
          height: undefined,
          startX: undefined,
          startY: undefined,
          touchesStart: {},
          touchesCurrent: {}
        },
        velocity: {
          x: undefined,
          y: undefined,
          prevPositionX: undefined,
          prevPositionY: undefined,
          prevTime: undefined
        }
      }, Zoom)
    });
    var scale = 1;
    Object.defineProperty(swiper.zoom, 'scale', {
      get: function get() {
        return scale;
      },
      set: function set(value) {
        if (scale !== value) {
          var imageEl = swiper.zoom.gesture.$imageEl ? swiper.zoom.gesture.$imageEl[0] : undefined;
          var slideEl = swiper.zoom.gesture.$slideEl ? swiper.zoom.gesture.$slideEl[0] : undefined;
          swiper.emit('zoomChange', value, imageEl, slideEl);
        }

        scale = value;
      }
    });
  },
  on: {
    init: function init(swiper) {
      if (swiper.params.zoom.enabled) {
        swiper.zoom.enable();
      }
    },
    destroy: function destroy(swiper) {
      swiper.zoom.disable();
    },
    touchStart: function touchStart(swiper, e) {
      if (!swiper.zoom.enabled) return;
      swiper.zoom.onTouchStart(e);
    },
    touchEnd: function touchEnd(swiper, e) {
      if (!swiper.zoom.enabled) return;
      swiper.zoom.onTouchEnd(e);
    },
    doubleTap: function doubleTap(swiper, e) {
      if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
        swiper.zoom.toggle(e);
      }
    },
    transitionEnd: function transitionEnd(swiper) {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
        swiper.zoom.onTransitionEnd();
      }
    },
    slideChange: function slideChange(swiper) {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
        swiper.zoom.onTransitionEnd();
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/modules/observer/observer.js":
/*!**************************************************************!*\
  !*** ./node_modules/swiper/esm/modules/observer/observer.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var Observer = {
  attach: function attach(target, options) {
    if (options === void 0) {
      options = {};
    }

    var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
    var swiper = this;
    var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    var observer = new ObserverFunc(function (mutations) {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (mutations.length === 1) {
        swiper.emit('observerUpdate', mutations[0]);
        return;
      }

      var observerUpdate = function observerUpdate() {
        swiper.emit('observerUpdate', mutations[0]);
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    swiper.observer.observers.push(observer);
  },
  init: function init() {
    var swiper = this;
    if (!swiper.support.observer || !swiper.params.observer) return;

    if (swiper.params.observeParents) {
      var containerParents = swiper.$el.parents();

      for (var i = 0; i < containerParents.length; i += 1) {
        swiper.observer.attach(containerParents[i]);
      }
    } // Observe container


    swiper.observer.attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    }); // Observe wrapper

    swiper.observer.attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  },
  destroy: function destroy() {
    var swiper = this;
    swiper.observer.observers.forEach(function (observer) {
      observer.disconnect();
    });
    swiper.observer.observers = [];
  }
};
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'observer',
  params: {
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  },
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["bindModuleMethods"])(swiper, {
      observer: _extends({}, Observer, {
        observers: []
      })
    });
  },
  on: {
    init: function init(swiper) {
      swiper.observer.init();
    },
    destroy: function destroy(swiper) {
      swiper.observer.destroy();
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/modules/resize/resize.js":
/*!**********************************************************!*\
  !*** ./node_modules/swiper/esm/modules/resize/resize.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./node_modules/swiper/esm/utils/utils.js");



var supportsResizeObserver = function supportsResizeObserver() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  return typeof window.ResizeObserver !== 'undefined';
};

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'resize',
  create: function create() {
    var swiper = this;
    Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__["extend"])(swiper, {
      resize: {
        observer: null,
        createObserver: function createObserver() {
          if (!swiper || swiper.destroyed || !swiper.initialized) return;
          swiper.resize.observer = new ResizeObserver(function (entries) {
            var width = swiper.width,
                height = swiper.height;
            var newWidth = width;
            var newHeight = height;
            entries.forEach(function (_ref) {
              var contentBoxSize = _ref.contentBoxSize,
                  contentRect = _ref.contentRect,
                  target = _ref.target;
              if (target && target !== swiper.el) return;
              newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
              newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
            });

            if (newWidth !== width || newHeight !== height) {
              swiper.resize.resizeHandler();
            }
          });
          swiper.resize.observer.observe(swiper.el);
        },
        removeObserver: function removeObserver() {
          if (swiper.resize.observer && swiper.resize.observer.unobserve && swiper.el) {
            swiper.resize.observer.unobserve(swiper.el);
            swiper.resize.observer = null;
          }
        },
        resizeHandler: function resizeHandler() {
          if (!swiper || swiper.destroyed || !swiper.initialized) return;
          swiper.emit('beforeResize');
          swiper.emit('resize');
        },
        orientationChangeHandler: function orientationChangeHandler() {
          if (!swiper || swiper.destroyed || !swiper.initialized) return;
          swiper.emit('orientationchange');
        }
      }
    });
  },
  on: {
    init: function init(swiper) {
      var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

      if (swiper.params.resizeObserver && supportsResizeObserver()) {
        swiper.resize.createObserver();
        return;
      } // Emit resize


      window.addEventListener('resize', swiper.resize.resizeHandler); // Emit orientationchange

      window.addEventListener('orientationchange', swiper.resize.orientationChangeHandler);
    },
    destroy: function destroy(swiper) {
      var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
      swiper.resize.removeObserver();
      window.removeEventListener('resize', swiper.resize.resizeHandler);
      window.removeEventListener('orientationchange', swiper.resize.orientationChangeHandler);
    }
  }
});

/***/ }),

/***/ "./node_modules/swiper/esm/utils/dom.js":
/*!**********************************************!*\
  !*** ./node_modules/swiper/esm/utils/dom.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dom7__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dom7 */ "./node_modules/dom7/dom7.esm.js");

var Methods = {
  addClass: dom7__WEBPACK_IMPORTED_MODULE_0__["addClass"],
  removeClass: dom7__WEBPACK_IMPORTED_MODULE_0__["removeClass"],
  hasClass: dom7__WEBPACK_IMPORTED_MODULE_0__["hasClass"],
  toggleClass: dom7__WEBPACK_IMPORTED_MODULE_0__["toggleClass"],
  attr: dom7__WEBPACK_IMPORTED_MODULE_0__["attr"],
  removeAttr: dom7__WEBPACK_IMPORTED_MODULE_0__["removeAttr"],
  transform: dom7__WEBPACK_IMPORTED_MODULE_0__["transform"],
  transition: dom7__WEBPACK_IMPORTED_MODULE_0__["transition"],
  on: dom7__WEBPACK_IMPORTED_MODULE_0__["on"],
  off: dom7__WEBPACK_IMPORTED_MODULE_0__["off"],
  trigger: dom7__WEBPACK_IMPORTED_MODULE_0__["trigger"],
  transitionEnd: dom7__WEBPACK_IMPORTED_MODULE_0__["transitionEnd"],
  outerWidth: dom7__WEBPACK_IMPORTED_MODULE_0__["outerWidth"],
  outerHeight: dom7__WEBPACK_IMPORTED_MODULE_0__["outerHeight"],
  styles: dom7__WEBPACK_IMPORTED_MODULE_0__["styles"],
  offset: dom7__WEBPACK_IMPORTED_MODULE_0__["offset"],
  css: dom7__WEBPACK_IMPORTED_MODULE_0__["css"],
  each: dom7__WEBPACK_IMPORTED_MODULE_0__["each"],
  html: dom7__WEBPACK_IMPORTED_MODULE_0__["html"],
  text: dom7__WEBPACK_IMPORTED_MODULE_0__["text"],
  is: dom7__WEBPACK_IMPORTED_MODULE_0__["is"],
  index: dom7__WEBPACK_IMPORTED_MODULE_0__["index"],
  eq: dom7__WEBPACK_IMPORTED_MODULE_0__["eq"],
  append: dom7__WEBPACK_IMPORTED_MODULE_0__["append"],
  prepend: dom7__WEBPACK_IMPORTED_MODULE_0__["prepend"],
  next: dom7__WEBPACK_IMPORTED_MODULE_0__["next"],
  nextAll: dom7__WEBPACK_IMPORTED_MODULE_0__["nextAll"],
  prev: dom7__WEBPACK_IMPORTED_MODULE_0__["prev"],
  prevAll: dom7__WEBPACK_IMPORTED_MODULE_0__["prevAll"],
  parent: dom7__WEBPACK_IMPORTED_MODULE_0__["parent"],
  parents: dom7__WEBPACK_IMPORTED_MODULE_0__["parents"],
  closest: dom7__WEBPACK_IMPORTED_MODULE_0__["closest"],
  find: dom7__WEBPACK_IMPORTED_MODULE_0__["find"],
  children: dom7__WEBPACK_IMPORTED_MODULE_0__["children"],
  filter: dom7__WEBPACK_IMPORTED_MODULE_0__["filter"],
  remove: dom7__WEBPACK_IMPORTED_MODULE_0__["remove"]
};
Object.keys(Methods).forEach(function (methodName) {
  Object.defineProperty(dom7__WEBPACK_IMPORTED_MODULE_0__["$"].fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
/* harmony default export */ __webpack_exports__["default"] = (dom7__WEBPACK_IMPORTED_MODULE_0__["$"]);

/***/ }),

/***/ "./node_modules/swiper/esm/utils/get-browser.js":
/*!******************************************************!*\
  !*** ./node_modules/swiper/esm/utils/get-browser.js ***!
  \******************************************************/
/*! exports provided: getBrowser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBrowser", function() { return getBrowser; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");

var browser;

function calcBrowser() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();

  function isSafari() {
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }

  return {
    isEdge: !!window.navigator.userAgent.match(/Edge/g),
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
  };
}

function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }

  return browser;
}



/***/ }),

/***/ "./node_modules/swiper/esm/utils/get-device.js":
/*!*****************************************************!*\
  !*** ./node_modules/swiper/esm/utils/get-device.js ***!
  \*****************************************************/
/*! exports provided: getDevice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDevice", function() { return getDevice; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");
/* harmony import */ var _get_support__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-support */ "./node_modules/swiper/esm/utils/get-support.js");


var device;

function calcDevice(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      userAgent = _ref.userAgent;

  var support = Object(_get_support__WEBPACK_IMPORTED_MODULE_1__["getSupport"])();
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var platform = window.navigator.platform;
  var ua = userAgent || window.navigator.userAgent;
  var device = {
    ios: false,
    android: false
  };
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  var windows = platform === 'Win32';
  var macos = platform === 'MacIntel'; // iPadOs 13 fix

  var iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

  if (!ipad && macos && support.touch && iPadScreens.indexOf(screenWidth + "x" + screenHeight) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  } // Android


  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }

  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  } // Export object


  return device;
}

function getDevice(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }

  if (!device) {
    device = calcDevice(overrides);
  }

  return device;
}



/***/ }),

/***/ "./node_modules/swiper/esm/utils/get-support.js":
/*!******************************************************!*\
  !*** ./node_modules/swiper/esm/utils/get-support.js ***!
  \******************************************************/
/*! exports provided: getSupport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSupport", function() { return getSupport; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");

var support;

function calcSupport() {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var document = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getDocument"])();
  return {
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
    pointerEvents: !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0,
    observer: function checkObserver() {
      return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
    }(),
    passiveListener: function checkPassiveListener() {
      var supportsPassive = false;

      try {
        var opts = Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line
          get: function get() {
            supportsPassive = true;
          }
        });
        window.addEventListener('testPassiveListener', null, opts);
      } catch (e) {// No support
      }

      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return 'ongesturestart' in window;
    }()
  };
}

function getSupport() {
  if (!support) {
    support = calcSupport();
  }

  return support;
}



/***/ }),

/***/ "./node_modules/swiper/esm/utils/utils.js":
/*!************************************************!*\
  !*** ./node_modules/swiper/esm/utils/utils.js ***!
  \************************************************/
/*! exports provided: deleteProps, nextTick, now, getTranslate, isObject, extend, bindModuleMethods, getComputedStyle, classesToSelector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteProps", function() { return deleteProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nextTick", function() { return nextTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "now", function() { return now; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTranslate", function() { return getTranslate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindModuleMethods", function() { return bindModuleMethods; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getComputedStyle", function() { return getComputedStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classesToSelector", function() { return classesToSelector; });
/* harmony import */ var ssr_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ssr-window */ "./node_modules/ssr-window/ssr-window.esm.js");


function deleteProps(obj) {
  var object = obj;
  Object.keys(object).forEach(function (key) {
    try {
      object[key] = null;
    } catch (e) {// no getter for object
    }

    try {
      delete object[key];
    } catch (e) {// something got wrong
    }
  });
}

function nextTick(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }

  return setTimeout(callback, delay);
}

function now() {
  return Date.now();
}

function getComputedStyle(el) {
  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var style;

  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }

  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }

  if (!style) {
    style = el.style;
  }

  return style;
}

function getTranslate(el, axis) {
  if (axis === void 0) {
    axis = 'x';
  }

  var window = Object(ssr_window__WEBPACK_IMPORTED_MODULE_0__["getWindow"])();
  var matrix;
  var curTransform;
  var transformMatrix;
  var curStyle = getComputedStyle(el, null);

  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;

    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(function (a) {
        return a.replace(',', '.');
      }).join(', ');
    } // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case


    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
      else curTransform = parseFloat(matrix[4]);
  }

  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
      else curTransform = parseFloat(matrix[5]);
  }

  return curTransform || 0;
}

function isObject(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}

function extend() {
  var to = Object(arguments.length <= 0 ? undefined : arguments[0]);
  var noExtend = ['__proto__', 'constructor', 'prototype'];

  for (var i = 1; i < arguments.length; i += 1) {
    var nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];

    if (nextSource !== undefined && nextSource !== null) {
      var keysArray = Object.keys(Object(nextSource)).filter(function (key) {
        return noExtend.indexOf(key) < 0;
      });

      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

        if (desc !== undefined && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};

            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }

  return to;
}

function bindModuleMethods(instance, obj) {
  Object.keys(obj).forEach(function (key) {
    if (isObject(obj[key])) {
      Object.keys(obj[key]).forEach(function (subKey) {
        if (typeof obj[key][subKey] === 'function') {
          obj[key][subKey] = obj[key][subKey].bind(instance);
        }
      });
    }

    instance[key] = obj[key];
  });
}

function classesToSelector(classes) {
  if (classes === void 0) {
    classes = '';
  }

  return "." + classes.trim().replace(/([\.:\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.');
}



/***/ }),

/***/ "./node_modules/swiper/swiper-bundle.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/swiper/swiper-bundle.esm.js ***!
  \**************************************************/
/*! exports provided: Swiper, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esm_components_core_core_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esm/components/core/core-class */ "./node_modules/swiper/esm/components/core/core-class.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Swiper", function() { return _esm_components_core_core_class__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _esm_components_core_core_class__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _esm_components_virtual_virtual__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esm/components/virtual/virtual */ "./node_modules/swiper/esm/components/virtual/virtual.js");
/* harmony import */ var _esm_components_keyboard_keyboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./esm/components/keyboard/keyboard */ "./node_modules/swiper/esm/components/keyboard/keyboard.js");
/* harmony import */ var _esm_components_mousewheel_mousewheel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./esm/components/mousewheel/mousewheel */ "./node_modules/swiper/esm/components/mousewheel/mousewheel.js");
/* harmony import */ var _esm_components_navigation_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./esm/components/navigation/navigation */ "./node_modules/swiper/esm/components/navigation/navigation.js");
/* harmony import */ var _esm_components_pagination_pagination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./esm/components/pagination/pagination */ "./node_modules/swiper/esm/components/pagination/pagination.js");
/* harmony import */ var _esm_components_scrollbar_scrollbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./esm/components/scrollbar/scrollbar */ "./node_modules/swiper/esm/components/scrollbar/scrollbar.js");
/* harmony import */ var _esm_components_parallax_parallax__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./esm/components/parallax/parallax */ "./node_modules/swiper/esm/components/parallax/parallax.js");
/* harmony import */ var _esm_components_zoom_zoom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./esm/components/zoom/zoom */ "./node_modules/swiper/esm/components/zoom/zoom.js");
/* harmony import */ var _esm_components_lazy_lazy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./esm/components/lazy/lazy */ "./node_modules/swiper/esm/components/lazy/lazy.js");
/* harmony import */ var _esm_components_controller_controller__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./esm/components/controller/controller */ "./node_modules/swiper/esm/components/controller/controller.js");
/* harmony import */ var _esm_components_a11y_a11y__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./esm/components/a11y/a11y */ "./node_modules/swiper/esm/components/a11y/a11y.js");
/* harmony import */ var _esm_components_history_history__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./esm/components/history/history */ "./node_modules/swiper/esm/components/history/history.js");
/* harmony import */ var _esm_components_hash_navigation_hash_navigation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./esm/components/hash-navigation/hash-navigation */ "./node_modules/swiper/esm/components/hash-navigation/hash-navigation.js");
/* harmony import */ var _esm_components_autoplay_autoplay__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./esm/components/autoplay/autoplay */ "./node_modules/swiper/esm/components/autoplay/autoplay.js");
/* harmony import */ var _esm_components_effect_fade_effect_fade__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./esm/components/effect-fade/effect-fade */ "./node_modules/swiper/esm/components/effect-fade/effect-fade.js");
/* harmony import */ var _esm_components_effect_cube_effect_cube__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./esm/components/effect-cube/effect-cube */ "./node_modules/swiper/esm/components/effect-cube/effect-cube.js");
/* harmony import */ var _esm_components_effect_flip_effect_flip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./esm/components/effect-flip/effect-flip */ "./node_modules/swiper/esm/components/effect-flip/effect-flip.js");
/* harmony import */ var _esm_components_effect_coverflow_effect_coverflow__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./esm/components/effect-coverflow/effect-coverflow */ "./node_modules/swiper/esm/components/effect-coverflow/effect-coverflow.js");
/* harmony import */ var _esm_components_thumbs_thumbs__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./esm/components/thumbs/thumbs */ "./node_modules/swiper/esm/components/thumbs/thumbs.js");
/**
 * Swiper 6.5.8
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2021 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: April 23, 2021
 */























// Swiper Class
var components = [_esm_components_virtual_virtual__WEBPACK_IMPORTED_MODULE_1__["default"], _esm_components_keyboard_keyboard__WEBPACK_IMPORTED_MODULE_2__["default"], _esm_components_mousewheel_mousewheel__WEBPACK_IMPORTED_MODULE_3__["default"], _esm_components_navigation_navigation__WEBPACK_IMPORTED_MODULE_4__["default"], _esm_components_pagination_pagination__WEBPACK_IMPORTED_MODULE_5__["default"], _esm_components_scrollbar_scrollbar__WEBPACK_IMPORTED_MODULE_6__["default"], _esm_components_parallax_parallax__WEBPACK_IMPORTED_MODULE_7__["default"], _esm_components_zoom_zoom__WEBPACK_IMPORTED_MODULE_8__["default"], _esm_components_lazy_lazy__WEBPACK_IMPORTED_MODULE_9__["default"], _esm_components_controller_controller__WEBPACK_IMPORTED_MODULE_10__["default"], _esm_components_a11y_a11y__WEBPACK_IMPORTED_MODULE_11__["default"], _esm_components_history_history__WEBPACK_IMPORTED_MODULE_12__["default"], _esm_components_hash_navigation_hash_navigation__WEBPACK_IMPORTED_MODULE_13__["default"], _esm_components_autoplay_autoplay__WEBPACK_IMPORTED_MODULE_14__["default"], _esm_components_effect_fade_effect_fade__WEBPACK_IMPORTED_MODULE_15__["default"], _esm_components_effect_cube_effect_cube__WEBPACK_IMPORTED_MODULE_16__["default"], _esm_components_effect_flip_effect_flip__WEBPACK_IMPORTED_MODULE_17__["default"], _esm_components_effect_coverflow_effect_coverflow__WEBPACK_IMPORTED_MODULE_18__["default"], _esm_components_thumbs_thumbs__WEBPACK_IMPORTED_MODULE_19__["default"]];
_esm_components_core_core_class__WEBPACK_IMPORTED_MODULE_0__["default"].use(components);


/***/ })

}]);
//# sourceMappingURL=vendor.js.map