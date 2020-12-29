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
  var links = header.querySelectorAll(".header__nav-link_sub, .header__nav-link_menu");
  var submenus = header.querySelectorAll(".header__submenu");
  var openedSubmemu = undefined;

  var closeAllSubmenus = function closeAllSubmenus() {
    submenus.forEach(function (menu) {
      return menu.classList.remove("opened");
    });
    links.forEach(function (anotherLink) {
      return anotherLink.classList.remove("opened");
    });
  };

  var onWindowClick = function onWindowClick(event) {
    if (!event.target.matches(".header__submenu, .header__submenu *")) {
      closeAllSubmenus();
      document.removeEventListener("click", onWindowClick);
    }
  };

  links.forEach(function (link, index) {
    return link.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var submenu = link.closest(".header__nav-item").querySelector(".header__submenu");

      if (openedSubmemu === index) {
        link.classList.remove("opened");
        submenu.classList.remove("opened");
        openedSubmemu = undefined;
        document.removeEventListener("click", onWindowClick);
      } else {
        closeAllSubmenus();
        link.classList.add("opened");
        submenu.classList.add("opened");
        openedSubmemu = index;
        document.addEventListener("click", onWindowClick);
      }
    });
  });
}

/***/ }),

/***/ "./src/blocks/modules/knowledge/knowledge.js":
/*!***************************************************!*\
  !*** ./src/blocks/modules/knowledge/knowledge.js ***!
  \***************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/js/swiper.esm.bundle.js");
/* eslint-disable linebreak-style */

new swiper__WEBPACK_IMPORTED_MODULE_0__["default"](".knowledge .swiper-container", {
  loop: true,
  simulateTouch: false,
  navigation: {
    nextEl: ".knowledge__next-button",
    prevEl: ".knowledge__prev-button"
  },
  breakpoints: {
    1200: {
      spaceBetween: 40,
      slidesPerView: 4
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }
});

/***/ }),

/***/ "./src/blocks/modules/product-item/product-item.js":
/*!*********************************************************!*\
  !*** ./src/blocks/modules/product-item/product-item.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var body = document.querySelector("body");
var buttonsProperties = document.querySelectorAll(".product-item__btn_properties");
var buttonsFeatures = document.querySelectorAll(".product-item__btn_features");
var buttonsNorms = document.querySelectorAll(".product-item__btn_norms");
var buttonClosePopup = document.querySelectorAll(".product-item__button-close");
var modalSelectors = [".product-item__modal_properties", ".product-item__modal_features", ".product-item__modal_norms"];

var attachEventListners = function attachEventListners(buttons, contentSelector) {
  buttons.forEach(function (button) {
    button.addEventListener("click", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var contentElement = button.closest("section.product-item").querySelector(contentSelector);
      contentElement.classList.remove("product-item__modal-closed"); // add event listner to the document

      document.addEventListener("click", onWindowClick);
      body.style.overflow = "hidden";
    });
  });
  buttonClosePopup.forEach(function (button) {
    return button.addEventListener("click", closeAllModals);
  });
};

var closeAllModals = function closeAllModals() {
  modalSelectors.forEach(function (selector) {
    var modals = document.querySelectorAll(selector);
    modals.forEach(function (modal) {
      return modal.classList.add("product-item__modal-closed");
    });
  }); // remove event listner to the document

  document.removeEventListener("click", onWindowClick);
  body.style.overflow = "visible";
};

var onWindowClick = function onWindowClick(evt) {
  if (!evt.target.matches(".product-item__modal, .product-item__modal *")) {
    closeAllModals();
  }
};

attachEventListners(buttonsProperties, ".product-item__modal_properties");
attachEventListners(buttonsFeatures, ".product-item__modal_features");
attachEventListners(buttonsNorms, ".product-item__modal_norms");

/***/ }),

/***/ "./src/blocks/modules/r-and-d/r-and-d.js":
/*!***********************************************!*\
  !*** ./src/blocks/modules/r-and-d/r-and-d.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var moreInfoBtns = document.querySelectorAll('.r-and-d__more-info');
moreInfoBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    btn.style.display = 'none';
    btn.parentElement.querySelector('.r-and-d__laboratory-info').style.display = 'block';
  });
});

/***/ }),

/***/ "./src/js/import/components.js":
/*!*************************************!*\
  !*** ./src/js/import/components.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {



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
/* harmony import */ var _modules_knowledge_knowledge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! %modules%/knowledge/knowledge */ "./src/blocks/modules/knowledge/knowledge.js");
/* harmony import */ var _modules_product_item_product_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! %modules%/product-item/product-item */ "./src/blocks/modules/product-item/product-item.js");
/* harmony import */ var _modules_product_item_product_item__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_product_item_product_item__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules_r_and_d_r_and_d__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! %modules%/r-and-d/r-and-d */ "./src/blocks/modules/r-and-d/r-and-d.js");
/* harmony import */ var _modules_r_and_d_r_and_d__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_r_and_d_r_and_d__WEBPACK_IMPORTED_MODULE_4__);






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
/* harmony import */ var _import_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./import/components */ "./src/js/import/components.js");
/* harmony import */ var _import_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_import_components__WEBPACK_IMPORTED_MODULE_1__);



/***/ })

/******/ });
//# sourceMappingURL=main.js.map