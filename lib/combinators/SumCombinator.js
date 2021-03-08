"use strict";

var SumCombinator = function () {};

SumCombinator.prototype.computeCombinations = function (prices, amount) {
  let stable_prices = [];
  let stable_sizes = [];
  let total_size = 0;
  amount = Number(amount);

  if (amount <= 0) {
    return {
      prices: [],
      volumes: [],
      weightedAveragePrice: 0,
    };
  }

  // For both buyers and sellers, we need to start iterating
  // from begining of prices array.
  // asks => lowest price first (Buyers)
  // bids => highest price first (Sellers)
  for (var i = 0; i < prices.length; ++i) {
    let price = prices[i][0];
    let size = prices[i][1];

    stable_prices.push(price);

    if (total_size + size <= amount) {
      // Grab prices less than amount
      stable_sizes.push(size);
      total_size += size;
    } else {
      // Grab prices more than amount or remaining amount
      let needed_size = amount - total_size; // needed_size always will be greater than 0

      stable_sizes.push(needed_size);
      total_size += needed_size; // update remaining size
      prices[i][1] = size - needed_size; // update order size
    }

    if (total_size >= amount) break;
  }

  if (total_size !== amount) {
    console.log("[SumCombinator.computeCombinations] Error");

    return {
      prices: [],
      volumes: [],
      weightedAveragePrice: 0,
    };
  }

  if (
    stable_prices !== undefined &&
    stable_sizes !== undefined &&
    stable_prices.length !== 0 &&
    stable_sizes.length !== 0
  ) {
    var wap = this.computeWeightedAveragePrice(stable_prices, stable_sizes);
  }

  return {
    prices: stable_prices,
    volumes: stable_sizes,
    weightedAveragePrice: wap ? wap : 0,
  };
};

SumCombinator.prototype.computeWeightedAveragePrice = function (prices, sizes) {
  if (prices.length !== sizes.length) {
    console.log("[SumCombinator.computeWeightedAverage] Error");
    return -1;
  }

  let price_size = 0;
  for (var i = 0; i < prices.length; i++) {
    price_size += prices[i] * sizes[i];
  }

  return price_size / sizes.reduce((v1, v2) => v1 + v2, 0);
};

module.exports = SumCombinator;
