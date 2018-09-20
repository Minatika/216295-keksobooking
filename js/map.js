'use strict';

// управляет пинами и карточками объявлений
(function () {
  var COUNT = 8;
  var mainPinSize = {
    WIDTH: 62,
    HEIGHT: 79
  };

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var mapPinElement = document.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');

  var adForm = document.querySelector('.ad-form');
  var adFieldsets = adForm.querySelectorAll('.ad-form-header, .ad-form__element');
  var adAddress = adForm.querySelector('[name=address]');

  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersFields = mapFiltersForm.querySelectorAll('.map__filter, .map__features');

  var pinCoordLimits = {
    xMin: 0,
    xMax: mapPinsElement.offsetWidth - mapPinElement.offsetWidth,
    yMin: window.data.Y_MIN,
    yMax: window.data.Y_MAX
  };

  // функция активации полей
  var activateBlock = function (arr, element, className) {
    arr.forEach(function (item) {
      item.removeAttribute('disabled');
    });
    element.classList.remove(className);
  };

  // функция вычисления координат для поля Адрес
  var calculateLocation = function () {
    var locationX = Math.round(mainPin.offsetLeft + mainPinSize.WIDTH / 2);
    var locationY = mainPin.offsetTop + mainPinSize.HEIGHT;
    return locationX + ', ' + locationY;
  };

  // функция добавляет метки похожих объявлений
  var getSimilarPins = function () {
    var cards = window.data.getCards(COUNT, mapPinsElement);
    window.pins.renderPins(cards);
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
      activateBlock(adFieldsets, map, 'map--faded');
      activateBlock(mapFiltersFields, adForm, 'ad-form--disabled');
      getSimilarPins();
    }
    adAddress.value = calculateLocation();
    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
    window.form.addHandlersFields();
  };

  // функция удаляет popup из DOMа
  var closePopup = function () {
    window.card.activePin.classList.remove('map__pin--active');
    map.removeChild(window.card.popup);
    window.card.popup = null;
    window.card.popupClose = null;
    window.card.activePin = null;
    document.removeEventListener('keydown', onPopupPressEsc);
  };

  // функция-обработчик клика по кнопке закрытия карточки
  var onPopupCloseClick = function () {
    closePopup();
  };

  // функция-обработчик нажатия на Esc
  var onPopupPressEsc = function (evt) {
    if (evt.keyCode === 27) {
      closePopup();
    }
  };

  // функция-обработчик нажатия на метку похожего объявления
  var onPinClick = function (pinNode, card) {
    return function () {
      if (window.card.popup) {
        closePopup();
      }
      var pinCurrent = pinNode.classList.contains('map__pin') ? pinNode : pinNode.parentElement;
      window.card.renderPopup(card, pinCurrent);
    };
  };

  // функция деактивации
  var deactivateFields = function (arr) {
    arr.forEach(function (item) {
      item.setAttribute('disabled', '');
    });
  };

  // функция изначально приводит страницу в неактивное состоние
  var setInactiveState = function () {
    deactivateFields(adFieldsets);
    deactivateFields(mapFiltersFields);
    adAddress.setAttribute('value', calculateLocation());
  };

  setInactiveState();

  // обработчик захвата мышью метки адреса
  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  // экспортируемый объект
  window.map = {
    map: map,
    mapPinElement: mapPinElement,
    mapPinsElement: mapPinsElement,
    onPopupCloseClick: onPopupCloseClick,
    onPopupPressEsc: onPopupPressEsc,
    onPinClick: onPinClick
  };

})();
