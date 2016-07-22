/*global angular */
angular.module('OrderApp', [
        'ngRoute',
        'ngStorage',
        'ui.bootstrap',
        'angularUtils.directives.dirPagination'
    ])
    .config(function (paginationTemplateProvider) {
        paginationTemplateProvider.setPath('/Content/assets/angularjs/pagination/dirPagination.tpl.html');
    });
