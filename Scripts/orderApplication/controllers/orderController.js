angular.module('OrderApp').controller('orderController', function ($modal, productService) {
    var vm = this;

    /*
     * author: TrungNDT
     * method: Check if shopping cart is empty
     */
    vm.isShoppingCartEmpty = function () {
        return productService.getOrders().length == 0;
    },

    /*
     * author: TrungNDT
     * method: Get shopping cart list
     */
    vm.getShoppingCart = function () {
        return productService.getOrders();
    }

    /*
     * author: TrungNDT
     * method: View selected product in popup modal
     */
    vm.viewProduct = function (product) {
        var modalInstance = $modal.open({
            controller: 'modalController',
            controllerAs: 'vm',
            templateUrl: 'modalContent.html',
            animation: true,
            resolve: {
                product: function () {
                    return angular.copy(product || {});
                },
                isNewMode: function () {
                    return false;
                }
            }
        });
    };

    /*
     * author: TrungNDT
     * method: update existing cart item
     */
    vm.saveOrderChange = function (order) {
        productService.updateOrder(order);
        $('#modalEditOrderItem').modal('hide');
    }

    /*
     * author: TrungNDT
     * method: Remove given order from cart
     */
    vm.removeOrder = function (order) {
        productService.removeOrder(order);
    }

    /*
     * author: TrungNDT
     * method: Get total cost base on price, quantity & extra
     * return: {Number} order cost
     */
    vm.getOrderCost = function (order) {
        return productService.getOrderCost(order);
    }

    /*
     * author: TrungNDT
     * method: Calculate entire cart's cost
     * return: {Number} total cost
     */
    vm.getTotalCost = function () {
        return productService.getTotalCost();
    }

    /*
     * author: TrungNDT
     * method: [Use for Filter] filter extra item has quatity > 0
     */
    vm.hasExtra = function () {
        return function (item) {
            return item.quantity > 0;
        }
    }

    vm.emptyShoppingCart = function () {
        productService.emptyCart();
    }

    vm.printCart = function () {
        console.log($localStorage.orders);
    };
});