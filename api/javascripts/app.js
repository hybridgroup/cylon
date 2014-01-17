// Routes
angular.module("cylon", ['ngRoute']).config(["$routeProvider", function($routeProvider) {
    return $routeProvider.when("/robots", {
      templateUrl: "/partials/robot-index.html",
      controller: RobotIndexCtrl
    }).when("/robots/:robotId", {
      templateUrl: "/partials/robot-detail.html",
      controller: RobotDetailCtrl
    }).otherwise({
      redirectTo: "/robots"
    });
}]).directive("activeLink", ["$location", function(location) {
    return {
      restrict: "A",
      link: function(scope, element, attrs, controller) {
        var klass, path;
        klass = attrs.activeLink;
        path = attrs.$$element.find('a').attr('href');
        path = path.substring(1);
        scope.location = location;
        return scope.$watch("location.path()", function(newPath) {
          if (path === newPath) {
            return element.addClass(klass);
          } else {
            return element.removeClass(klass);
          }
        });
      }
    };
}]);

// Controllers
var RobotIndexCtrl = function($scope, $http, $location, $route) {
  $http.get('/robots').success(function(data) {
    return $scope.robots = data;
  });
  return $scope.robotDetail = function(robotId) {
    return $location.path("/robots/" + robotId);
  };
};

var RobotDetailCtrl = function($scope, $http, $routeParams, $location) {
  $scope.params = [
    { name: '', value: '', type: 'string' }
  ];

  $scope.paramTypes = ["string", "boolean", "integer"]

  $scope.addParam = function() {
    $scope.params.push({name: '', value: '', type: 'string'});
  }

  $scope.removeParam = function(index) {
    $scope.params.splice(index, 1)
  }

  $scope.isConnected = function(connection) {
    if (connection && connection.connected) { return "connected"; }
  };

  $http.get('/robots/' + $routeParams.robotId).success(function(data) {
    $scope.robot = data;
  });

  $scope.getDeviceDetail = function(deviceId) {
    $http.get('/robots/' + $scope.robot.name + "/devices/" + deviceId).success(function(data) {
      $scope.deviceDetail = data;
    });
  };

  $scope.executeDisabled = function() {
    return $scope.command === void 0
  }

  $scope.executeCommand = function() {
    var robotName = $scope.robot.name,
        deviceName = $scope.deviceDetail.name,
        command = $scope.command,
        params = extractParams();

    $http.post('/robots/' + robotName + "/devices/" + deviceName + "/commands/" + command, params).success(function(data) {
      $(".console code").append(data.result + "\n");
    });
  };

  var extractParams = function() {
    var params = {}

    for (var i = 0; i < $scope.params.length; i++) {
      var base = $scope.params[i];
      params[base.name] = base.value;

      switch (base.type) {
        case "boolean":
          str = String(params[base.name]).toLowerCase();
          params[base.name] = (str === 'true' || str === 't');
          break;

        case "integer":
          params[base.name] = Number(params[base.name]);
          break;

        default:
          // assume string, nothing changes
          break;
      }
    }

    return params;
  }
};
