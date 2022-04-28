'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


exports.default = function (babel) {
  return {
    visitor: {
      Program: function Program(path, state) {
        const disableHMR = "if (module.hot) {module.hot.accept(function () {window.location.reload();});}\n"
        path.pushContainer('body', babel.parse(disableHMR).program.body[0]);
      }
    }
  };
};
