!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("Player")):"function"==typeof define&&define.amd?define(["Player"],t):"object"==typeof exports?exports["xgplayer-logger"]=t(require("Player")):e["xgplayer-logger"]=t(e.Player)}(window,(function(e){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(2),l=n(3),f=(o=l)&&o.__esModule?o:{default:o};var a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n._configs=Object.assign({},{level:"debug",historyMax:100},e),n._history=[],n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"beforeCreate",value:function(){var e=this;Object.keys(f.default).forEach((function(t){var n=f.default[t];e[t]=e._log.bind(e,f.default[n],t)}))}},{key:"setLevel",value:function(e){t.isLevelInvalid(e)&&(this._level=e)}},{key:"_log",value:function(e,t){for(var n=arguments.length,o=Array(n>2?n-2:0),r=2;r<n;r++)o[r-2]=arguments[r];var i;e<this.level&&(i=console).log.apply(i,["["+t+"] "].concat(o));this._history.length<this._configs.historyMax&&(this._history.push([t].concat(o)),this.emit&&this.emit.apply(this,["log",t].concat(o)))}},{key:"destroy",value:function(){this._history=[]}},{key:"level",get:function(){if(!t.isLevelInvalid(this._configs.level))return f.default.debug;var e=this._configs.level;return"string"===e?f.default[e]:this._configs.level}}],[{key:"isLevelInvalid",value:function(e){var t=void 0===e?"undefined":r(e),n=Object.keys(f.default);return"string"===t&&n.indexOf(e)>=0&&("number"===t&&e>=0&&e<=4)}}]),t}(u.BasePlugin);t.default=a,e.exports=t.default},function(t,n){t.exports=e},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={error:0,warn:1,info:2,verbose:3,debug:4},e.exports=t.default}])}));