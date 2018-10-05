'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  // функция устраняет "дребезг" при частом вызове передаваемой функции
  var debounce = function (fun) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  // экспортируемый метод
  window.debounce = debounce;

})();
