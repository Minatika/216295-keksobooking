'use strict';

// генерирует массив объектов объявлений
(function () {
  var cardParams = {
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
    Y_MAX: 630
  };

  var typesOffer = {
    'palace': {
      DESIGNATION: 'Дворец',
      MIN_PRICE: 10000
    },
    'flat': {
      DESIGNATION: 'Квартира',
      MIN_PRICE: 1000
    },
    'house': {
      DESIGNATION: 'Дом',
      MIN_PRICE: 5000
    },
    'bungalo': {
      DESIGNATION: 'Бунгало',
      MIN_PRICE: 0
    }
  };

  var capacityParams = {
    ROOMS_MIN: 1,
    ROOMS_MAX: 5,
    GUESTS_MIN: 1
  };
  capacityParams.GUESTS_MAX = capacityParams.ROOMS_MAX * 3;

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

  // экспортируемый объект
  window.data = {
    Y_MIN: cardParams.Y_MIN,
    Y_MAX: cardParams.Y_MAX,
    typesOffer: typesOffer,
    getCards: getCards
  };

})();
