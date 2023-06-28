/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Assets_Logo_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Assets/Logo.png */ \"./src/Assets/Logo.png\");\n/* harmony import */ var _Assets_Home_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Assets/Home.svg */ \"./src/Assets/Home.svg\");\n/* harmony import */ var _Assets_Today_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Assets/Today.svg */ \"./src/Assets/Today.svg\");\n/* harmony import */ var _Assets_Week_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Assets/Week.svg */ \"./src/Assets/Week.svg\");\n/* harmony import */ var _Assets_Important_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Assets/Important.svg */ \"./src/Assets/Important.svg\");\n/* harmony import */ var _Assets_Complete_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Assets/Complete.svg */ \"./src/Assets/Complete.svg\");\n//import { createAnElement, createAnImg} from \"../../Restaurant-Page/src/homePage\";\n\n\n\n\n\n\n\nconst content = createAnElement(\"div\", \"content\")\n\n//HEADER\nconst headerDiv = createAnElement(\"div\", \"headerDiv\")\nconst pageTitle = createAnElement(\"h1\", \"pageTitle\")\nconst siteLogo = createAnImg(_Assets_Logo_png__WEBPACK_IMPORTED_MODULE_0__, \"siteLogo\")\npageTitle.textContent = \"To-Do List\"\nheaderDiv.appendChild(siteLogo)\nheaderDiv.appendChild(pageTitle)\n\n//SIDEBAR\nconst sideBarDiv = createAnElement(\"div\", \"sideBarDiv\")\nconst mainOptionsDiv = createAnElement(\"div\", \"mainOptionsDiv\")\nconst icons = [_Assets_Home_svg__WEBPACK_IMPORTED_MODULE_1__, _Assets_Today_svg__WEBPACK_IMPORTED_MODULE_2__, _Assets_Week_svg__WEBPACK_IMPORTED_MODULE_3__, _Assets_Important_svg__WEBPACK_IMPORTED_MODULE_4__, _Assets_Complete_svg__WEBPACK_IMPORTED_MODULE_5__]\nconst optionNames = [\"Home\", \"Today\", \"Week\", \"Important\", \"Completed\"]\nfor(let i=0; i<optionNames; i++){\n    mainOptionsDiv.appendChild(createSideBarOption(icons[i], optionNames[i]))\n}\nsideBarDiv.appendChild(mainOptionsDiv)\n\nconst projectOptionDiv = createAnElement(\"div\", \"projectOptionDiv\")\nconst projectHeaderDiv = createAnElement(\"div\", \"projectHeader\")\nconst projectHeader = createAnElement(\"h2\", \"projectHeader\")\nprojectHeader.textContent = \"Project\"\nprojectHeaderDiv.appendChild(projectHeader)\nconst numProjeccts = createAnElement(\"h2\", \"numProjeccts\")\nnumProjeccts.textContent = \"(0)\"\nprojectHeaderDiv.appendChild(numProjeccts)\nconst addProjectBtn = createAnElement(\"button\", \"addProjectBtn\")\nprojectHeaderDiv.appendChild(addProjectBtn)\nconst projectsContainer = createAnElement(\"div\", \"projectsContainer\")\nprojectOptionDiv.appendChild(projectHeaderDiv)\nprojectOptionDiv.appendChild(projectsContainer)\n\nconst footer = createAnElement(\"footer\", \"footer\")\nsideBarDiv.appendChild(footer)\n\n//TO-DO LIST\nconst toDoMainContent = createAnElement(\"div\", \"toDoMainContent\")\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ncontent.appendChild(headerDiv)\n\nconst createSideBarOption = (importedIconName, optionName) =>{\n    const optionDiv = createAnElement(\"div\", \"optionDiv\")\n    const optionIcon = createAnImg(importedIconName, \"optionIcon\")\n    optionDiv.appendChild(optionIcon)\n    const optionText = createAnElement(\"p\", \"optionText\")\n    optionText.textContent = optionName\n    optionDiv.appendChild(optionText)\n    return optionDiv\n}\n\nconst createProject = (projectName) =>{\n    const projectDiv = createAnElement(\"div\", \"projectDiv\")\n    const projectIcon = createAnImg(_Assets_Home_svg__WEBPACK_IMPORTED_MODULE_1__, \"projectIcon\")\n    const projectNameP = createAnElement(\"p\", \"projectNameP\")\n    projectNameP.textContent = projectName\n    const editIcon = createAnImg(_Assets_Home_svg__WEBPACK_IMPORTED_MODULE_1__, \"editIcon\")\n    const deleteIcon = createAnImg(_Assets_Home_svg__WEBPACK_IMPORTED_MODULE_1__, \"deleteIcon\")\n    projectDiv.appendChild(projectIcon)\n    projectDiv.appendChild(projectNameP)\n    projectDiv.appendChild(editIcon)\n    projectDiv.appendChild(deleteIcon)\n    return projectDiv\n}\n\n//# sourceURL=webpack://to-do-list/./src/index.js?");

/***/ }),

/***/ "./src/Assets/Complete.svg":
/*!*********************************!*\
  !*** ./src/Assets/Complete.svg ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"7627dfa4976d51ee938e.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/Assets/Complete.svg?");

/***/ }),

/***/ "./src/Assets/Home.svg":
/*!*****************************!*\
  !*** ./src/Assets/Home.svg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"27a3c07e75d39646d5df.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/Assets/Home.svg?");

/***/ }),

/***/ "./src/Assets/Important.svg":
/*!**********************************!*\
  !*** ./src/Assets/Important.svg ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"6d8b6a17809c3c35f8fa.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/Assets/Important.svg?");

/***/ }),

/***/ "./src/Assets/Logo.png":
/*!*****************************!*\
  !*** ./src/Assets/Logo.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"8ebc7f758349bec1eca0.png\";\n\n//# sourceURL=webpack://to-do-list/./src/Assets/Logo.png?");

/***/ }),

/***/ "./src/Assets/Today.svg":
/*!******************************!*\
  !*** ./src/Assets/Today.svg ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"233385e32206cd372d69.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/Assets/Today.svg?");

/***/ }),

/***/ "./src/Assets/Week.svg":
/*!*****************************!*\
  !*** ./src/Assets/Week.svg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"518ff47ec29e1552eabd.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/Assets/Week.svg?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;