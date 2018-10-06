'use strict';

(function () {
  var keyCodes = {
    ESC: 27,
    ENTER: 13
  };

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

  // функция создания ноды изображения img
  var renderPhoto = function (value, photoParams) {
    var image = document.createElement('img');
    if (photoParams.CLASS_NAME) {
      image.classList.add(photoParams.CLASS_NAME);
    }
    image.src = value;
    image.width = photoParams.WIDTH;
    image.height = photoParams.HEIGHT;
    image.alt = photoParams.ALT_TEXT;
    return image;
  };

  // функция-обработчик срабатывает при нажатии на клавишу ESC
  var isEscEvent = function (evt, action, element) {
    if (evt.keyCode === keyCodes.ESC) {
      action(element);
    }
  };

  // функция-обработчик срабатывает при нажатии на клавишу ENTER
  var isEnterEvent = function (evt, action, firstElement, secondElement) {
    if (evt.keyCode === keyCodes.ENTER) {
      action(firstElement, secondElement);
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
      if (parent) {
        parent.removeChild(messageElement);
      }
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
    renderPhoto: renderPhoto,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    renderMessageElement: renderMessageElement,
    clearCheckboxes: clearCheckboxes
  };

})();
