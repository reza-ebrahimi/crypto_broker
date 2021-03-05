"use strict";

var DirectCurrencyPairQuoteBuilder = function () {};

DirectCurrencyPairQuoteBuilder.prototype.build = function (
  quotePrice,
  amount,
  quoteCurrency
) {
  var newQuotePrice = 1 * quotePrice; // computeInversion
  return {
    total: Number(amount * newQuotePrice).toString(), // Total quantity of quote currency
    price: quotePrice.toString(), // The per-unit cost of the base currency
    currency: quoteCurrency, // The quote currency
  };
};

module.exports = DirectCurrencyPairQuoteBuilder;
