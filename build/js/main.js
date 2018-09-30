var incomeTax = 13;
var contributions = 30;

var calculateExpenses = function(netSalary) {
	dirtySalary = netSalary * 100 / (100 - incomeTax);
	moneyForConrtibutions = dirtySalary / 100 * contributions;

	money = Math.round(dirtySalary + moneyForConrtibutions);
	return money;
};

//console.log(calculateExpenses(70000));



$(function(){

	var menu = function(className) {

		$(className).on('click', function() {

			var menuClass = $('.top-menu');

			if ( $(this).hasClass('open') ) {
				menuClass.slideUp();
				$(this).removeClass('open');
			} else {
				menuClass.slideDown();
				$(this).addClass('open');
			}
		});
		
	}
	
	menu('.js-menu-sm');


});