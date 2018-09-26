'use strict';

// работа с серверными запросами
(function () {
  var url = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    SAVE: 'https://js.dump.academy/keksobooking'
  };
  var SUCCESS_STATUS = 200;

  // функция создает запрос к серверу
  var getRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;
    return xhr;
  };

  // функция загружает данные с сервера
  var load = function (onLoad, onError) {
    var request = getRequest(onLoad, onError);
    request.open('GET', url.LOAD);
    request.send();
  };

  // функция отправляет данные на сервер
  var save = function (data, onLoad, onError) {
    var request = getRequest(onLoad, onError);
    request.open('POST', url.SAVE);
    request.send(data);
  };

  // экспортируемый объект
  window.backend = {
    load: load,
    save: save
  };

})();
