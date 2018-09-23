'use strict';

// генерирует объект объявлений
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

  var typesOffer = ['palace', 'flat', 'house', 'bungalo'];

  var capacityParams = {
    ROOMS_MIN: 1,
    ROOMS_MAX: 5,
    GUESTS_MIN: 1
  };
  capacityParams.GUESTS_MAX = capacityParams.ROOMS_MAX * 3;

  var mixTitles = window.utils.shuffleArray(cardParams.TITLES);

  // функция получения массива случайной длины
  var getArrayRandomLength = function (arr, number) {
    var resultArr = [];
    while (resultArr.length < number) {
      var index = window.utils.getRandomValue(0, arr.length);
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
  var getCardObject = function (number, parentElement) {
    var card = {
      avatar: getAvatar(number + 1),
      title: mixTitles[number],
      x: window.utils.getRandomValue(0, parentElement.offsetWidth),
      y: window.utils.getRandomValue(cardParams.Y_MIN, cardParams.Y_MAX),
      price: window.utils.getRandomValue(cardParams.PRICE_MIN, cardParams.PRICE_MAX),
      type: typesOffer[window.utils.getRandomValue(0, typesOffer.length)],
      rooms: window.utils.getRandomValue(capacityParams.ROOMS_MIN, capacityParams.ROOMS_MAX + 1),
      guests: window.utils.getRandomValue(capacityParams.GUESTS_MIN, capacityParams.GUESTS_MAX),
      checkin: cardParams.TIME[window.utils.getRandomValue(0, cardParams.TIME.length)],
      checkout: cardParams.TIME[window.utils.getRandomValue(0, cardParams.TIME.length)],
      features: getArrayRandomLength(cardParams.FEATURES, window.utils.getRandomValue(0, cardParams.FEATURES.length)),
      description: '',
      photos: window.utils.shuffleArray(cardParams.PHOTOS)
    };
    card.address = card.x + ', ' + card.y;
    return card;
  };

  // экспортируемый объект
  window.getCardObject = getCardObject;

})();
