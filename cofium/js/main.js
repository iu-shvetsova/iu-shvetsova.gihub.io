/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/js/index.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/blocks/modules/application/application.js":
/*!*******************************************************!*\
  !*** ./src/blocks/modules/application/application.js ***!
  \*******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @googlemaps/js-api-loader */ "./node_modules/@googlemaps/js-api-loader/dist/index.esm.js");

var loader = new _googlemaps_js_api_loader__WEBPACK_IMPORTED_MODULE_0__["Loader"]({
  apiKey: "AIzaSyCLf_eYKNS4TVVz_8uoImQWbM2-mXCyo78",
  version: "weekly"
});
loader.load().then(function () {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 59.932045,
      lng: 30.355115
    },
    zoom: 15
  });
  var marker = new google.maps.Marker({
    position: {
      lat: 59.932045,
      lng: 30.355115
    },
    map: map,
    icon: "../img/location-pin.svg",
    draggarble: false
  });
  var information = new google.maps.InfoWindow({
    content: "Невский 98, лит А"
  });
  marker.addListener("click", function () {
    information.open(map, marker);
  });
});

/***/ }),

/***/ "./src/blocks/modules/balance/balance.js":
/*!***********************************************!*\
  !*** ./src/blocks/modules/balance/balance.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var balance = document.querySelector(".balance");

if (balance) {
  var buttonOpen = balance.querySelector(".balance__btn");
  var buttonClose = balance.querySelector(".balance__btn-close");
  var modal = balance.querySelector(".balance__modal");
  var body = document.querySelector("body");

  var onWindowClick = function onWindowClick(evt) {
    if (!evt.target.matches(".balance__modal, balance__modal *")) {
      modal.classList.remove("balance__modal_opened");
      body.classList.remove("no-scroll");
      document.removeEventListener("click", onWindowClick);
    }
  };

  buttonOpen.addEventListener("click", function (event) {
    event.stopPropagation();
    modal.classList.add("balance__modal_opened");
    body.classList.add("no-scroll");
    document.addEventListener("click", onWindowClick);
  });
  buttonClose.addEventListener("click", function () {
    modal.classList.remove("balance__modal_opened");
    body.classList.remove("no-scroll");
  });
}

/***/ }),

/***/ "./src/blocks/modules/drinks/drinks.js":
/*!*********************************************!*\
  !*** ./src/blocks/modules/drinks/drinks.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var drinks = document.querySelector(".drinks");

if (drinks) {
  var buttonOpen = drinks.querySelector(".drinks__content-btn");
  var buttonClose = drinks.querySelector(".drinks__btn-close");
  var modal = drinks.querySelector(".drinks__modal");
  var body = document.querySelector("body");

  var onWindowClick = function onWindowClick(evt) {
    if (!evt.target.matches(".drinks__modal, drinks__modal *")) {
      modal.classList.remove("drinks__modal_opened");
      body.classList.remove("no-scroll");
      document.removeEventListener("click", onWindowClick);
    }
  };

  buttonOpen.addEventListener("click", function (event) {
    event.stopPropagation();
    modal.classList.add("drinks__modal_opened");
    body.classList.add("no-scroll");
    document.addEventListener("click", onWindowClick);
  });
  buttonClose.addEventListener("click", function () {
    modal.classList.remove("drinks__modal_opened");
    body.classList.remove("no-scroll");
  });
}

/***/ }),

/***/ "./src/blocks/modules/footer/footer.js":
/*!*********************************************!*\
  !*** ./src/blocks/modules/footer/footer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/blocks/modules/header/header.js":
/*!*********************************************!*\
  !*** ./src/blocks/modules/header/header.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var header = document.querySelector(".header");

if (header) {
  var anchors = header.querySelectorAll(".header__link");
  var burger = header.querySelector(".header__nav-button");
  var nav = header.querySelector(".header__nav");
  var body = document.querySelector("body");

  var onWindowClick = function onWindowClick(evt) {
    if (!evt.target.matches(".header__nav, header__nav *, header__nav-button, header__nav-button *")) {
      nav.classList.remove("header__nav_opened");
      body.classList.remove("no-scroll");
      document.removeEventListener("click", onWindowClick);
    }
  };

  burger.addEventListener("click", function (event) {
    event.stopPropagation();
    nav.classList.toggle("header__nav_opened");
    body.classList.toggle("no-scroll");
    document.addEventListener("click", onWindowClick);
  });
  anchors.forEach(function (anchor) {
    return anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var href = anchor.getAttribute("href");
      var elem = document.querySelector(href) || document.querySelector("a[name=" + href.substring(1, href.length) + "]");
      window.scroll({
        top: elem.offsetTop,
        left: 0,
        behavior: "smooth"
      });
    });
  });
}

/***/ }),

/***/ "./src/blocks/modules/market/market.js":
/*!*********************************************!*\
  !*** ./src/blocks/modules/market/market.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper/bundle */ "./node_modules/swiper/swiper-bundle.esm.js");

