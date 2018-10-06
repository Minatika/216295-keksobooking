'use strict';

// обработчики полей формы
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var CONTAINER_CLASS = 'ad-form__photo';

  var photoParams = {
    WIDTH: 70,
    HEIGHT: 70,
    ALT_TEXT: 'Фотография жилья'
  };

  var initialAvatar = {
    WIDTH: 40,
    HEIGHT: 44,
    SRC: 'img/muffin-grey.svg'
  };

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

  var avatarChooserElement = adFormElement.querySelector('[name=avatar]');
  var imagesChooserElement = adFormElement.querySelector('[name=images]');
  var avatarElement = adFormElement.querySelector('.ad-form-header__preview img');
  var imagesContainerElement = adFormElement.querySelector('.ad-form__photo-container');

  var images = [];

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

  // функция удаления фотографий жилья
  var deleteImages = function () {
    images.forEach(function (item) {
      imagesContainerElement.removeChild(item);
    });
    images = [];
  };

  // функция очищает поля формы
  var clearFields = function () {
    window.utils.clearCheckboxes(adFeaturesElements);
    resetSelects(adSelectsElements);
    adTitleElement.value = '';
    adPriceElement.value = '';
    adDescriptionElement.value = '';
    changeImageAttributes(avatarElement, initialAvatar);
    deleteImages();
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

  // функция меняет атрибуты изображения
  var changeImageAttributes = function (elementNode, obj) {
    elementNode.src = obj.SRC;
    elementNode.width = obj.WIDTH;
    elementNode.height = obj.HEIGHT;
  };

  // функция добавляет фото в DOM
  var renderPhoto = function (elementNode, value) {
    var preview = document.createElement('div');
    preview.classList.add(CONTAINER_CLASS);
    preview.appendChild(window.utils.renderPhoto(value, photoParams));
    images.push(preview);
    elementNode.appendChild(preview);
  };

  // функция обрабатывает один файл, выбранный в поле input
  var readFile = function (file, elementNode) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        if (elementNode.nodeName === 'IMG') {
          photoParams.SRC = reader.result;
          changeImageAttributes(elementNode, photoParams);
        } else {
          renderPhoto(elementNode, reader.result);
        }
      });
      reader.readAsDataURL(file);
    }
  };

  // функция-обработчик изменения состояния поля загрузки файлов
  var onInputFileChange = function (elementNode) {
    return function (evt) {
      if (evt.target.multiple) {
        var files = evt.target.files;
        for (var i = 0; i < files.length; i++) {
          readFile(files[i], elementNode);
        }
      } else {
        var file = evt.target.files[0];
        readFile(file, elementNode);
      }
    };
  };

  // обработчик отправки формы объявления
  adFormElement.addEventListener('submit', onFormSubmit);

  // обработчик изменения фото аватара
  avatarChooserElement.addEventListener('change', onInputFileChange(avatarElement));

  // обработчик изменения фотографии жилья
  imagesChooserElement.addEventListener('change', onInputFileChange(imagesContainerElement));

  // экспортируемый метод
  window.synchonizeFields = synchonizeFields;

})();
