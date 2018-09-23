'use strict';

(function () {

  // функция получения рандомного значения между min и max
  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // функция случайной сортировки
  var shuffleArray = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var random = getRandomValue(0, i);
      var temp = arr[i];
      arr[i] = arr[random];
      arr[random] = temp;
    }
    return arr;
  };

  // экспортируемый объект
  window.utils = {
    shuffleArray: shuffleArray,
    getRandomValue: getRandomValue
  };

})();
