var util     = require('util');
var jsonfile = require('jsonfile');
var chalk    = require('chalk');
var Cli      = require('./cli');
var Watcher  = require('./watcher');

/**
 * Constructs PriceWatcher and run a command based in argv
 *
 * @param {array} argv Cli parameters
 */
function PriceWatcher(argv)
{
  this.commandList = {
    'help': 'Displays this help message',
    'version': 'Displays the package version',
    'watch <prices.json>': 'Will watch the prices of the given file.'
  };

  return PriceWatcher.super_.call(this, argv);
}
util.inherits(PriceWatcher, Cli);

PriceWatcher.prototype.watch = function (filename) {
  var config = jsonfile.readFileSync(filename);
  var watcher = new Watcher(config);

  watcher.run();

  return '...';
};

/**
 * Returns the version of the package
 * @return {string} Package version
 */
PriceWatcher.prototype.version = function() {
  var packageInfo = require('../package.json');

  return packageInfo.version;
};

/**
 * Returns the help information of the command
 *
 * @return {string} Help information
 */
PriceWatcher.prototype.help = function() {
  var output      = "Available commands:\n";

  for(var command in this.commandList){
    output = output+
      '  '+chalk.green(command)+' '+this.commandList[command]+'\n';
  }

  return output;
};

/**
 * Exports the constructor
 */
module.exports = PriceWatcher;
