'use strict';

// отрисовка и события попапа
(function () {
  var FEATURE_CLASS = 'popup__feature';
  var ESC_KEYCODE = 27;

  var photoParams = {
    IMAGE_WIDTH: 45,
    IMAGE_HEIGHT: 40,
    ALT_TEXT: 'Фотография жилья',
    CLASS_NAME: 'popup__photo'
  };

  var typesOffer = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var popup;
  var popupClose;

  var cardTemplateElement = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var mapFiltersElement = document.querySelector('.map__filters-container');
  var mapElement = document.querySelector('.map');

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
  var renderCard = function (card, pin) {
    var cardElement = cardTemplateElement.cloneNode(true);
    var avatarElement = cardElement.querySelector('.popup__avatar');
    popupClose = cardElement.querySelector('.popup__close');
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
    typeElement.textContent = typesOffer[card.type];
    capacityElement.textContent = card.rooms + ' комнаты для ' + card.guests + ' гостей';
    timeElement.textContent = 'Заезд после ' + card.checkin + ', выезд до ' + card.checkout;
    if (card.features.length) {
      card.features.forEach(function (item) {
        featuresContainer.appendChild(renderFeatures(item));
      });
    } else {
      cardElement.removeChild(featuresContainer);
    }
    descriptionElement.textContent = card.description;
    card.photos.forEach(function (item) {
      photosContainer.appendChild(renderPhoto(item));
    });
    popup = cardElement;
    popupClose.addEventListener('click', onPopupCloseClick(pin));
    document.addEventListener('keydown', onPopupPressEsc(pin));
    return cardElement;
  };

  // функция отрисовки карточки похожего объявления
  var renderCardElement = function (card, pin) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderCard(card, pin));
    mapElement.insertBefore(fragment, mapFiltersElement);
  };

  // функция отрисовки попапа
  var renderPopup = function (card, pin) {
    if (popup) {
      closePopup();
    }
    renderCardElement(card, pin);
    pin.classList.add('map__pin--active');
  };

  // функция удаляет popup из DOMа
  var closePopup = function () {
    mapElement.removeChild(popup);
    popup = null;
    popupClose = null;
    document.removeEventListener('keydown', onPopupPressEsc);
  };

  // функция-обработчик клика по кнопке закрытия карточки
  var onPopupCloseClick = function (pin) {
    return function () {
      closePopup();
      pin.classList.remove('map__pin--active');
    };
  };

  // функция-обработчик нажатия на Esc
  var onPopupPressEsc = function (pin) {
    return function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closePopup();
        pin.classList.remove('map__pin--active');
      }
    };
  };

  // экспортируемый объект
  window.renderPopup = renderPopup;

})();