var swiper = new swiper_bundle__WEBPACK_IMPORTED_MODULE_0__["default"](".market__slider", {
  speed: 800,
  slidesPerView: 1,
  centeredSlides: true,
  allowTouchMove: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    200: {
      allowTouchMove: true
    },
    1100: {
      allowTouchMove: false
    }
  }
});

/***/ }),

/***/ "./src/blocks/modules/modal/modal.js":
/*!*******************************************!*\
  !*** ./src/blocks/modules/modal/modal.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var overlayscrollbars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! overlayscrollbars */ "./node_modules/overlayscrollbars/js/OverlayScrollbars.js");
/* harmony import */ var overlayscrollbars__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(overlayscrollbars__WEBPACK_IMPORTED_MODULE_0__);

document.addEventListener("DOMContentLoaded", function () {
  overlayscrollbars__WEBPACK_IMPORTED_MODULE_0___default()(document.querySelectorAll(".modal__list"), {
    className: "custom-scroll",
    scrollbars: {
      clickScrolling: true
    },
    nativeScrollbarsOverlaid: {
      showNativeScrollbars: false,
      initialize: true
    }
  });
});

/***/ }),

/***/ "./src/blocks/modules/specialty-drinks/specialty-drinks.js":
/*!*****************************************************************!*\
  !*** ./src/blocks/modules/specialty-drinks/specialty-drinks.js ***!
  \*****************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper/bundle */ "./node_modules/swiper/swiper-bundle.esm.js");

var specialtyDrinks = document.querySelector(".specialty-drinks");

if (specialtyDrinks) {
  var swiper = new swiper_bundle__WEBPACK_IMPORTED_MODULE_0__["default"](".specialty-drinks__slider", {
    speed: 800,
    slidesPerView: 3,
    slidesPerGroup: 3,
    allowTouchMove: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      200: {
        allowTouchMove: true,
        slidesPerView: 1,
        slidesPerGroup: 1
      },
      1100: {
        allowTouchMove: false,
        spaceBetween: 80
      },
      1400: {
        slidesPerView: 3,
        spaceBetween: 80
      },
      1650: {
        spaceBetween: 190
      }
    }
  });
  var title = specialtyDrinks.querySelector(".specialty-drinks__title");
  swiper.on("slideChange", function (slide) {
    if (window.matchMedia("(max-width: 1400px)").matches) {
      switch (slide.activeIndex) {
        case 0:
          title.innerHTML = "Фирменные напитки";
          break;

        case 2:
          title.innerHTML = "Фирменные напитки";
          break;

        case 3:
          title.innerHTML = "Сезонное меню";
          break;
      }
    } else {
      switch (slide.activeIndex) {
        case 0:
          title.innerHTML = "Фирменные напитки";
          break;

        case 3:
          title.innerHTML = "Сезонное меню";
          break;
      }
    }
  });
}

/***/ }),

/***/ "./src/blocks/modules/to-go/to-go.js":
/*!*******************************************!*\
  !*** ./src/blocks/modules/to-go/to-go.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper/bundle */ "./node_modules/swiper/swiper-bundle.esm.js");

var swiper = new swiper_bundle__WEBPACK_IMPORTED_MODULE_0__["default"](".to-go__slider", {
  speed: 800,
  slidesPerView: 1,
  allowTouchMove: false,
  lazy: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    200: {
      allowTouchMove: true
    },
    1100: {
      allowTouchMove: false
    }
  }
});

/***/ }),

/***/ "./src/js/import/modules.js":
/*!**********************************!*\
  !*** ./src/js/import/modules.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_header_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! %modules%/header/header */ "./src/blocks/modules/header/header.js");
/* harmony import */ var _modules_header_header__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_header_header__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modules_footer_footer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! %modules%/footer/footer */ "./src/blocks/modules/footer/footer.js");
/* harmony import */ var _modules_footer_footer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_modules_footer_footer__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modules_to_go_to_go__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! %modules%/to-go/to-go */ "./src/blocks/modules/to-go/to-go.js");
/* harmony import */ var _modules_specialty_drinks_specialty_drinks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! %modules%/specialty-drinks/specialty-drinks */ "./src/blocks/modules/specialty-drinks/specialty-drinks.js");
/* harmony import */ var _modules_market_market__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! %modules%/market/market */ "./src/blocks/modules/market/market.js");
/* harmony import */ var _modules_application_application__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! %modules%/application/application */ "./src/blocks/modules/application/application.js");
/* harmony import */ var _modules_modal_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! %modules%/modal/modal */ "./src/blocks/modules/modal/modal.js");
/* harmony import */ var _modules_balance_balance__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! %modules%/balance/balance */ "./src/blocks/modules/balance/balance.js");
/* harmony import */ var _modules_balance_balance__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_modules_balance_balance__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _modules_drinks_drinks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! %modules%/drinks/drinks */ "./src/blocks/modules/drinks/drinks.js");
/* harmony import */ var _modules_drinks_drinks__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_modules_drinks_drinks__WEBPACK_IMPORTED_MODULE_8__);










/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _import_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./import/modules */ "./src/js/import/modules.js");


/***/ })

/******/ });
//# sourceMappingURL=main.js.map