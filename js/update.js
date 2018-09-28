'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var errorTemplateElement = document.querySelector('#error')
      .content
      .querySelector('.error');

  var cards = [];

  // функция обновляет метки объявлений
  var updatePins = function () {
    var temp = [];
    window.pins.deletePins();
    window.card.closePopup();
    temp = filterByType(cards, window.filters.currentFilter.type);
    temp = filterByPrice(temp, window.filters.currentFilter.price);
    temp = filterByRooms(temp, window.filters.currentFilter.rooms);
    temp = filterByGuests(temp, window.filters.currentFilter.guests);
    window.pins.renderPins(temp);
  };

  // функция-обработчик изменения фильтров
  window.filters.currentFilter.onChange = function () {
    updatePins();
  };

  // функция фильтрует массив объектов по типу
  var filterByType = function (arr, param) {
    var result = arr.filter(function (item) {
      return param === 'any' ? item : item.offer.type === param;
    }).map(function (item) {
      return item;
    });
    return result;
  };

  var checkValueInRange = function (param) {
    return function (item) {
      var check = false;
      var price = item.offer.price;
      switch (param) {
        case 'any':
          check = true;
          break;
        case 'middle':
          if (price >= 10000 && price <= 50000) {
            check = true;
          }
          break;
        case 'low':
          if (price < 10000) {
            check = true;
          }
          break;
        case 'high':
          if (price > 50000) {
            check = true;
          }
          break;
        default:
          check = false;
      }
      return check;
    };
  };

  // функция фильтрует массив объектов по цене
  var filterByPrice = function (arr, param) {
    var result = arr.filter(checkValueInRange(param)).map(function (item) {
      return item;
    });
    return result;
  };

  // функция фильтрует массив объектов по количеству комнат
  var filterByRooms = function (arr, param) {
    var result = arr.filter(function (item) {
      return param === 'any' ? item : item.offer.rooms === parseInt(param, 10);
    }).map(function (item) {
      return item;
    });
    return result;
  };

  // функция фильтрует массив объектов по количеству гостей
  var filterByGuests = function (arr, param) {
    var result = arr.filter(function (item) {
      return param === 'any' ? item : item.offer.guests === parseInt(param, 10);
    }).map(function (item) {
      return item;
    });
    return result;
  };

  // функция-коллбэк ошибки получения данных с сервера
  var onError = function (errorMessage) {
    window.utils.renderMessageElement(mainElement, errorTemplateElement, errorMessage);
    window.map.setInactiveState();
  };

  // функция-коллбэк успешного получения данных с сервера
  var onLoad = function (data) {
    cards = data;
  };

  // загружаются данные с сервера
  window.backend.load(onLoad, onError);

  // экспортируемый объект
  window.updatePins = updatePins;
})();
