"use strict";

var SumCombinator = function () {};

SumCombinator.prototype.computeCombinations = function (volumes, amount) {
  let p = [];
  let v = [];

  let volumeCombinatorRec = (
    volumes,
    stable_prices = [],
    stable_volumes = []
  ) => {
    var volumes_total = stable_volumes.reduce((v1, v2) => v1 + v2, 0);

    if (volumes_total === amount) {
      p.push(stable_prices);
      v.push(stable_volumes);
    }
    if (volumes_total >= amount) return;

    var price, vol, remaining_volumes;
    for (var i = 0; i < volumes.length; ++i) {
      price = volumes[i][0];
      vol = volumes[i][1];
      remaining_volumes = volumes.slice(i + 1);
      volumeCombinatorRec(
        remaining_volumes,
        stable_prices.concat([price]),
        stable_volumes.concat([vol])
      );
    }
  };

  volumeCombinatorRec(volumes);

  if (p !== undefined && v !== undefined && p.length !== 0 && v.length !== 0) {
    var wap = this.computeWeightedAveragePrice(p[0], v[0]);
  }

  return {
    prices: p,
    volumes: v,
    weightedAveragePrice: wap ? wap : 0,
  };
};

SumCombinator.prototype.computeWeightedAveragePrice = function (
  prices,
  volumes
) {
  if (prices.length !== volumes.length) {
    console.log("[SumCombinator.computeWeightedAverage] Error");
    return -1;
  }

  let price_vol = 0;
  for (var i = 0; i < prices.length; i++) {
    price_vol += prices[i] * volumes[i];
  }

  return price_vol / volumes.reduce((v1, v2) => v1 + v2, 0);
};

module.exports = SumCombinator;
