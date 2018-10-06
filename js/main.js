'use strict';

// события метки адреса нового объявления
(function () {
  var mainPinSize = {
    WIDTH: 62,
    HEIGHT: 79
  };

  var mapElement = document.querySelector('.map');
  var mainPinElement = mapElement.querySelector('.map__pin--main');
  var adAddressElement = document.querySelector('[name=address]');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinElement = mapPinsElement.querySelector('.map__pin');

  var pinCoordLimits = {
    xMin: 0,
    xMax: mapPinsElement.offsetWidth - mapPinElement.offsetWidth,
    yMin: 130 - mainPinSize.HEIGHT,
    yMax: 630 - mainPinSize.HEIGHT
  };

  var initialMainPin = {
    x: mainPinElement.style.left,
    y: mainPinElement.style.top
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

  // функция вычисления координат MainPin
  var getCoordsMainPin = function () {
    var locationX = Math.round(mainPinElement.offsetLeft + mainPinSize.WIDTH / 2);
    var locationY = mainPinElement.offsetTop + mainPinSize.HEIGHT;
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
      var changedCoords = getCoordsInParent(mainPinElement.offsetLeft - shift.x, mainPinElement.offsetTop - shift.y, pinCoordLimits);
      mainPinElement.style.top = (changedCoords.y) + 'px';
      mainPinElement.style.left = (changedCoords.x) + 'px';
      adAddressElement.value = getCoordsMainPin();
    };

    // функция-обработчик отпускания мышью метки адреса
    var onMainPinMouseUp = function () {
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    if (mapElement.classList.contains('map--faded')) {
      window.map.setActiveState();
    }
    adAddressElement.value = getCoordsMainPin();
    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
    window.synchonizeFields();
  };

  // функция переводит метку в начальное положение
  var resetMainPin = function () {
    mainPinElement.style.top = initialMainPin.y;
    mainPinElement.style.left = initialMainPin.x;
  };

  // обработчик захвата мышью метки адреса
  mainPinElement.addEventListener('mousedown', onMainPinMouseDown);

  // экспортируемый объект
  window.main = {
    getCoordsMainPin: getCoordsMainPin,
    resetMainPin: resetMainPin
  };

})();
