# Crypto Broker

## Install

```bash
$ git clone https://github.com/reza-ebrahimi/crypto_broker.git
$ cd crypto_broker
$ npm install --save
```

## Run

```bash
$ npm run start
```

## API Call Test

```bash
$ curl -H "Content-Type: application/json; charset=UTF-8" \
    -i -X POST \
    --data '{"action": "buy", "base_currency": "BTC","quote_currency": "TRYB", "amount": "2.0"}' \
    http://localhost:3000/quote
```
