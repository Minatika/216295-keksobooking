'use strict';

// обработчики полей формы
(function () {
  var countParams = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var typesOffer = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  var adTypeElement = document.querySelector('[name=type]');
  var adPriceElement = document.querySelector('[name=price]');
  var adTimeInElement = document.querySelector('[name=timein]');
  var adTimeOutElement = document.querySelector('[name=timeout]');
  var adRoomsElement = document.querySelector('[name=rooms]');
  var adCapacityElement = document.querySelector('[name=capacity]');

  // функция-обработчик изменения поля Тип
  var onTypeChange = function () {
    var minPriceSelected = typesOffer[adTypeElement.value];
    adPriceElement.placeholder = minPriceSelected;
    adPriceElement.min = minPriceSelected;
  };

  // функция-обработчик изменения поля время заезда
  var onTimeInChange = function () {
    adTimeOutElement.value = adTimeInElement.value;
  };

  // функция-обработчик изменения поля выезда
  var onTimeOutChange = function () {
    adTimeInElement.value = adTimeOutElement.value;
  };

  // функция-обработчик изменений поля кол-во комнат
  var onCountChange = function () {
    var rooms = adRoomsElement.value;
    var capacity = adCapacityElement.value;
    var message = (countParams[rooms].indexOf(capacity) === -1) ?
      'Количество гостей соответствует количеству комнат' : '';
    adCapacityElement.setCustomValidity(message);
  };

  // функция добавляет обработчики change на поля формы
  var synchonizeFields = function () {
    adTypeElement.addEventListener('change', onTypeChange);
    adTimeInElement.addEventListener('change', onTimeInChange);
    adTimeOutElement.addEventListener('change', onTimeOutChange);
    adRoomsElement.addEventListener('change', onCountChange);
    adCapacityElement.addEventListener('change', onCountChange);
  };

  // экспортируемый метод
  window.synchonizeFields = synchonizeFields;

})();
