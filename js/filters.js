'use strict';

// работа фильтра пинов
(function () {
  var COUNT_CARDS = 5;
  var priceParams = {
    MIN: 10000,
    MAX: 50000
  };

  var filtersFormElement = document.querySelector('.map__filters');
  var typeFilterElement = filtersFormElement.querySelector('[name=housing-type]');
  var priceFilterElement = filtersFormElement.querySelector('[name=housing-price]');
  var roomsFilterElement = filtersFormElement.querySelector('[name=housing-rooms]');
  var guestsFilterElement = filtersFormElement.querySelector('[name=housing-guests]');
  var featuresFilterElements = filtersFormElement.querySelectorAll('.map__checkbox');
  var featuresContainerElement = filtersFormElement.querySelector('.map__features');
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

  // функция-обработчик изменений фильтров-селектов
  var onSelectChange = function (evt) {
    var property = getPropertyFilter(evt.target.name);
    currentFilter[property] = evt.target.value;
    updatePins();
  };

  // функция-обработчик клика по фильтру удобств
  var onFeaturesClick = function () {
    currentFilter.features = getCheckedElements(featuresFilterElements);
    updatePins();
  };

  // функция активации фильтров
  var enableFilters = function () {
    typeFilterElement.addEventListener('change', window.debounce(onSelectChange));
    priceFilterElement.addEventListener('change', window.debounce(onSelectChange));
    roomsFilterElement.addEventListener('change', window.debounce(onSelectChange));
    guestsFilterElement.addEventListener('change', window.debounce(onSelectChange));
    featuresContainerElement.addEventListener('click', window.debounce(onFeaturesClick));
  };

  // функция деактивации фильтров
  var disableFilters = function () {
    typeFilterElement.removeEventListener('change', onSelectChange);
    priceFilterElement.removeEventListener('change', onSelectChange);
    roomsFilterElement.removeEventListener('change', onSelectChange);
    guestsFilterElement.removeEventListener('change', onSelectChange);
    featuresContainerElement.removeEventListener('click', onFeaturesClick);
  };

  // функция фильтрует массив объектов по заданному объекту
  var isfilteredByParam = function (card, param, value) {
    return card.offer[param] === value ? true : false;
  };

  // функция фильтрует массив по цене
  var isFilteredByPrice = function (card, value) {
    var check = false;
    var price = card.offer.price;
    switch (value) {
      case 'middle':
        if (price >= priceParams.MIN && price <= priceParams.MAX) {
          check = true;
        }
        break;
      case 'low':
        if (price < priceParams.MIN) {
          check = true;
        }
        break;
      case 'high':
        if (price > priceParams.MAX) {
          check = true;
        }
        break;
      default:
        check = false;
    }
    return check;
  };

  // фильтрует массив по удобствам
  var isFilteredByFeatures = function (card, arr) {
    var check = true;
    arr.forEach(function (item) {
      if (!card.offer.features.includes(item)) {
        check = false;
      }
    });
    return check;
  };

  // функция сравнивает объект фильтров с начальными значениями
  var compareFilters = function () {
    var arr = [];
    for (var prop in currentFilter) {
      if (currentFilter[prop] !== initialFilter[prop]) {
        arr.push(prop);
      }
    }
    return arr;
  };

  // функция проверяет, соответствует ли карточка фильтрам
  var isFilteredCard = function (arr) {
    return function (card) {
      var isFiltered = true;
      arr.forEach(function (item) {
        switch (item) {
          case 'price':
            isFiltered = isFiltered && isFilteredByPrice(card, currentFilter[item]);
            break;
          case 'features':
            isFiltered = isFiltered && isFilteredByFeatures(card, currentFilter[item]);
            break;
          default:
            isFiltered = isFiltered && isfilteredByParam(card, item, currentFilter[item]);
        }
      });
      return isFiltered;
    };
  };

  // функция обновляет метки объявлений
  var updatePins = function () {
    var diff = compareFilters();
    cards = window.map.getCards();
    window.pins.deletePins();
    window.card.closePopup();
    cards = cards.filter(isFilteredCard(diff));
    if (cards.length > COUNT_CARDS) {
      window.utils.shuffleArray(cards);
      cards.splice(COUNT_CARDS, cards.length - COUNT_CARDS);
    }
    window.pins.renderPins(cards);
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
    disableFilters: disableFilters,
    updatePins: updatePins,
    resetFilters: resetFilters
  };

})();
