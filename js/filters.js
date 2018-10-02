'use strict';

// работа фильтра пинов
(function () {
  var COUNT_CARDS = 5;

  var priceParams = {
    'low': {
      MIN: 0,
      MAX: 9999
    },
    'middle': {
      MIN: 10000,
      MAX: 50000
    },
    'high': {
      MIN: 50001,
      MAX: Infinity
    }
  };

  var filtersFormElement = document.querySelector('.map__filters');
  var typeFilterElement = filtersFormElement.querySelector('[name=housing-type]');
  var priceFilterElement = filtersFormElement.querySelector('[name=housing-price]');
  var roomsFilterElement = filtersFormElement.querySelector('[name=housing-rooms]');
  var guestsFilterElement = filtersFormElement.querySelector('[name=housing-guests]');
  var featuresFilterElements = filtersFormElement.querySelectorAll('.map__checkbox');
  var filtersSelectsElements = filtersFormElement.querySelectorAll('select');

  var cards = [];

  var initialFilter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: []
  };

  // функция возвращает массив отмеченных удобств
  var getCheckedElements = function (arr) {
    var result = [];
    arr.forEach(function (item) {
      if (item.checked) {
        result.push(item.value);
      }
    });
    return result;
  };

  var currentFilter = {
    type: typeFilterElement.value,
    price: priceFilterElement.value,
    rooms: roomsFilterElement.value,
    guests: guestsFilterElement.value,
    features: getCheckedElements(featuresFilterElements)
  };

  // функция возвращает название свойства объекта
  var getPropertyFilter = function (name) {
    var arr = name.split('-');
    return arr[arr.length - 1];
  };

  // функция обновляет объект с текущим набором фильтров
  var updateCurrentFilter = function (obj) {
    if (obj.classList.contains('map__filter')) {
      var property = getPropertyFilter(obj.name);
      currentFilter[property] = obj.value;
    } else {
      currentFilter.features = getCheckedElements(featuresFilterElements);
    }
  };

  // функция-обработчик изменения в форме фильтров
  var onFormChange = function (arr) {
    return function (evt) {
      updateCurrentFilter(evt.target);
      window.pins.updatePins(arr);
    };
  };

  // функция активации фильтров
  var enableFilters = function (arr) {
    filtersFormElement.addEventListener('change', window.debounce(onFormChange(arr)));
  };

  // функция фильтрует массив объектов по заданному объекту
  var isfilteredByParam = function (param, value) {
    return param === value;
  };

  // функция фильтрует массив по цене
  var isFilteredByPrice = function (price, value) {
    return price >= priceParams[value].MIN && price <= priceParams[value].MAX;
  };

  // фильтрует массив по удобствам
  var isFilteredByFeatures = function (features, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (!features.includes(arr[i])) {
        return false;
      }
    }
    return true;
  };

  // если значение фильтра отличается от начального, функция запускает по нему проверку
  var checkFilter = function (param, fun, value) {
    return currentFilter[param] === initialFilter[param] ? true : fun(value, currentFilter[param]);
  };

  // функция проверяет, соответствует ли карточка фильтрам
  var isFilteredCard = function (card) {
    return checkFilter('type', isfilteredByParam, card.offer.type)
    && checkFilter('price', isFilteredByPrice, card.offer.price)
    && checkFilter('rooms', isfilteredByParam, card.offer.rooms.toString())
    && checkFilter('guests', isfilteredByParam, card.offer.guests.toString())
    && checkFilter('features', isFilteredByFeatures, card.offer.features);
  };

  // функция фильтрует массив объектов
  var filterArray = function (arr) {
    cards = arr.filter(isFilteredCard);
    if (cards.length > COUNT_CARDS) {
      window.utils.shuffleArray(cards);
      cards.splice(COUNT_CARDS, cards.length - COUNT_CARDS);
    }
    return cards;
  };

  // функция сброса значений селектов
  var resetSelects = function (arr) {
    arr.forEach(function (element) {
      element.value = initialFilter[getPropertyFilter(element.name)];
    });
  };

  // функция сбрасывает фильтры
  var resetFilters = function () {
    resetSelects(filtersSelectsElements);
    window.utils.clearCheckboxes(featuresFilterElements);
  };

  // экспортируемый объект
  window.filters = {
    enableFilters: enableFilters,
    resetFilters: resetFilters,
    filterArray: filterArray
  };

})();
