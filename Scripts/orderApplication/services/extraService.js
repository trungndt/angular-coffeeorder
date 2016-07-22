angular.module('OrderApp').factory('extraService', function ($http, $q) {
    var service = {

        /*
         * author: TrungNDT
         * method: [Private] 
         */
        loadExtraGroups: function () {
            var deferred = $q.defer();
            $http({
                url: '/Order/GetCategoryExtra',
                method: 'POST',
            }).success(function (result) {
                console.log(result);
                deferred.resolve(result.extraGroup);
            });
            return deferred.promise;
        },

        /*
         * author: TrungNDT
         * method: [Private] 
         */
        loadExtraByGroupId: function (cateId) {
            var deferred = $q.defer();
            $http({
                url: '/Order/GetExtra',
                method: 'POST',
                params: { cateId: cateId },
            }).success(function (result) {
                deferred.resolve(result.productExtra);
            }).error(function (error) {
                console.log(error);
            });
            return deferred.promise;
        },

        /*
         * author: TrungNDT
         * method: [Private] 
         */
        loadGeneralByProductId: function (productId) {
            var deferred = $q.defer();
            $http({
                url: '/Order/GetGeneral',
                method: 'GET',
                params: { productId: productId },
            }).success(function (result) {
                deferred.resolve(result.productGeneral);
            }).error(function (error) {
                console.log(error);
            });
            return deferred.promise;
        },
    };
        
    return service;
});
