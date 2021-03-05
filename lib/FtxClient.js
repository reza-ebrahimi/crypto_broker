"use strict";

const axios = require("axios");
const crypto = require("crypto");
const settings = require("../settings");

var FtxClient = function () {};

FtxClient.prototype.FTX_ENDPOINT = settings.FTX_ENDPOINT;
FtxClient.prototype.FTX_KEY = settings.FTX_KEY;
FtxClient.prototype.FTX_SECRET = settings.FTX_SECRET;
FtxClient.prototype.FTX_SUBACCOUNT = settings.FTX_SUBACCOUNT;

FtxClient.prototype._signRequest = function () {
  const start = +new Date();
  const signature = crypto.createHmac("sha256", this.FTX_SECRET).digest("hex");

  return {
    key: this.FTX_KEY,
    ts: start,
    sign: signature,
  };
};

FtxClient.prototype._buildHeaders = function () {
  let sign = this._signRequest();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "FTX-KEY": sign.key,
    "FTX-TS": sign.ts,
    "FTX-SIGN": sign.sign,
    "FTX-SUBACCOUNT": this.FTX_SUBACCOUNT,
  };
};

FtxClient.prototype._getRequest = async function (path) {
  let headers = this._buildHeaders();
  let response = await axios
    .get(this.FTX_ENDPOINT + path, { headers: headers })
    .catch((error) => {
      console.log("[FtxClient._getRequest] Error");
      return error;
    });
  return response;
};

FtxClient.prototype.fetchMarkets = async function () {
  let response = await this._getRequest("/markets");
  return response;
};

FtxClient.prototype.fetchOrderBook = async function (params) {
  let response = await this._getRequest(
    `/markets/${params.market_name}/orderbook?depth=${params.depth}`
  );
  return response;
};

module.exports = FtxClient;
