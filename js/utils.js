'use strict';

(function () {
  var ESC_KEYCODE = 27;

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

  // функция-обработчик срабатывает при нажатии на клавишу ESC
  var isEscEvent = function (evt, action, element) {
    if (evt.keyCode === ESC_KEYCODE) {
      action(element);
    }
  };

  // функция-обработчик нажатия ESC
  var onMessageEscPress = function (messageElement) {
    return function (evt) {
      isEscEvent(evt, closeMessage, messageElement);
    };
  };

  // функция-обработчик клика
  var onMessageClick = function (messageElement) {
    return function () {
      closeMessage(messageElement);
    };
  };

  // функция-обработчик клика по кнопке в сообщении об ошибке
  var onButtonErrorClick = function (messageElement) {
    return function () {
      closeMessage(messageElement);
    };
  };

  // функция закрывает сообщение о результате отправки формы
  var closeMessage = function (messageElement) {
    if (messageElement) {
      var parent = messageElement.parentNode;
      parent.removeChild(messageElement);
      document.removeEventListener('keydown', onMessageEscPress);
      document.removeEventListener('click', onMessageClick);
    }
  };

  // функция создания в DOMе сообщения и вывод в него сообщения об ошибке
  var renderMessage = function (templateElement, message) {
    var messageElement = templateElement.cloneNode(true);
    document.addEventListener('keydown', onMessageEscPress(messageElement));
    document.addEventListener('click', onMessageClick(messageElement));
    if (message) {
      var messageErrorElement = messageElement.querySelector('.error__message');
      var buttonErrorElement = messageElement.querySelector('.error__button');
      messageErrorElement.textContent = message;
      buttonErrorElement.addEventListener('click', onButtonErrorClick(messageElement));
    }
    return messageElement;
  };

  // функция добавляет в DOM сообщение с ошибкой от сервера
  var renderMessageElement = function (parent, templateElement, message) {
    parent.appendChild(renderMessage(templateElement, message));
  };

  // функция очистки блока с чек-боксами
  var clearCheckboxes = function (arr) {
    arr.forEach(function (item) {
      if (item.checked) {
        item.checked = false;
      }
    });
  };

  // экспортируемый объект
  window.utils = {
    shuffleArray: shuffleArray,
    getRandomValue: getRandomValue,
    isEscEvent: isEscEvent,
    renderMessageElement: renderMessageElement,
    clearCheckboxes: clearCheckboxes
  };

})();
