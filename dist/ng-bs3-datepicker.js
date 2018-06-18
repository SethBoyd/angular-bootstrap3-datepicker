var dp;

dp = angular.module('ng-bs3-datepicker', []);

dp.directive('ngBs3Datepicker', function($compile, $timeout) {
  return {
    require: "ngModel",
    restrict: 'E',
    replace: true,
    template: "<div class='input-group date'>\n  <input type='text' class='form-control' ng-model='inputModel' ng-required='inputRequired' ng-model-options=\"{ updateOn: 'blur' }\"/>\n  <span class='input-group-addon'>\n    <span class='glyphicon glyphicon-calendar'></span>\n  </span>\n</div>",

    scope: {
      datePickerOptions: '=?',
      dateFormat: '=?',
      dateRequired: '=?',
      bindModel:'=ngModel',
      strictEnabledDates:'=?'
    },
    link: function(scope, element, attr, ctrl) {
      scope.inputModel = "";
      scope.inputRequired = scope.dateRequired ? true : false;
      scope.strictEnabledDates = scope.strictEnabledDates === undefined ? true : scope.strictEnabledDates;

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

      var setRequired = function() {
        var dtp = input.data('DateTimePicker');
        if (scope.dateRequired) {
          if (ctrl.$isEmpty(scope.bindModel)) {
              scope.inputRequired = true;
          } else {
            if (dtp === undefined) {
              scope.inputRequired = false;
              return
            }
            var enabledDates = dtp.enabledDates();
            if (enabledDates && scope.strictEnabledDates) {
              scope.inputRequired = !enabledDates[dtp.date().format('YYYY-MM-DD')];
            } else {
              scope.inputRequired = false;
            }
          }
        }
      };

      scope.$watchCollection('datePickerOptions.enabledDates', function(value) {
        scope.reset();
        setRequired();
      });
      element.find('.input-group-addon').on('click', function(e) {
        return element.find('input').focus();
      });
      scope.$watch('bindModel', function(newValue, oldValue) {
        if (oldValue != newValue) {
          scope.inputModel = newValue;
          if (newValue) {
            var formattedDate = moment(new Date(newValue)).format(scope.datePickerOptions.format);
            if (formattedDate !== "Invalid date") {
              scope.inputModel = formattedDate;
            }
          }
          if (scope.datePickerOptions.viewMode) {
            var dtp = input.data('DateTimePicker');
            dtp.viewMode(scope.datePickerOptions.viewMode);
          }
        }
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
              if (dtp.date()) {
                scope.bindModel = dtp.date().format(scope.datePickerOptions.format);
              } else {
                scope.bindModel = ""
              }
              setRequired();
            });
          });
      });

      return $compile(input)(scope);
    }
  };
});
