$(function () {
	$(document).on('click', '.btn-more', function (e) {
//		$('.product-block .cover:visible').fadeOut();
//		$(e.currentTarget).parents('.content').next().fadeIn();
		//$('#modalEditCartItem').modal('show');
	});
	
	$(document).on('click', '.btn-close', function (e) {
		$(e.currentTarget).parent().fadeOut();
	});

	$(document).on('click', '.btn-collapse', function (e) {
		var target = $(this).attr('data-target'); //#floatting-panel
		$(target).toggleClass('expand');
	});


	/*
	 * author: TrungNDT
	 * method: [EVENT] Plus 1 to current extra object
	 */
	$(document).on('click', '[data-action="plus-extra"]', function (e) {
		var me = $(e.currentTarget),
			hiddenRemainingExtra = $('#hiddenRemainingExtra');
		var currentQuantity = parseInt(me.parent().attr('data-quantity') || '0'),
			maxThisExtra = parseInt(me.parent().attr('data-max')),
			remainingExtra = parseInt(hiddenRemainingExtra.val());

		if (remainingExtra > 0 && currentQuantity < maxThisExtra) {
			currentQuantity++;
			hiddenRemainingExtra.val(--remainingExtra);
			$('#lblRemainingExtra').html(remainingExtra);
		} else {}

		//currentQuantity++;
		me.parent().attr('data-quantity', currentQuantity);
		me.html(currentQuantity);
		//		calculateOrderItemPrice();
	});

	/*
	 * author: TrungNDT
	 * method: [EVENT] Minus 1 to current extra object
	 */
	$(document).on('click', '[data-action="minus-extra"]', function (e) {
		var me = $(e.currentTarget),
			hiddenRemainingExtra = $('#hiddenRemainingExtra');
		var currentQuantity = parseInt(me.parent().attr('data-quantity') || '0'),
			remainingExtra = parseInt(hiddenRemainingExtra.val());

		if (remainingExtra < 5) {
			hiddenRemainingExtra.val(++remainingExtra);
			$('#lblRemainingExtra').html(remainingExtra);
		}
		if (currentQuantity > 0) {
			currentQuantity--;
		}

		me.parent().attr('data-quantity', currentQuantity);
		if (currentQuantity == 0) {
			me.siblings('.extra-quantity').empty();
		} else {
			me.siblings('.extra-quantity').html(currentQuantity);
		}
		//		calculateOrderItemPrice();
	});
	
	//$(document).on('click', '.incrementer .inc-control', function (e) {
	//	var me = $(e.currentTarget),
	//		input = me.parent().children('.inc-input'),
	//		value = parseInt(input.val());
	//	if (me.hasClass('inc-minus') && value > 1) { value --; }
	//	else if (me.hasClass('inc-plus')) { value ++ };
	//	input.val(value);
	//});
});

var renderProduct = function () {
	var container = $('#product-container');

	for (var i = 0; i < 8; i++) {
		var product = $($('#tempProductBlock').html().trim())
		product.find('.img-container img').attr('src', '../Content/images/passio/product-' + (i + 1) + '.jpg');
		product.appendTo(container);
	}
}

var renderCart = function () {
	var container = $('#cart-container');

	for (var i = 0; i < 4; i++) {
		var product = $($('#tempCartItem').html().trim())
		product.find('.img-container img').attr('src', '../Content/images/passio/product-' + (i + 1) + '.jpg');
		product.appendTo(container);
	}
}

var loadProductByCategory = function() {
    $.ajax({
        'type': 'GET',
        'url': '/Order/LoadItemByCategory',
        'data': { 'cateId': 0 },
        'dataType': 'html',
        success: function (result) {
            $('#tempProductBlock').html(result);
        }
    });
};