'use strict';

// отрисовывает метки похожих объявлений
(function () {
  var pinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinElement = document.querySelector('.map__pin');

  var activePin;
  var Pins = [];

  // функция создания в DOMе меток и заполнения их данными
  var renderPin = function (card) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var widthPin = mapPinElement.offsetWidth;
    var heightPin = mapPinElement.offsetHeight;
    var imgPin = pinElement.querySelector('img');
    pinElement.style = 'left: ' + (card.location.x - widthPin / 2) + 'px; top: ' + (card.location.y - heightPin) + 'px;';
    imgPin.src = card.author.avatar;
    imgPin.alt = card.offer.title;
    pinElement.addEventListener('click', onPinClick(pinElement, card));
    pinElement.addEventListener('keydown', onPinPressEnter(pinElement, card));
    Pins.push(pinElement);
    return pinElement;
  };

  // функция отрисовки сгенерированных меток
  var renderPins = function (arr) {
    var fragment = document.createDocumentFragment();
    arr.forEach(function (item) {
      fragment.appendChild(renderPin(item));
    });
    mapPinsElement.appendChild(fragment);
  };

  // функция удаления меток похожих объявлений из дома
  var deletePins = function () {
    Pins.forEach(function (item) {
      mapPinsElement.removeChild(item);
    });
    Pins = [];
  };

  // функция переводит пин в активное состояние
  var activatePin = function (pinNode, card) {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    var pinCurrent = pinNode.classList.contains('map__pin') ? pinNode : pinNode.parentElement;
    window.card.renderPopup(card, pinCurrent);
    pinCurrent.classList.add('map__pin--active');
    activePin = pinCurrent;
  };

  // функция-обработчик нажатия на метку похожего объявления
  var onPinClick = function (pinNode, card) {
    return function () {
      activatePin(pinNode, card);
    };
  };

  // функция-обработчик нажатия на ENTER
  var onPinPressEnter = function (pinNode, card) {
    return function (evt) {
      window.utils.isEnterEvent(evt, activatePin, pinNode, card);
    };
  };

  // экспортируемый объект
  window.pins = {
    renderPins: renderPins,
    deletePins: deletePins
  };

})();
