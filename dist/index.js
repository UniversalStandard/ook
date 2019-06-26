"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _knownCssProperties = _interopRequireDefault(require("known-css-properties"));

var _lodash = require("lodash");

var _isPropValid = _interopRequireDefault(require("@emotion/is-prop-valid"));

var _glamor = require("glamor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Ook! Ook! 🍌
var breakpoints = {
  d: '0px',
  xs: '320px',
  s: '640px',
  m: '768px',
  l: '960px',
  xl: '1280px',
  xxl: '1920px',
  xxxl: '2400px'
};
var defaults = {
  fontFamily: {
    d: 'sans-serif'
  },
  fontSize: generateScale(11, 13)
};

function generateScale(minPx, maxPx) {
  if (typeof minPx !== 'number' || typeof maxPx !== 'number') {
    throw new Error('minPx and maxPx in generateScale() must be numbers');
  }

  var fontScale = stepScale(minPx, maxPx, Object.keys(breakpoints).length);
  return Object.keys(breakpoints).reduce(function (acc, bp, i) {
    acc[bp] = "".concat(fontScale[i] * 0.1, "em");
    return acc;
  }, {});
} // Finds the step increment between two numbers and returns an array using that increment for the number of steps.
// e.g. stepScale(5, 10, 4) // [5, 6.6667 8.3334, 10 ]


function stepScale(min, max, numberOfSteps) {
  var _numberOfSteps = numberOfSteps - 1;

  var scaleBy = (max - min) / _numberOfSteps;
  var arr = [];

  for (var i = 0; i <= _numberOfSteps; i += 1) {
    arr.push(min + scaleBy * i);
  }

  return arr;
}

var sortedBpNamesBySize = Object.keys(breakpoints).sort(function (a, b) {
  return parseInt(breakpoints[a]) - parseInt(breakpoints[b]);
});

var Ook = function Ook(props) {
  var inline = props.inline,
      base = props.base,
      children = props.children;
  var modifiedProps = Object.assign({}, props); // Create default rules object to be used as the initial accumulator for cssProps (so we can overwrite it)

  var defaultRules = Object.entries(defaults).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        cssProperty = _ref2[0],
        bpVals = _ref2[1];

    Object.entries(bpVals).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          bp = _ref4[0],
          val = _ref4[1];

      if (bp === sortedBpNamesBySize[0]) {
        acc[cssProperty] = val;
      } else {
        acc["@media (min-width: ".concat(breakpoints[bp], ")")] = _defineProperty({}, cssProperty, val);
      }
    });
    return acc;
  }, {});
  var cssProps = Object.entries(props).reduce(function (acc, _ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        val = _ref6[1];

    // Begin work on overwriting objects and single-value rules
    var prefixed = false;

    if (key.match(/^_/)) {
      prefixed = true;
    }

    var kebabCased = prefixed ? "-".concat((0, _lodash.kebabCase)(key)) : (0, _lodash.kebabCase)(key);
    var startCased = (0, _lodash.startCase)(key).replace(/\s+/g, '');

    if (_knownCssProperties["default"].all.includes(kebabCased)) {
      if (_typeof(val) !== 'object') {
        acc[prefixed ? startCased : key] = "".concat(val, " !important");
      }

      if (_typeof(val) === 'object') {
        // Overwrite default rules
        Object.entries(val).forEach(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              bp = _ref8[0],
              v = _ref8[1];

          if (bp === sortedBpNamesBySize[0]) {
            acc[prefixed ? startCased : key] = v;
          } else {
            acc["@media (min-width: ".concat(breakpoints[bp], ")")] = _objectSpread({}, acc["@media (min-width: ".concat(breakpoints[bp], ")")], _defineProperty({}, prefixed ? startCased : key, v));
          }
        });
      }
    }

    if (!(0, _isPropValid["default"])(key)) {
      delete modifiedProps[key];
    }

    return acc;
  }, defaultRules);
  var rule = (0, _glamor.css)(cssProps);

  if (base) {
    console.log(children);

    var styledDiv = _react["default"].createElement(inline ? 'span' : 'div', _objectSpread({
      style: {
        fontSize: base,
        display: inline && 'inline-block'
      }
    }, modifiedProps, rule), children);

    return _react["default"].createElement(_react["default"].Fragment, null, styledDiv);
  } // El(s)


  if (_react["default"].isValidElement(children)) {
    var _styledDiv = _react["default"].createElement(inline ? 'span' : 'div', _objectSpread({
      style: {
        fontSize: base,
        display: inline && 'inline-block'
      }
    }, modifiedProps, rule), children);

    return _react["default"].createElement(_react["default"].Fragment, null, _styledDiv);
  } // No el


  var styledChild = _react["default"].createElement(inline ? 'span' : 'div', _objectSpread({
    style: {
      display: inline && 'inline-block'
    }
  }, modifiedProps, rule), children);

  return _react["default"].createElement(_react["default"].Fragment, null, styledChild);
};

var _default = Ook;
exports["default"] = _default;