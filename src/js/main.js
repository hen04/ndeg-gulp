var incomeTax = 13;
var contributions = 30;

var calculateExpenses = function(netSalary) {
	dirtySalary = netSalary * 100 / (100 - incomeTax);
	moneyForConrtibutions = dirtySalary / 100 * contributions;

	money = Math.round(dirtySalary + moneyForConrtibutions);
	return money;
};