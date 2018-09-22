'use strict';

// управляет пинами и карточками объявлений
(function () {
  var COUNT = 8;

  var mapElement = document.querySelector('.map');
  var adFieldsetsElements = document.querySelectorAll('.ad-form-header, .ad-form__element');
  var adAddressElement = document.querySelector('[name=address]');
  var mapPinsElement = document.querySelector('.map__pins');

  var adFormElement = document.querySelector('.ad-form');
  var mapFiltersFieldsElements = document.querySelectorAll('.map__filter, .map__features');

  var isgetSimilar = false;

  // функция заполнения массива похожих объявлений
  var getCards = function (count, parentElement) {
    var arr = [];
    for (var i = 0; i < count; i++) {
      arr.push(window.getCardObject(i, parentElement));
    }
    isgetSimilar = true;
    return arr;
  };

  // функция деактивации полей
  var deactivateFields = function (arr, element, className) {
    arr.forEach(function (item) {
      item.setAttribute('disabled', '');
    });
    element.classList.add(className);
  };

  // функция активации полей
  var activateBlock = function (arr, element, className) {
    arr.forEach(function (item) {
      item.removeAttribute('disabled');
    });
    element.classList.remove(className);
  };

  // функция добавляет метки похожих объявлений
  var getSimilarPins = function () {
    var cards = getCards(COUNT, mapPinsElement);
    window.pins.renderPins(cards);
  };

  // функция приводит страницу в активное состоние
  var setActiveState = function () {
    activateBlock(adFieldsetsElements, mapElement, 'map--faded');
    activateBlock(mapFiltersFieldsElements, adFormElement, 'ad-form--disabled');
    getSimilarPins();
  };

  // функция изначально приводит страницу в неактивное состоние
  var setInactiveState = function () {
    deactivateFields(adFieldsetsElements, mapElement, 'map--faded');
    deactivateFields(mapFiltersFieldsElements, adFormElement, 'ad-form--disabled');
    if (isgetSimilar) {
      window.pins.deletePins();
      window.card.closePopup();
      isgetSimilar = false;
    }
    window.main.resetMainPin();
    adAddressElement.value = window.main.getCoordsMainPin();
  };

  setInactiveState();

  // экспортируемый объект
  window.map = {
    setActiveState: setActiveState,
    setInactiveState: setInactiveState
  };

})();
