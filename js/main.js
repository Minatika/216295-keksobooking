'use strict';

// события метки адреса нового объявления
(function () {
  var mainPinSize = {
    WIDTH: 62,
    HEIGHT: 79
  };

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var adAddress = document.querySelector('[name=address]');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinElement = document.querySelector('.map__pin');

  var pinCoordLimits = {
    xMin: 0,
    xMax: mapPinsElement.offsetWidth - mapPinElement.offsetWidth,
    yMin: 130,
    yMax: 630
  };

  // функция возвращает число в пределах заданного диапазона
  var getValueInRange = function (value, min, max) {
    if (value < min) {
      value = min;
    }
    if (value > max) {
      value = max;
    }
    return value;
  };

  // функция возвращает координаты в пределах ограничений
  var getCoordsInParent = function (coordX, coordY, limit) {
    var coords = {
      x: getValueInRange(coordX, limit.xMin, limit.xMax),
      y: getValueInRange(coordY, limit.yMin, limit.yMax)
    };
    return coords;
  };

  // функция вычисления координат для поля Адрес
  var calculateLocation = function () {
    var locationX = Math.round(mainPin.offsetLeft + mainPinSize.WIDTH / 2);
    var locationY = mainPin.offsetTop + mainPinSize.HEIGHT;
    return locationX + ', ' + locationY;
  };

  // функция-обработчик захвата мышью метки адреса
  var onMainPinMouseDown = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // функция-обработчик перемещения мышью метки адреса
    var onMainPinMouseMove = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var changedCoords = getCoordsInParent(mainPin.offsetLeft - shift.x, mainPin.offsetTop - shift.y, pinCoordLimits);
      mainPin.style.top = (changedCoords.y) + 'px';
      mainPin.style.left = (changedCoords.x) + 'px';
      adAddress.value = calculateLocation();
    };

    // функция-обработчик отпускания мышью метки адреса
    var onMainPinMouseUp = function () {
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    if (map.classList.contains('map--faded')) {
      window.setActiveState();
    }
    adAddress.value = calculateLocation();
    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
    window.addHandlersFields();
  };

  // экспортируемый метод
  window.calculateLocation = calculateLocation;

  // обработчик захвата мышью метки адреса
  mainPin.addEventListener('mousedown', onMainPinMouseDown);

})();
