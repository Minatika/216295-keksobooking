'use strict';

// отрисовывает карточку попап
(function () {
  var photoParams = {
    IMAGE_WIDTH: 45,
    IMAGE_HEIGHT: 40,
    ALT_TEXT: 'Фотография жилья',
    CLASS_NAME: 'popup__photo'
  };

  var FEATURE_CLASS = 'popup__feature';
  var popup;
  var popupClose;
  var activePin;

  var cardTemplateElement = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var mapFilters = document.querySelector('.map__filters-container');

  // функция создания ноды элемента li
  var renderFeatures = function (value) {
    var li = document.createElement('li');
    li.classList.add(FEATURE_CLASS, FEATURE_CLASS + '--' + value);
    return li;
  };

  // функция создания ноды изображения img
  var renderPhoto = function (value) {
    var image = document.createElement('img');
    image.classList.add(photoParams.CLASS_NAME);
    image.src = value;
    image.width = photoParams.IMAGE_WIDTH;
    image.height = photoParams.IMAGE_HEIGHT;
    image.alt = photoParams.ALT_TEXT;
    return image;
  };

  // функция создания в DOMе объявления и заполнения его данными
  var renderCard = function (card) {
    var cardElement = cardTemplateElement.cloneNode(true);
    var avatarElement = cardElement.querySelector('.popup__avatar');
    window.card.popupClose = cardElement.querySelector('.popup__close');
    var titleElement = cardElement.querySelector('.popup__title');
    var addressElemnt = cardElement.querySelector('.popup__text--address');
    var priceElement = cardElement.querySelector('.popup__text--price');
    var typeElement = cardElement.querySelector('.popup__type');
    var capacityElement = cardElement.querySelector('.popup__text--capacity');
    var timeElement = cardElement.querySelector('.popup__text--time');
    var featuresContainer = cardElement.querySelector('.popup__features');
    var descriptionElement = cardElement.querySelector('.popup__description');
    var photosContainer = cardElement.querySelector('.popup__photos');
    avatarElement.src = card.avatar;
    titleElement.textContent = card.title;
    addressElemnt.textContent = card.address;
    priceElement.textContent = card.price + String.fromCharCode('8381') + '/ночь';
    typeElement.textContent = window.data.typesOffer[card.type].DESIGNATION;
    capacityElement.textContent = card.rooms + ' комнаты для ' + card.guests + ' гостей';
    timeElement.textContent = 'Заезд после ' + card.checkin + ', выезд до ' + card.checkout;
    if (card.features.length) {
      for (var i = 0; i < card.features.length; i++) {
        featuresContainer.appendChild(renderFeatures(card.features[i]));
      }
    } else {
      cardElement.removeChild(featuresContainer);
    }
    descriptionElement.textContent = card.description;
    for (i = 0; i < card.photos.length; i++) {
      photosContainer.appendChild(renderPhoto(card.photos[i]));
    }
    window.card.popup = cardElement;
    window.card.popupClose.addEventListener('click', window.map.onPopupCloseClick);
    document.addEventListener('keydown', window.map.onPopupPressEsc);
    return cardElement;
  };

  // функция отрисовки карточки похожего объявления
  var renderCardElement = function (card) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderCard(card));
    window.map.map.insertBefore(fragment, mapFilters);
  };

  // функция отрисовки попапа
  var renderPopup = function (card, pin) {
    renderCardElement(card);
    pin.classList.add('map__pin--active');
    window.card.activePin = pin;
  };

  // экспортируемый объект
  window.card = {
    popup: popup,
    popupClose: popupClose,
    activePin: activePin,
    renderPopup: renderPopup
  };

})();
