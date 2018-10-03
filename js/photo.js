'use strict';

// загрузка изображений
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // функция-обработчик изменения состояния поля загрузки файлов
  var onInputFileChange = function (elementNode) {
    return function (evt) {
      var file = evt.target.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          if (elementNode.nodeName === 'IMG') {
            elementNode.src = reader.result;
          } else {
            if (elementNode.hasChildNodes()) {
              var clone = elementNode.cloneNode();
              elementNode.parentElement.appendChild(clone);
              clone.appendChild(window.utils.renderPhoto(reader.result));
            } else {
              elementNode.appendChild(window.utils.renderPhoto(reader.result));
            }
          }
        });
        reader.readAsDataURL(file);
      }
    };
  };

  // функция активации работы поля с типом file
  var enableFileChooser = function (inputElement, elementNode) {
    inputElement.addEventListener('change', onInputFileChange(elementNode));
  };

  // экспортируемый метод
  window.enableFileChooser = enableFileChooser;

})();
