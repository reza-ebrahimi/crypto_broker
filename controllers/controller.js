"use strict";

var FtxClient = require("../lib/FtxClient");
var QuoteBuilder = require("../lib/QuoteBuilder");
var DirectCurrencyPairQuoteBuilder = require("../lib/quoteBuilders/DirectCurrencyPairQuoteBuilder");
var InverseCurrencyPairQuoteBuilder = require("../lib/quoteBuilders/InverseCurrencyPairQuoteBuilder");
var Combinator = require("../lib/Combinator");
var SumCombinator = require("../lib/combinators/SumCombinator");

const ftx = new FtxClient();

// exports.getMarkets = async (request, response) => {
//   let markets = await ftx.fetchMarkets();
//   response.send(markets.data.result);
// };

exports.getQuote = async (request, response) => {
  const action = request.body.action.toLowerCase();
  const amount = request.body.amount;
  const base_currency = request.body.base_currency;
  const quote_currency = request.body.quote_currency;

  let markets = await ftx.fetchMarkets();

  if (markets.isAxiosError) {
    var error = {
      errorMessage:
        markets.code + " " + markets.syscall + " " + markets.hostname,
    };
    response.send(error);
    return;
  }

  await Promise.all(
    markets.data.result
      .filter((market) => {
        const isSpot = market.type && market.type === "spot";
        const isDirectPair =
          market.baseCurrency &&
          market.baseCurrency === base_currency &&
          market.quoteCurrency &&
          market.quoteCurrency === quote_currency;

        const isInversedPair =
          market.baseCurrency &&
          market.baseCurrency === quote_currency &&
          market.quoteCurrency &&
          market.quoteCurrency === base_currency;

        if (isSpot && (isDirectPair || isInversedPair)) {
          market["isDirectPair"] = isDirectPair;
          market["isInversedPair"] = isInversedPair;

          return true;
        }
        return false;
      })
      .map(async (market) => {
        if (market.isDirectPair) {
          var quoteBuilder = new QuoteBuilder(
            new DirectCurrencyPairQuoteBuilder()
          );
        } else if (market.isInversedPair) {
          var quoteBuilder = new QuoteBuilder(
            new InverseCurrencyPairQuoteBuilder()
          );
        } else {
          var error = {
            errorMessage: "The base and qoute currency pair is null.",
          };
        }

        var orders = await ftx.fetchOrderBook({
          market_name: market.name,
          depth: 100,
        });

        if (orders.isAxiosError) {
          var error = {
            errorMessage:
              orders.code + " " + orders.syscall + " " + orders.hostname,
          };
          response.send(error);
          return;
        }

        const success = orders.data.success;
        const asks = orders.data.result.asks;
        const bids = orders.data.result.bids;

        if (success) {
          var combinator = new Combinator(new SumCombinator());

          if (action === "buy") {
            var combinations = combinator.computeCombinations(asks, amount);
          } else if (action === "sell") {
            var combinations = combinator.computeCombinations(bids, amount);
          } else {
            var error = {
              errorMessage: "Unknow trade execution operation " + action,
            };
          }

          if (error) {
            response.send(error);
          } else {
            var quoteResponse = quoteBuilder.buildQuote(
              combinations.weightedAveragePrice,
              Number(amount),
              market.quoteCurrency
            );

            response.send(quoteResponse);
          }
        } else {
          var error = {
            errorMessage: "Fetching orderbook is failed.",
          };
        }

        if (error) {
          response.send(error);
        }
      })
  );
};
