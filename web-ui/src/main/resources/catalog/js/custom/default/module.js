(function() {

  goog.provide('gn_search_default');

  goog.require('gn_search');
  goog.require('gn_search_default_config');

  var module = angular.module('gn_search_default', ['gn_search', 'gn_search_default_config']);

  module.controller('gnsDefault', [
    '$scope',
    '$location',
    'suggestService',
    '$http',
    'gnSearchSettings',
      'gnMap',
    function($scope, $location, suggestService, $http, gnSearchSettings, gnMap) {

      var viewerMap = gnSearchSettings.viewerMap;
      var searchMap = gnSearchSettings.searchMap;

      $scope.mainTabs = {
        home :{
          title: 'Home',
          titleInfo: '',
          active: true
        },
        search: {
          title: 'Search',
          titleInfo: '',
          active: false
        },
        map:{
          title: 'Map',
          active: false
        }};

      $scope.addLayerToMap = function(number) {
        $scope.mainTabs.map.titleInfo = '  (+' + number + ')';
      };

      $scope.$on('addLayerFromMd', function(evt, link) {
        gnMap.addWmsToMap(viewerMap, {
          LAYERS: link.name
        }, {
          url: link.url,
          label: link.desc,
          group: link.group
        })
      });



      $scope.displayMapTab = function() {
        if(viewerMap.getSize()[0] == 0 || viewerMap.getSize()[1] == 0){
          setTimeout(function(){
            viewerMap.updateSize();
          }, 0);
        }
        $scope.mainTabs.map.titleInfo = '';
      };

///////////////////////////////////////////////////////////////////
      $scope.getAnySuggestions = function(val) {
        var url = suggestService.getUrl(val, 'anylight',
            ('STARTSWITHFIRST'));

        return $http.get(url, {
        }).then(function(res){
          return res.data[1];
        });
      };

      $scope.$watch('searchObj.advancedMode', function(val) {
        if(val && (searchMap.getSize()[0] == 0 || searchMap.getSize()[1] == 0)){
          setTimeout(function(){
            searchMap.updateSize();
          }, 0);
        }
      });

///////////////////////////////////////////////////////////////////

      angular.extend($scope.searchObj, {
        advancedMode: false,
        viewerMap: viewerMap,
        searchMap: searchMap
      });
    }]);
})();
