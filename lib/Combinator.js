"use strict";

var Combinator = function (combinator) {
  this.combinator = combinator;
};

Combinator.prototype.computeCombinations = function (volumes, amount) {
  return this.combinator.computeCombinations(volumes, amount);
};

module.exports = Combinator;
