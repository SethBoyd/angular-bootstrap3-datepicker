var dp;

dp = angular.module('ng-bs3-datepicker', []);

dp.directive('ngBs3Datepicker', function($compile, $timeout) {
  return {
    require: "ngModel",
    restrict: 'E',
    replace: true,
    template: "<div class='input-group date'>\n  <input type='text' class='form-control' ng-model='inputModel' ng-required='inputRequired' ng-model-options=\"{ updateOn: 'blur' }\"/>\n  <span class='input-group-addon'>\n    <span class='glyphicon glyphicon-calendar'></span>\n  </span>\n</div>",

    scope: {
      datePickerOptions: '=',
      dateFormat: '=',
      dateRequired: '=',
      bindModel:'=ngModel'
    },
    link: function(scope, element, attr, ctrl) {
      scope.inputModel = "";
      scope.inputRequired = scope.dateRequired ? true : false;

      var attributes, input, resetValue, initialized;
      attributes = element.prop("attributes");
      input = element.find("input");
      resetValue = false;
      angular.forEach(attributes, function(e) {
        if (e.name !== "class") {
          input.attr(e.name, e.value);
        }
      });

      scope.reset = function() {
        var datePicker = input.data('DateTimePicker');
        if (datePicker) {
          datePicker.enabledDates(scope.datePickerOptions.enabledDates);
        } else {
          return $timeout(scope.reset, 100);
        }
      };

      scope.$watchCollection('datePickerOptions.enabledDates', function(value) {
        return scope.reset()
      });
      element.find('.input-group-addon').on('click', function(e) {
        return element.find('input').focus();
      });
      scope.$watch(attr.ngModel, function(newValue, oldValue) {
        if (oldValue && !newValue) {
          return resetValue = true;
        }
      });

      $timeout(function () {
        input.datetimepicker(scope.datePickerOptions)
          .on("dp.change", function(e) {
            $timeout(function() {
              var dtp = input.data('DateTimePicker');
              scope.bindModel = dtp.date();
              if (scope.dateRequired) {
                if (ctrl.$isEmpty(scope.bindModel)) {
                   scope.inputRequired = true;
                } else {
                  var enabledDates = dtp.enabledDates();
                  if (enabledDates) {
                    scope.inputRequired = !enabledDates[scope.bindModel.format('YYYY-MM-DD')];
                  } else {
                   scope.inputRequired = false;
                  }
                }
              }
            });
          });
      });

      return $compile(input)(scope);
    }
  };
});
