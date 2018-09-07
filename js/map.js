'use strict';

var cardParams = {
  COUNT: 8,
  TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  PRICE_MIN: 1000,
  PRICE_MAX: 1000000,
  TYPES_OFFER: {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  },
  ROOMS_MIN: 1,
  ROOMS_MAX: 5,
  GUESTS_MIN: 1,
  CHECKIN: ['12:00', '13:00', '14:00'],
  CHECKOUT: ['12:00', '13:00', '14:00'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  Y_MIN: 130,
  Y_MAX: 630
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

// функция получения рандомного значения между min и max
var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// функция случайной сортировки
var mixRandomArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var random = getRandomValue(0, i);
    var temp = arr[i];
    arr[i] = arr[random];
    arr[random] = temp;
  }
  return arr;
};

// функция получения массива случайной длины
var getArrayRandomLight = function (arr, number) {
  var obj = {};
  while (Object.keys(obj).length < number) {
    var index = getRandomValue(0, arr.length);
    obj[arr[index]] = true;
  }
  return Object.keys(obj);
};

// функция заполнения свойства avatar
var getAvatar = function (number) {
  return (number < 10) ? 'img/avatars/user0' + number + '.png' : 'img/avatars/user' + number + '.png';
};

// функция возвращает объект card
var getCardObject = function (number, parentElement, mixArr) {
  var card = {};
  card.avatar = getAvatar(number + 1);
  card.title = mixArr[number];
  card.x = getRandomValue(0, parentElement.offsetWidth);
  card.y = getRandomValue(cardParams.Y_MIN, cardParams.Y_MAX);
  card.address = card.x + ', ' + card.y;
  card.price = getRandomValue(cardParams.PRICE_MIN, cardParams.PRICE_MAX);
  card.type = Object.keys(cardParams.TYPES_OFFER)[getRandomValue(0, Object.keys(cardParams.TYPES_OFFER).length)];
  card.rooms = getRandomValue(cardParams.ROOMS_MIN, cardParams.ROOMS_MAX + 1);
  card.guests = getRandomValue(cardParams.GUESTS_MIN, cardParams.ROOMS_MAX * 3);
  card.checkin = cardParams.CHECKIN[getRandomValue(0, cardParams.CHECKIN.length)];
  card.checkout = cardParams.CHECKOUT[getRandomValue(0, cardParams.CHECKOUT.length)];
  card.features = getArrayRandomLight(cardParams.FEATURES, getRandomValue(0, cardParams.FEATURES.length));
  card.description = '';
  card.photos = mixRandomArray(cardParams.PHOTOS);
  return card;
};

// функция заполнения массива похожих объявлений
var getCards = function (count, parentElement) {
  var arr = [];
  var mixTitles = mixRandomArray(cardParams.TITLES);
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

// функция создания в DOMe блока удобст и заполнение его данными
var renderFeatures = function (element, parent, arr) {
  if (arr[0] !== undefined) {
    for (var i = 0; i < arr.length; i++) {
      var li = document.createElement('li');
      li.classList.add('popup__feature', 'popup__feature--' + arr[i]);
      element.appendChild(li);
    }
  } else {
    parent.removeChild(element);
  }
};

// функция заполнения блока popup__photos значениями
var renderPhotos = function (element, parent, arr) {
  for (var i = 1; i < arr.length; i++) {
    var photoClone = element.cloneNode();
    photoClone.src = arr[i];
    parent.appendChild(photoClone);
  }
};

// функция создания в DOMе объявления и заполнения его данными
var renderCard = function (card) {
  var cardElement = cardTemplateElement.cloneNode(true);
  var ul = cardElement.querySelector('.popup__features');
  var photo = cardElement.querySelector('.popup__photo');
  cardElement.querySelector('.popup__avatar').src = card.avatar;
  cardElement.querySelector('.popup__title').textContent = card.title;
  cardElement.querySelector('.popup__text--address').textContent = card.address;
  cardElement.querySelector('.popup__text--price').textContent = card.price + String.fromCharCode('8381') + '/ночь';
  cardElement.querySelector('.popup__type').textContent = cardParams.TYPES_OFFER[card.type];
  cardElement.querySelector('.popup__text--capacity').textContent = card.rooms + ' комнаты для ' + card.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.checkin + ', выезд до ' + card.checkout;
  renderFeatures(ul, cardElement, card.features);
  cardElement.querySelector('.popup__description').textContent = card.description;
  photo.src = card.photos[0];
  renderPhotos(photo, cardElement.querySelector('.popup__photos'), card.photos);
  return cardElement;
};

// функция отрисовки сгенерированных элементов
var renderElements = function () {
  var cards = getCards(cardParams.COUNT, mapPinsElement);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < cards.length; i++) {
    fragment.appendChild(renderPin(cards[i]));
  }
  mapPinsElement.appendChild(fragment);
  fragment.appendChild(renderCard(cards[0]));
  map.insertBefore(fragment, mapFilters);
};

map.classList.remove('map--faded');
renderElements();
