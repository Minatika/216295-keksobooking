'use strict';

var cardParams = {
  COUNT: 8,
  TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  PRICE_MIN: 1000,
  PRICE_MAX: 1000000,
  TYPE_KEYS: ['palace', 'flat', 'house', 'bungalo'],
  TYPE_VALUES: ['Дворец', 'Квартира', 'Дом', 'Бунгало'],
  ROOMS_MIN: 1,
  ROOMS_MAX: 5,
  GUESTS_MIN: 1,
  CHECKIN: ['12:00', '13:00', '14:00'],
  CHECKOUT: ['12:00', '13:00', '14:00'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'condicioner'],
  PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  Y_MIN: 130,
  Y_MAX: 630
};

var map = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinElement = document.querySelector('.map__pin');
var mapFilters = document.querySelector('.map__filters-container');

// функция получения рандомного значения между min и max
var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// функция случайной сортировки
function compareRandom() {
  return Math.random() - 0.5;
}

// функция получения массива случайной длины
var getArrayRandomLight = function (arr, number) {
  var resultArr = [];
  for (var i = 0; i < number; i++) {
    resultArr.push(arr[i]);
  }
  return resultArr;
};

// функция для поиска типа жилья по ключу
var getTypeValue = function (key) {
  var value = '';
  for (var i = 0; i < cardParams.TYPE_KEYS.length; i++) {
    if (key === cardParams.TYPE_KEYS[i]) {
      value = cardParams.TYPE_VALUES[i];
    }
  }
  return value;
};

// функция-конструктор объекта author
function Author(number) {
  this.avatar = 'img/avatars/user0' + (number + 1) + '.png';
}

// функция-констуктор объекта offer
function Offer(number, location) {
  this.title = cardParams.TITLES[number];
  this.address = location.x + ', ' + location.y;
  this.price = getRandomValue(cardParams.PRICE_MIN, cardParams.PRICE_MAX);
  this.type = cardParams.TYPE_KEYS[getRandomValue(0, cardParams.TYPE_KEYS.length)];
  this.rooms = getRandomValue(cardParams.ROOMS_MIN, cardParams.ROOMS_MAX + 1);
  this.guests = getRandomValue(cardParams.GUESTS_MIN, cardParams.ROOMS_MAX * 3);
  this.checkin = cardParams.CHECKIN[getRandomValue(0, cardParams.CHECKIN.length)];
  this.checkout = cardParams.CHECKOUT[getRandomValue(0, cardParams.CHECKOUT.length)];
  this.features = getArrayRandomLight(cardParams.FEATURES, getRandomValue(0, cardParams.FEATURES.length));
  this.description = '';
  this.photos = cardParams.PHOTOS;
}

// функция-конструктор объекта location
function Location(parentElement) {
  this.x = getRandomValue(0, parseInt(parentElement.offsetWidth, 10));
  this.y = getRandomValue(cardParams.Y_MIN, cardParams.Y_MAX);
}

// функция-конструктор объявления
function Card(number, parentElement) {
  this.author = new Author(number);
  this.location = new Location(parentElement);
  this.offer = new Offer(number, this.location);
}

// функция заполнения массива похожих объявлений
var getCards = function (count, parentElement) {
  var arr = [];
  cardParams.TITLES.sort(compareRandom);
  cardParams.PHOTOS.sort(compareRandom);
  for (var i = 0; i < count; i++) {
    arr.push(new Card(i, parentElement));
  }
  return arr;
};

// функция создания в DOMе меток и заполнения их данными
var renderPin = function (card) {
  var pinElement = document.querySelector('#pin')
      .content
      .querySelector('.map__pin')
      .cloneNode(true);
  pinElement.style = 'left: ' + (card.location.x - (parseInt(mapPinElement.offsetWidth, 10)) / 2) + 'px; top: ' + (card.location.y - (parseInt(mapPinElement.offsetHeight, 10))) + 'px;';
  pinElement.querySelector('img').src = card.author.avatar;
  pinElement.querySelector('img').alt = card.offer.title;
  return pinElement;
};

// функция создания в DOMе объявления и заполнения его данными
var renderCard = function (card) {
  var cardElement = document.querySelector('#card')
    .content
    .querySelector('.map__card')
    .cloneNode(true);
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + String.fromCharCode('8381') + '/ночь';
  cardElement.querySelector('.popup__type').textContent = getTypeValue(card.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  if (card.offer.features.length === 0) {
    cardElement.removeChild(cardElement.querySelector('.popup__features'));
  } else {
    for (var i = cardParams.FEATURES.length - 1; i >= card.offer.features.length; i--) {
      cardElement.querySelector('.popup__features').removeChild(cardElement.querySelector('.popup__features').childNodes[i]);
    }
  }
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  var photo = cardElement.querySelector('.popup__photo');
  photo.src = card.offer.photos[0];
  for (i = 1; i < card.offer.photos.length; i++) {
    var photoClone = photo.cloneNode();
    photoClone.src = card.offer.photos[i];
    cardElement.querySelector('.popup__photos').appendChild(photoClone);
  }
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
