'use strict';

// управляет пинами и карточками объявлений
(function () {
  var COUNT = 8;
  var map = document.querySelector('.map');
  var adFieldsets = document.querySelectorAll('.ad-form-header, .ad-form__element');
  var adAddress = document.querySelector('[name=address]');
  var mapPinsElement = document.querySelector('.map__pins');

  var adForm = document.querySelector('.ad-form');
  var mapFiltersFields = document.querySelectorAll('.map__filter, .map__features');

  // функция заполнения массива похожих объявлений
  var getCards = function (count, parentElement) {
    var arr = [];
    for (var i = 0; i < count; i++) {
      arr.push(window.getCardObject(i, parentElement));
    }
    return arr;
  };

  // функция деактивации полей
  var deactivateFields = function (arr) {
    arr.forEach(function (item) {
      item.setAttribute('disabled', '');
    });
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
    window.renderPins(cards);
  };

  // функция приводит страницу в активное состоние
  var setActiveState = function () {
    activateBlock(adFieldsets, map, 'map--faded');
    activateBlock(mapFiltersFields, adForm, 'ad-form--disabled');
    getSimilarPins();
  };

  // функция изначально приводит страницу в неактивное состоние
  var setInactiveState = function () {
    deactivateFields(adFieldsets);
    deactivateFields(mapFiltersFields);
    adAddress.setAttribute('value', window.calculateLocation());
  };

  // экспортируемый объект
  window.setActiveState = setActiveState;

  setInactiveState();

})();
