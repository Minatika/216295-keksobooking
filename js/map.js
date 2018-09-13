'use strict';

var cardParams = {
  COUNT: 8,
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  PRICE_MIN: 1000,
  PRICE_MAX: 1000000,
  TIME: ['12:00', '13:00', '14:00'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  Y_MIN: 130,
  Y_MAX: 630,
  FEATURE_CLASS: 'popup__feature'
};

var typesOffer = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var capacityParams = {
  ROOMS_MIN: 1,
  ROOMS_MAX: 5,
  GUESTS_MIN: 1
};
capacityParams.GUESTS_MAX = capacityParams.ROOMS_MAX * 3;

var photoParams = {
  IMAGE_WIDTH: 45,
  IMAGE_HEIGHT: 40,
  ALT_TEXT: 'Фотография жилья',
  CLASS_NAME: 'popup__photo'
};

var map = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinElement = document.querySelector('.map__pin');
var mapFilters = document.querySelector('.map__filters-container');
var pinTemplateElement = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var cardTemplateElement = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var adFieldsets = adForm.querySelectorAll('.ad-form__element');
var adAdress = adForm.querySelector('input[name=address]');
var mainPin = document.querySelector('.map__pin--main');
var mapFiltersForm = document.querySelector('.map__filters');
var mapFiltersFields = mapFiltersForm.querySelectorAll('.map__filter, .map__features');
var cards = [];

// функция получения рандомного значения между min и max
var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// функция случайной сортировки
var shuffleArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var random = getRandomValue(0, i);
    var temp = arr[i];
    arr[i] = arr[random];
    arr[random] = temp;
  }
  return arr;
};

// функция получения массива случайной длины
var getArrayRandomLength = function (arr, number) {
  var resultArr = [];
  while (resultArr.length < number) {
    var index = getRandomValue(0, arr.length);
    var temp = arr[index];
    if (resultArr.indexOf(temp) === -1) {
      resultArr.push(temp);
    }
  }
  return resultArr;
};

// функция заполнения свойства avatar
var getAvatar = function (number) {
  return (number < 10) ? 'img/avatars/user0' + number + '.png' : 'img/avatars/user' + number + '.png';
};

// функция возвращает объект card
var getCardObject = function (number, parentElement, mixArr) {
  var card = {
    avatar: getAvatar(number + 1),
    title: mixArr[number],
    x: getRandomValue(0, parentElement.offsetWidth),
    y: getRandomValue(cardParams.Y_MIN, cardParams.Y_MAX),
    price: getRandomValue(cardParams.PRICE_MIN, cardParams.PRICE_MAX),
    type: Object.keys(typesOffer)[getRandomValue(0, Object.keys(typesOffer).length)],
    rooms: getRandomValue(capacityParams.ROOMS_MIN, capacityParams.ROOMS_MAX + 1),
    guests: getRandomValue(capacityParams.GUESTS_MIN, capacityParams.GUESTS_MAX),
    checkin: cardParams.TIME[getRandomValue(0, cardParams.TIME.length)],
    checkout: cardParams.TIME[getRandomValue(0, cardParams.TIME.length)],
    features: getArrayRandomLength(cardParams.FEATURES, getRandomValue(0, cardParams.FEATURES.length)),
    description: '',
    photos: shuffleArray(cardParams.PHOTOS)
  };
  card.address = card.x + ', ' + card.y;
  return card;
};

// функция заполнения массива похожих объявлений
var getCards = function (count, parentElement) {
  var arr = [];
  var mixTitles = shuffleArray(cardParams.TITLES);
  for (var i = 0; i < count; i++) {
    arr.push(getCardObject(i, parentElement, mixTitles));
  }
  return arr;
};

// функция создания в DOMе меток и заполнения их данными
var renderPin = function (card) {
  var pinElement = pinTemplateElement.cloneNode(true);
  var widthPin = mapPinElement.offsetWidth;
  var heightPin = mapPinElement.offsetHeight;
  var imgPin = pinElement.querySelector('img');
  pinElement.style = 'left: ' + (card.x - widthPin / 2) + 'px; top: ' + (card.y - heightPin) + 'px;';
  imgPin.src = card.avatar;
  imgPin.alt = card.title;
  return pinElement;
};

// функция создания ноды элемента li
var renderFeatures = function (value) {
  var li = document.createElement('li');
  li.classList.add(cardParams.FEATURE_CLASS, cardParams.FEATURE_CLASS + '--' + value);
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
  return cardElement;
};

// функция отрисовки сгенерированных элементов
var renderElements = function () {
  cards = getCards(cardParams.COUNT, mapPinsElement);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < cards.length; i++) {
    fragment.appendChild(renderPin(cards[i]));
  }
  mapPinsElement.appendChild(fragment);
};

// функция-обработчик отпускания мышью метки адреса
var onMainPinMouseup = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFieldsets.length; i++) {
    adFieldsets[i].removeAttribute('disabled');
  }
  for (i = 0; i < mapFiltersFields.length; i++) {
    mapFiltersFields[i].removeAttribute('disabled');
  }
  var locationX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  var locationY = mainPin.offsetTop + mainPin.offsetHeight;
  adAdress.setAttribute('value', locationX + ', ' + locationY);
  renderElements();
};

// обработчик отпускания мышью метки адреса
mainPin.addEventListener('mouseup', onMainPinMouseup);

var showPopup = function (pin) {
  for (var i = 0; i < cards.length; i++) {
    if (pin.getAttribute('src') === cards[i].avatar && pin.getAttribute('alt') === cards[i].title) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(renderCard(cards[i]));
      map.insertBefore(fragment, mapFilters);
    }
  }
};

// обработчик клика на метку похожего объявления
mapPinsElement.addEventListener('click', function (evt) {
  var target = evt.target;
  if (target !== mainPin.querySelector('img')) {
    showPopup(target);
    target.parentElement.classList.add('map__pin--active');
  }
});

mapPinsElement.addEventListener('click', function (evt) {
  var target = evt.target;
  var popupClose = mapPinsElement.querySelector('.popup__close');
  if (target === popupClose) {
    map.removeChild(map.querySelector('popup'));
  }
});

// функция изначально приводит страницу в неактивное состоние
var setInactiveState = function () {
  for (var i = 0; i < adFieldsets.length; i++) {
    adFieldsets[i].setAttribute('disabled', '');
  }
  for (i = 0; i < mapFiltersFields.length; i++) {
    mapFiltersFields[i].setAttribute('disabled', '');
  }
  var locationX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
  var locationY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
  adAdress.setAttribute('value', locationX + ', ' + locationY);
  adAdress.setAttribute('readonly', '');
};

setInactiveState();
