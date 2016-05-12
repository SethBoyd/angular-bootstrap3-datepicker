var dp;

dp = angular.module('ng-bs3-datepicker', []);

dp.directive('ngBs3Datepicker', function($compile, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='input-group date'>\n  <input type='text' class='form-control'/>\n  <span class='input-group-addon'>\n    <span class='fa fa-calendar'></span>\n  </span>\n</div>",
    scope: {
      datePickerOptions: '=',
      dateFormat: '='
    },
    link: function($scope, element, attr) {

      var attributes, input, resetValue, initialized;
      attributes = element.prop("attributes");
      input = element.find("input");
      resetValue = false;
      angular.forEach(attributes, function(e) {
        if (e.name !== "class") {
          input.attr(e.name, e.value);
        }
      });

      $scope.reset = function() {
        var datePicker = input.data('DateTimePicker');
        if (datePicker) {
          datePicker.enabledDates($scope.datePickerOptions.enabledDates);
        } else {
          return $timeout($scope.reset, 100);
        }
      };

      $scope.$watchCollection('datePickerOptions.enabledDates', function(value) {
        return $scope.reset()
      });
      element.find('.input-group-addon').on('click', function(e) {
        return element.find('input').focus();
      });
      element.on("change.dp", function(e) {
        return $scope.$apply(function() {
          var i, obj, objPath, path, _i, _len, _results;
          if (e.date) {
            objPath = attr.ngModel.split(".");
            obj = $scope;
            _results = [];
            for (i = _i = 0, _len = objPath.length; _i < _len; i = ++_i) {
              path = objPath[i];
              if (!obj[path]) {
                obj[path] = {};
              }
              if (i === objPath.length - 1) {
                if (resetValue) {
                  resetValue = false;
                  _results.push(obj[path] = null);
                } else {
                  _results.push(obj[path] = e.date.format($scope.datePickerOptions.dateFormat));
                }
              } else {
                _results.push(obj = obj[path]);
              }
            }
            return _results;
          }
        });
      });
      $scope.$watch(attr.ngModel, function(newValue, oldValue) {
        if (oldValue && !newValue) {
          return resetValue = true;
        }
      });

      $timeout(function () {
        input.datetimepicker($scope.datePickerOptions);
      });

      return $compile(input)($scope);
    }
  };
});
