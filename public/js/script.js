var app = angular.module('markdownTest', [
   'ui.bootstrap',
   'yaru22.md'
])
.directive('onReadFile', function ($parse) {
   return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
         var fn = $parse(attrs.onReadFile);   
         element.on('change', function(onChangeEvent) {
            var reader = new FileReader();
            reader.onload = function(onLoadEvent) {
               scope.$apply(function() {
                  fn(scope, {$fileContent:onLoadEvent.target.result});
               });
            };
            reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
         });
      }
   };
})
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
   $scope.data = {};
   getQuote().then(function(d) {
      $scope.data.quote = d;
   });
})
.controller('createController', function($scope) {
   var aux = 1;
   $scope.isMinize = false;

   $scope.minimize = function() {   
      if(aux) {
         $scope.isMinize = true;
         aux = 0;
      } else {
         $scope.isMinize = false;
         aux = 1;
      };      
   }

   $scope.maximize = function() {
      $scope.isMinize = false;
   }

   $scope.savePDF = function() { window.print(); };
   
   $scope.showContent = function($fileContent){ $scope.content = $fileContent; };

   $scope.downloadFile = function(filename, data) {
      var success = false;
      var contentType = 'text/plain;charset=utf-8';

      try {
         // Try using msSaveBlob if supported
         var blob = new Blob([data], { type: contentType });
         if(navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
         } else {
            // Try using other saveBlob implementations, if available
            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
            if(saveBlob === undefined) throw "Not supported";
            saveBlob(blob, filename);
         }
         
         success = true;
      } catch(ex) {
         console.log("saveBlob method failed with the following exception:");
         console.log(ex);
      };

      if(!success) {
         // Get the blob url creator
         var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
         if(urlCreator) {
            // Try to use a download link
            var link = document.createElement('a');
            if('download' in link) {
               // Try to simulate a click
               try {
                  // Prepare a blob URL
                  var blob = new Blob([data], { type: contentType });
                  var url = urlCreator.createObjectURL(blob);
                  link.setAttribute('href', url);

                  // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                  link.setAttribute("download", filename);

                  // Simulate clicking the download link
                  var event = document.createEvent('MouseEvents');
                  event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                  link.dispatchEvent(event);
                  console.log("Download link method with simulated click succeeded");
                  success = true;
               } catch(ex) {
                  console.log("Download link method with simulated click failed with the following exception:");
                  console.log(ex);
               }
            }

            if(!success) {
               // Fallback to window.location method
               try {
                  // Prepare a blob URL
                  // Use application/octet-stream when using window.location to force download
                  console.log("Trying download link method with window.location ...");
                  var blob = new Blob([data], { type: octetStreamMime });
                  var url = urlCreator.createObjectURL(blob);
                  window.location = url;
                  console.log("Download link method with window.location succeeded");
                  success = true;
               } catch(ex) {
                  console.log("Download link method with window.location failed with the following exception:");
                  console.log(ex);
               }
            }
         }
      }

      if(!success) {
         // Fallback to window.open method
         console.log("No methods worked for saving the arraybuffer, using last resort window.open.  Not Implemented");
         //window.open(httpPath, '_blank', '');
      }
   };
})