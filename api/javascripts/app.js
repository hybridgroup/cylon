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
  var device;
  $http.get('/robots/' + $routeParams.robotId).success(function(data) {
    return $scope.robot = data;
  });
  $scope.getDeviceDetail = function(deviceId) {
    return $http.get('/robots/' + $scope.robot.name + "/devices/" + deviceId).success(function(data) {
      $scope.deviceDetail = data;
      return device.console();
    });
  };
  $scope.executeCommand = function(deviceId, command) {
    var params, post_params;
    params = $(".dropdown-input").val();
    post_params = {};
    if (params !== "") {
      post_params = { params: [params] };
    }
    return $http.post('/robots/' + $scope.robot.name + "/devices/" + deviceId + "/commands/" + command, post_params).success(function(data) {
      $(".console code").append(data.result + "\n");
    });
  };
  device = {
    console: function() {
      var wspath;
      if (window.ws) {
        window.ws.onmessage = null;
        window.ws.close();
        $(".console code").empty();
      }
      wspath = "ws://" + location.host + "/robots/";
      window.ws = new WebSocket(wspath + $scope.robot.name + "/devices/" + $scope.deviceDetail.name + "/events");
      return window.ws.onmessage = function(evt) {
        return $(".console code").prepend(evt.data + "\n");
      };
    }
  };
  return $scope.isConnected = function(connection) {
    if (connection && connection.connected) {
      return "connected";
    }
  };
};
