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

  var adFormElement = document.querySelector('.ad-form');
  var adResetElement = adFormElement.querySelector('.ad-form__reset');
  var adTitleElement = adFormElement.querySelector('[name=title]');
  var adTypeElement = adFormElement.querySelector('[name=type]');
  var adPriceElement = adFormElement.querySelector('[name=price]');
  var adTimeInElement = adFormElement.querySelector('[name=timein]');
  var adTimeOutElement = adFormElement.querySelector('[name=timeout]');
  var adRoomsElement = adFormElement.querySelector('[name=rooms]');
  var adCapacityElement = adFormElement.querySelector('[name=capacity]');
  var adFeaturesElements = adFormElement.querySelectorAll('[name=features]');
  var adDescriptionElement = adFormElement.querySelector('[name=description]');
  var adSelectsElements = adFormElement.querySelectorAll('select');

  var mainElement = document.querySelector('main');
  var successTemplateElement = document.querySelector('#success')
      .content
      .querySelector('.success');
  var errorTemplateElement = document.querySelector('#error')
      .content
      .querySelector('.error');

  var initialValuesSelects = {
    'type': 'flat',
    'timein': '12:00',
    'timeout': '12:00',
    'rooms': '1',
    'capacity': '1'
  };

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

  // функция сброса значений селектов
  var resetSelects = function (arr) {
    arr.forEach(function (element) {
      element.value = initialValuesSelects[element.name];
    });
  };

  // функция очистки блока удобств
  var clearFeatures = function (arr) {
    arr.forEach(function (item) {
      if (item.checked) {
        item.checked = false;
      }
    });
  };

  // функция очищает поля формы
  var clearFields = function () {
    clearFeatures(adFeaturesElements);
    resetSelects(adSelectsElements);
    adTitleElement.value = '';
    adPriceElement.value = '';
    adDescriptionElement.value = '';
  };

  // функция-обработчик клика на кнопку очистить
  var onResetClick = function () {
    clearFields();
    window.map.setInactiveState();
  };

  // функция добавляет обработчики для синхронизации полей формы
  var synchonizeFields = function () {
    adTypeElement.addEventListener('change', onTypeChange);
    adTimeInElement.addEventListener('change', onTimeInChange);
    adTimeOutElement.addEventListener('change', onTimeOutChange);
    adRoomsElement.addEventListener('change', onCountChange);
    adCapacityElement.addEventListener('change', onCountChange);
    adResetElement.addEventListener('click', onResetClick);
  };

  // функция-коллбэк ошибки при отправке формы
  var onError = function (errorMessage) {
    window.utils.renderMessageElement(mainElement, errorTemplateElement, errorMessage);
  };

  // функция-коллбэк успешной отправки формы
  var onLoad = function () {
    clearFields();
    window.map.setInactiveState();
    window.utils.renderMessageElement(mainElement, successTemplateElement);
  };

  // функция-обработчик отправки формы
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adFormElement), onLoad, onError);
  };

  // обработчик отправки формы объявления
  adFormElement.addEventListener('submit', onFormSubmit);

  // экспортируемый метод
  window.synchonizeFields = synchonizeFields;

})();
