var request  = require('request');
var cheerio  = require('cheerio');
var notifier = require('node-notifier');

function Watcher(config)
{
  this.products = [];

  this.register(config.products);
}

Watcher.prototype.register = function (products) {
  for(var i in products) {
    this.products.push(products[i]);
  }
};

Watcher.prototype.run = function () {
  var _this = this;

  setInterval(function() {
    _this._pulse();
  }, 4000);

  return;
};

Watcher.prototype._pulse = function () {
  var i = Math.floor(Math.random() * this.products.length);
  var product = this.products[i];

  var options = {
    url: product.url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)'
    }
  };

  request(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      var priceString = $(product.selector).first().text().trim();
      var price = parseFloat(priceString.replace(".", "").replace(",", ".").replace(/^\D+/,""));

      notifier.notify({
        'title': 'Alerta de Preço: '+product.name,
        'message': product.name+' price is '+price
      });
      console.log(product.name+' price is '+price);
      console.log('    '+product.url);
    }
  });
};

module.exports = Watcher;
