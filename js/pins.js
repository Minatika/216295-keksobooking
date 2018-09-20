'use strict';

// отрисовывает метки похожих объявлений
(function () {
  var pinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  // функция создания в DOMе меток и заполнения их данными
  var renderPin = function (card) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var widthPin = window.map.mapPinElement.offsetWidth;
    var heightPin = window.map.mapPinElement.offsetHeight;
    var imgPin = pinElement.querySelector('img');
    pinElement.style = 'left: ' + (card.x - widthPin / 2) + 'px; top: ' + (card.y - heightPin) + 'px;';
    imgPin.src = card.avatar;
    imgPin.alt = card.title;
    pinElement.addEventListener('click', window.map.onPinClick(pinElement, card));
    return pinElement;
  };

  // функция отрисовки сгенерированных меток
  var renderPins = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(renderPin(arr[i]));
    }
    window.map.mapPinsElement.appendChild(fragment);
  };

  // экспортируемый объект
  window.pins = {
    renderPins: renderPins
  };

})();
