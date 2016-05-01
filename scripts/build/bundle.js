/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//import React from 'react';
	//import ReactDOM from 'react-dom';

	TodoApp = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"TodoApp\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	TodoForm = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"TodoForm\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	TodoList = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"TodoList\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	Task = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"task\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	ReactDOM.render(React.createElement(TodoApp, { url: '/lab/react-crud-app/api/', pollInterval: 5000 }), document.getElementById('content'));

/***/ }
/******/ ]);