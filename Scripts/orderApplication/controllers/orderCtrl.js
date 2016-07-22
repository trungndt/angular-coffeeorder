angular.module('OrderApp').controller('OrderCtrl', function ($http, $localStorage, $modal, api) {
    

    loadAllProducts();
    loadAllCategories();

    /* ================================= SUPPORT METHODS ================================= */
    
});

//ModalCtrl.$inject = ['$scope', '$modal', 'product'];

//ModalCtrl = function ($scope, $modal, product) {
//    $scope.product = product;
//}