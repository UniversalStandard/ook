"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.OokConfig = void 0;

var _react = _interopRequireDefault(require("react"));

var _knownCssProperties = _interopRequireDefault(require("known-css-properties"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mqpacker = _interopRequireDefault(require("mqpacker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var kebabCase = require('lodash/kebabCase');

var postcss = require('postcss'); // Ook! Ook! 🍌


var OokContext = _react["default"].createContext();

OokContext.displayName = 'Ook';

var OokConfig = function OokConfig(_ref) {
  var _ref$breakpoints = _ref.breakpoints,
      breakpoints = _ref$breakpoints === void 0 ? {} : _ref$breakpoints,
      children = _ref.children;
  return _react["default"].createElement(OokContext.Provider, {
    value: {
      breakpoints: breakpoints
    }
  }, _react["default"].createElement(OokContext.Consumer, null, function (ctx) {
    return children;
  }));
};

exports.OokConfig = OokConfig;
var states = ['active', 'hover', 'focus', 'visited'];
var notValidCSSProperties = ['children', 'el', 'src'];

var Ook = function Ook(_ref2) {
  var _OokContext$, _OokContext$Consumer, _OokContext$Consumer$;

  var children = _ref2.children,
      _ref2$el = _ref2.el,
      el = _ref2$el === void 0 ? 'div' : _ref2$el,
      props = _objectWithoutProperties(_ref2, ["children", "el"]);

  var breakpoints = OokContext['1'] ? (_OokContext$ = OokContext['1']) === null || _OokContext$ === void 0 ? void 0 : _OokContext$.breakpoints : (OokContext === null || OokContext === void 0 ? void 0 : (_OokContext$Consumer = OokContext.Consumer) === null || _OokContext$Consumer === void 0 ? void 0 : (_OokContext$Consumer$ = _OokContext$Consumer._currentValue) === null || _OokContext$Consumer$ === void 0 ? void 0 : _OokContext$Consumer$.breakpoints) ? OokContext.Consumer._currentValue.breakpoints : {};
  var sortedBpNamesBySize = Object.keys(breakpoints).sort(function (a, b) {
    return parseInt(breakpoints[a], 10) - parseInt(breakpoints[b], 10);
  });
  var cssProps = Object.entries(props).reduce(function (acc, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        val = _ref4[1];

    if (notValidCSSProperties.includes(key)) return acc;
    var prefixed = false;

    if (key.match(/^_/)) {
      prefixed = true;
    }

    var keb = prefixed ? "-".concat(kebabCase(key)) : kebabCase(key); // Pseudo classes

    if (states.includes(key) || key === 'after' || key === 'before') {
      Object.entries(val).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            cssProp = _ref6[0],
            _v = _ref6[1];

        if (cssProp === 'content' && !_v.trim()) {
          _v = "''";
        }

        var _key = key === 'after' || key === 'before' ? "&::".concat(key) : "&:".concat(key);

        var keb = prefixed ? "-".concat(kebabCase(cssProp)) : kebabCase(cssProp);

        if (_knownCssProperties["default"].all.includes(keb)) {
          // TODO: A bunch of this is duplicated below. Should probably be combined into a function.
          if (_typeof(_v) === 'object') {
            Object.entries(_v).forEach(function (_ref7) {
              var _ref8 = _slicedToArray(_ref7, 2),
                  bp = _ref8[0],
                  v = _ref8[1];

              if (bp === sortedBpNamesBySize[0]) {
                acc += "".concat(_key, " { ").concat(keb, ": ").concat(v, "; }");
              } else {
                acc += "@media (min-width: ".concat(breakpoints[bp], ") { ").concat(_key, " { ").concat(keb, ": ").concat(v, "; } }");
              }
            });
          }

          if (typeof _v === 'string') {
            acc += "".concat(_key, " { ").concat(keb, ": ").concat(_v, "; }");
          }
        }
      });
    } // Generic css and media queries


    if (_knownCssProperties["default"].all.includes(keb)) {
      if (_typeof(val) === 'object') {
        // Overwrite global breakpoint rules
        Object.entries(val).forEach(function (_ref9) {
          var _ref10 = _slicedToArray(_ref9, 2),
              bp = _ref10[0],
              v = _ref10[1];

          if (bp === sortedBpNamesBySize[0]) {
            acc += "".concat(keb, ": ").concat(v, ";");
          } else {
            acc += "@media (min-width: ".concat(breakpoints[bp], ") { ").concat(keb, ": ").concat(v, "; }");
          }
        });
      }

      if (typeof val === 'string') {
        acc += "".concat(keb, ": ").concat(val, ";");
      }
    }

    return acc;
  }, '');
  console.log(233, cssProps);
  var S = (0, _styledComponents["default"])(el).withConfig({
    displayName: "ook__S",
    componentId: "sc-1hrrez1-0"
  })(["", ""], _mqpacker["default"].pack(cssProps).css);
  return _react["default"].createElement(S, props, children);
};

var _default = Ook;
exports["default"] = _default;
