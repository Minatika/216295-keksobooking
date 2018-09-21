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

  var adType = document.querySelector('[name=type]');
  var adPrice = document.querySelector('[name=price]');
  var adTimeIn = document.querySelector('[name=timein]');
  var adTimeOut = document.querySelector('[name=timeout]');
  var adRooms = document.querySelector('[name=rooms]');
  var adCapacity = document.querySelector('[name=capacity]');

  // функция-обработчик изменения поля Тип
  var onTypeChange = function () {
    var minPriceSelected = typesOffer[adType.value];
    adPrice.setAttribute('placeholder', minPriceSelected);
    adPrice.setAttribute('min', minPriceSelected);
  };

  // функция-обработчик изменения поля время заезда
  var onTimeInChange = function () {
    adTimeOut.value = adTimeIn.value;
  };

  // функция-обработчик изменения поля выезда
  var onTimeOutChange = function () {
    adTimeIn.value = adTimeOut.value;
  };

  // функция-обработчик изменений поля кол-во комнат
  var onCountChange = function () {
    var rooms = adRooms.value;
    var capacity = adCapacity.value;
    var message = (countParams[rooms].indexOf(capacity) === -1) ?
      'Количество гостей соответствует количеству комнат' : '';
    adCapacity.setCustomValidity(message);
  };

  // функция добавляет обработчики change на поля формы
  var addHandlersFields = function () {
    adType.addEventListener('change', onTypeChange);
    adTimeIn.addEventListener('change', onTimeInChange);
    adTimeOut.addEventListener('change', onTimeOutChange);
    adRooms.addEventListener('change', onCountChange);
    adCapacity.addEventListener('change', onCountChange);
  };

  window.addHandlersFields = addHandlersFields;

})();
