// var artifacts = require('truffle-artifactor');
var Adoption = artifacts.require("Lottery");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};