'use strict';

// работа фильтра пинов
(function () {
  var typeFilterElement = document.querySelector('[name=housing-type]');
  var priceFilterElement = document.querySelector('[name=housing-price]');
  var roomsFilterElement = document.querySelector('[name=housing-rooms]');
  var guestsFilterElement = document.querySelector('[name=housing-guests]');
  var featuresFilterElements = document.querySelectorAll('.map__checkbox');
  var featuresContainerElement = document.querySelector('.map__features');

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
    features: getCheckedElements(featuresFilterElements),
    onChange: function () {}
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
    currentFilter.onChange();
  };

  // функция-обработчик клика по фильтру удобств
  var onFeaturesClick = function () {
    currentFilter.features = getCheckedElements(featuresFilterElements);
    currentFilter.onChange();
  };

  // функция активации фильтров
  var activateFilters = function () {
    typeFilterElement.addEventListener('change', onSelectChange);
    priceFilterElement.addEventListener('change', onSelectChange);
    roomsFilterElement.addEventListener('change', onSelectChange);
    guestsFilterElement.addEventListener('change', onSelectChange);
    featuresContainerElement.addEventListener('click', onFeaturesClick);
  };

  // функция деактивации фильтров
  var deactivateFilters = function () {
    typeFilterElement.removeEventListener('change', onSelectChange);
    priceFilterElement.removeEventListener('change', onSelectChange);
    roomsFilterElement.removeEventListener('change', onSelectChange);
    guestsFilterElement.removeEventListener('change', onSelectChange);
    featuresContainerElement.removeEventListener('click', onFeaturesClick);
  };

  // экспортируемый метод
  window.filters = {
    activateFilters: activateFilters,
    deactivateFilters: deactivateFilters,
    currentFilter: currentFilter
  };

})();
