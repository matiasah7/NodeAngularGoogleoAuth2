var app = angular.module("userApp", []);

app.controller("loginController", function($scope, $http, $window) {

    var vm = this;

    var url;
    var windowThatWasOpened;
    $http.get("google/url").
    then(function(response) {
        url = response.data;
    });

    vm.login = function() {
        windowThatWasOpened = $window.open(url, "Please sign in with Google", "width=200px, height:300px");
    };

    window.onmessage = function(e) {
        windowThatWasOpened.close();
        var urlWithCode = e.data;
        var idx = urlWithCode.lastIndexOf("code=");
        var code = urlWithCode.substring(idx + 5).replace("#", "");

        $http.get("google/tokens?code=" + code).then(function(response) {
            console.log(response.data);
        });

    };
});
