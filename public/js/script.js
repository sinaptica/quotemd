var app = angular.module('markdownTest', [
   'ui.bootstrap',
   'yaru22.md'
])
.service('getQuote', function($http) {
   return function() {
      var promise = $http.get("../md/text.md").then(function (response) {
         return response.data;
      });
      console.log(promise);
      return promise;
   };
})
.controller('dataController', function($scope, getQuote) {
   var vm = this;

   $scope.data = {};
   getQuote().then(function(d) {
      $scope.data.quote = d;
   });
});
