angular.module('OrderApp').controller('productController', function ($modal, productService) {
    var vm = this;

    // Variables
    vm.order = {};
    vm.productList = [];
    vm.categories = [];

    // For filter and sort
    vm.filter = {
        category: '' //This value must exist in list option
    };
    vm.sortBy = '';

    /*
     * author: TrungNDT
     * method: Load all products
     */
    vm.getAllProducts = function () {
        //return productService.getProducts();
        var promise = productService.loadAllProducts();
        promise.then(function (products) {
            vm.productList = products;
        });
    }

    /*
     * author: TrungNDT
     * method: Load all categories
     */
    vm.getAllCategories = function () {
        //return productService.getCategories();
        var promise = productService.loadAllCategories();
        promise.then(function (categories) {
            vm.categories = categories;
        });
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
                    return true;
                }
            }
        });
    };

    /*
     * author: TrungNDT
     * method: Add given product to cart. Count up if product exist
     */
    vm.addProductToCart = function (product) {
        productService.addProductToCart(product);
    };

    vm.getAllProducts();
    vm.getAllCategories();
});