angular.module('OrderApp').controller('deliveryController', function (productService) {
    var vm = this;

    vm.getDeliveryInfo = function () {
        return productService.getDeliveryInfo();
    }

    vm.submitOrder = function () {
        productService.submitOrder();
    }
});
