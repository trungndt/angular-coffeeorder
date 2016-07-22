angular.module('OrderApp').controller('modalController', function ($scope, $modalInstance, productService, extraService, product, isNewMode, $templateCache) {
    var vm = this;
    vm.order = product;
    vm.isNewMode = isNewMode;
    vm.extraGroups = [];
    vm.selectedExtraList = [];
    vm.selectedExtraGroupId = -1;
    vm.generalItems = [];

    /*
     * author: TrungNDT
     * method: [INIT] Load all general item belong to selected product
     */
    vm.loadGeneralItems = function () {
        console.log(product);
        var promise = extraService.loadGeneralByProductId(product.id);
        promise.then(function (result) {
            console.log(result);
            vm.generalItems = result;
        });
    }

    /*
     * author: TrungNDT
     * method: [INIT] Load all group of extra item
     */
    vm.loadExtraGroups = function () {
        var groupPromise = extraService.loadExtraGroups();
        groupPromise.then(function (result) {
            vm.extraGroups = result;
        });
    };

    /*
     * author: TrungNDT
     * method: [EVENT: CLICK] Activate selected extra group
     */
    vm.activateExtraGroup = function (groupId) {
        vm.selectedExtraGroupId = groupId;
        vm.loadExtraByGroupId(groupId);
    }

    /*
     * author: TrungNDT
     * method: Load extra items belong to selected group
     */
    vm.loadExtraByGroupId = function (id) {
        var promise = extraService.loadExtraByGroupId(id);
        promise.then(function (result) {
            vm.selectedExtraList = result;
        });
    };

    /*
     * author: TrungNDT
     * method: [EVENT: CLICK] Update product price & size by general item
     */
    vm.changeGeneralItem = function (generalItem) {
        vm.order.price = generalItem.price;
        vm.order.size = generalItem.att;
    }

    /*
     * author: TrungNDT
     * method: [EVENT: CHANGE] Plus or minus product quantity
     */
    vm.changeProductQuantity = function (isPlus) {
        if (isPlus) {
            vm.order.quantity++;
        } else {
            if (vm.order.quantity > 1)
                vm.order.quantity--;
        }
    };

    /*
     * author: TrungNDT
     * method: [EVENT: CHANGE] Plus or minus extra quantity
     */
    vm.changeExtraQuantity = function (extraItem, isPlus) {
        if (extraItem.quantity == undefined)
            extraItem.quantity = 0;
        if (isPlus) {
            extraItem.quantity++;
        } else {
            if (extraItem.quantity > 1)
                extraItem.quantity--;
            else
                extraItem.quantity = undefined;
        }

        // [Helping function] 
        function getIndexOfExtra(extraItem) {
            var index = -1
            angular.forEach(vm.order.extraList, function (e, i) {
                if (e.id == extraItem.id) index = i;
            });
            return index;
        }

        // Update extra item on order
        if (vm.order.extraList == undefined) vm.order.extraList = [];
        var extraIndex = getIndexOfExtra(extraItem);
        if (extraIndex > -1) // Existing: just update quantity
            vm.order.extraList[extraIndex].quantity = extraItem.quantity;
        else // Not Existing: add new
            vm.order.extraList.push(angular.copy(extraItem));
    };

    /*
     * author: TrungNDT
     * method: Add given product to cart
     */
    vm.addProductToCart = function () {
        // Collect extra & add to order
        var extraList = [];
        angular.forEach(vm.selectedExtraList, function (e, i) {
            if (e.quantity != undefined)
                extraList.push(angular.copy(e));
        });
        vm.order.extraList = extraList;

        // Add order to cart
        productService.addProductToCart(vm.order);
        $modalInstance.close();
    }

    /*
     * author: TrungNDT
     * method: Update shopping cart
     */
    vm.updateShoppingCart = function () {
        productService.updateOrder(vm.order);
        $modalInstance.close();
    }

    /*
     * author: TrungNDT
     * method: Get total cost base on price, quantity & extra
     * return: {Number} order cost
     */
    vm.getOrderCost = function (order) {
        return productService.getOrderCost(order);
    }

    vm.loadExtraGroups();
    vm.loadGeneralItems();
});