angular.module('OrderApp').factory('productService', function ($http, $localStorage, $q) {
    $localStorage.$default({
        categories: [],
        products: [],
        orders: [],
        deliveryInfo: {
            name: '',
            email: '',
            phone: '',
            address: '',
            district: '1',
            note: ''
        }
    });

    var service = {
        /*
         * author: TrungNDT
         * method: Loadd all products and categories from database
         */
        initialize: function () {
            service.loadAllProducts();
            service.loadAllCategories();
        },

        /*
         * author: TrungNDT
         * method: Get product list in localstorage
         */
        getProducts: function () {
            return $localStorage.products;
        },

        /*
         * author: TrungNDT
         * method: Get order list in localstorage
         */
        getOrders: function () {
            return $localStorage.orders;
        },

        /*
         * author: TrungNDT
         * method: Get product categories list
         */
        getCategories: function () {
            return $localStorage.categories;
        },

        /*
         * author: TrungNDT
         * method: Get delivery info
         */
        getDeliveryInfo: function (z) {
            return $localStorage.deliveryInfo;
        },

        /*
         * author: TrungNDT
         * method: Add given product to cart. Count up if product exist
         */
        addProductToCart: function (product) {
            if (service.isSingleItem(product)) {
                var orderIndex = service.getOrderIndex(product.id);
                // Order exist
                if (orderIndex > -1) {
                    $localStorage.orders[orderIndex].quantity++;
                } else { // New order
                    product.orderId = $localStorage.orders.length;
                    $localStorage.orders.push(angular.copy(product));
                }
            } else {
                service.shortenExtraName(product);
                product.orderId = $localStorage.orders.length;
                $localStorage.orders.push(angular.copy(product));
            }
            product = {};
        },

        /*
         * author: TrungNDT
         * method: update existing order by given information
         */
        updateOrder: function (order) {
            $localStorage.orders.splice(order.orderId, 1, order);
        },

        /*
         * author: TrungNDT
         * method: remove given order from cart
         */
        removeOrder: function (order) {
            var index = $localStorage.orders.indexOf(order);
            if (index > -1) {
                $localStorage.orders.splice(index, 1);
            }
        },

        /*
         * author: TrungNDT
         * method: Submit new order & save to database.
         *          Also clear shopping cart and keep delivery info
         */
        submitOrder: function () {
            var matcher = {
                'CustomerName': 'name',
                'Phone': 'phone',
                'Note': 'note',
                'DeliveryAddress': 'address',
                'StoreName': 'store',
                'OrderDate': 'orderDate',
                'list': {
                    'name': 'productList',
                    'matchWith': 'ProductList',
                    'data': {
                        'ProductId': 'id',
                        'Quantity': 'quantity',
                        'list': {
                            'name': 'extraList',
                            'matchWith': 'ProductWithExtras',
                            'ProductWithExtras': 'extraList',
                            'data': {
                                'ProductExtraId': 'id',
                                'Price': 'price',
                                'Quantity': 'quantity'
                            }
                        }
                    }
                }
            };

            var temp = angular.copy($localStorage.deliveryInfo);
            temp.orderDate = new Date();
            temp.productList = [];

            // Convert order (order with extra list) into "same level" structure
            angular.forEach(angular.copy($localStorage.orders), function (e, i) {
                // Clone main order items
                temp.productList.push({
                    id: e.id,
                    name: e.name,
                    price: e.price,
                    quantity: e.quantity
                });
                if (e.extraList != undefined) {
                    // Clone extra items
                    angular.forEach(e.extraList, function (k, j) {
                        temp.productList.push({
                            id: k.id,
                            name: k.name,
                            price: k.price,
                            quantity: k.quantity
                        });
                    });
                }
            });
            var order = {};
            JsonMatch(order, temp, matcher);

            $http.post('/Order/CreateOrderOnline', {
                str: JSON.stringify(order)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        /*
         * author: TrungNDT
         * method: check if given order has extra or not
         */
        isSingleItem: function (order) {
            var isSingle = true;
            if (order.extraList != undefined)
                angular.forEach(order.extraList, function (e, i) {
                    var quantity = e.quantity || 0;
                    if (quantity > 0)
                        isSingle = false;
                });
            return isSingle;
        },

        /*
         * author: TrungNDT
         * method: [Use for Expression] remove "Extra " string from extra name
         */
        shortenExtraName: function (order) {
            angular.forEach(order.extraList, function (e, i) {
                e.name = e.name.replace('Extra ', '');
            });
        },

        /*
         * author: TrungNDT
         * method: [Private] Get index of given product
         * params: {Number} product id
         * return: {Number} Product index. Return -1 if product not found.
         */
        getOrderIndex: function (productId) {
            var pos = -1;
            for (var i = 0, l = $localStorage.orders.length; i < l && pos < 0; i++)
                if ($localStorage.orders[i].id == productId
                    && service.isSingleItem($localStorage.orders[i])) pos = i;
            return pos;
        },

        /*
         * author: TrungNDT
         * method: [Private] 
         */
        getOrderIndexByOrderId: function (orderId) {
            var pos = -1;
            for (var i = 0, l = $localStorage.orders.length; i < l && pos < 0; i++)
                if ($localStorage.orders[i].id == productId
                    && service.isSingleItem($localStorage.orders[i])) pos = i;
            return pos;
        },

        /*
         * author: TrungNDT
         * method: Get total cost base on price, quantity & extra
         * return: {Number} order cost
         */
        getOrderCost: function (order) {
            var extraCost = 0;
            // Calculate extra cost
            angular.forEach(order.extraList, function (e, i) {
                extraCost += e.price * (e.quantity || 0);
            })
            // Calculate TOTAL cost
            var totalCost = (order.price + extraCost) * order.quantity;
            return totalCost;
        },

        /*
         * author: TrungNDT
         * method: Calculate entire cart's cost
         * return: {Number} total cost
         */
        getTotalCost: function () {
            var totalCost = 0;
            angular.forEach($localStorage.orders, function (e, i) {
                totalCost += service.getOrderCost(e);
            });
            return totalCost;
        },

        /*
         * author: TrungNDT
         * method: Clear shopping cart
         */
        emptyCart: function () {
            $localStorage.orders = [];
        },

        /*
         * author: TrungNDT
         * method: [Private] Load all product from database
         */
        loadAllProducts: function () {
            var deferred = $q.defer();
            //if (!$localStorage.products.length) {
            $http({
                url: '/Order/LoadItemByCategory',
                method: 'GET',
                params: { cateId: 0 }
            }).success(function (data) {
                deferred.resolve(data.products);
                console.log('getAllProducts');
                //$localStorage.products = data.products;
            }).error(function () {
                console.log('error occur');
            });
            return deferred.promise;
            //} else {
            //    //return false;
            //}
        },

        /*
         * author: TrungNDT
         * method: [Private] Load all categories from database
         */
        loadAllCategories: function () {
            var deferred = $q.defer();
            $http({
                url: '/Order/LoadCategories',
                method: 'GET',
            }).success(function (data) {
                deferred.resolve(data.categories);
                //$localStorage.categories = data.categories;
            });
            return deferred.promise;
    }
    };
    //service.initialize();

    return service;
});

JsonMatch = function (target, source, matcher) {
    // mVal stands for matcherValue
    angular.forEach(matcher, function (mVal, mKey) {
        if (mKey == 'list') {
            target[mVal.matchWith] = [];
            angular.forEach(source[mVal.name], function (aItem, aIndex) {
                var _temp = {};
                JsonMatch(_temp, aItem, mVal.data);
                target[mVal.matchWith].push(_temp);
            });
        } else {
            target[mKey] = source[mVal];
        }
    });
};