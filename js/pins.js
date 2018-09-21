'use strict';

// отрисовывает метки похожих объявлений
(function () {
  var pinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinElement = document.querySelector('.map__pin');

  var activePin;

  // функция создания в DOMе меток и заполнения их данными
  var renderPin = function (card) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var widthPin = mapPinElement.offsetWidth;
    var heightPin = mapPinElement.offsetHeight;
    var imgPin = pinElement.querySelector('img');
    pinElement.style = 'left: ' + (card.x - widthPin / 2) + 'px; top: ' + (card.y - heightPin) + 'px;';
    imgPin.src = card.avatar;
    imgPin.alt = card.title;
    pinElement.addEventListener('click', onPinClick(pinElement, card));
    return pinElement;
  };

  // функция отрисовки сгенерированных меток
  var renderPins = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(renderPin(arr[i]));
    }
    mapPinsElement.appendChild(fragment);
  };

  // функция-обработчик нажатия на метку похожего объявления
  var onPinClick = function (pinNode, card) {
    return function () {
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      var pinCurrent = pinNode.classList.contains('map__pin') ? pinNode : pinNode.parentElement;
      window.renderPopup(card, pinCurrent);
      pinCurrent.classList.add('map__pin--active');
      activePin = pinCurrent;
    };
  };

  // экспортируемый объект
  window.renderPins = renderPins;

})();
