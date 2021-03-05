"use strict";

var QuoteBuilder = function (builder) {
  this.builder = builder;
};

QuoteBuilder.prototype.buildQuote = function (
  quotePrice,
  amount,
  quoteCurrency
) {
  return this.builder.build(quotePrice, amount, quoteCurrency);
};

module.exports = QuoteBuilder;
