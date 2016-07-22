/*global angular */

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
angular.module('OrderApp')
	.directive('errSrc', function () {
		'use strict';
		return {
		    link: function (scope, element, attrs) {
		        element.bind('error', function () {
		            if (attrs.src != attrs.errSrc) {
		                attrs.$set('src', attrs.errSrc);
		            }
		        });
		    }
		}
	});
