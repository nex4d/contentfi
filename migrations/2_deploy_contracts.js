const DTube = artifacts.require("DTube");
const ContentFi = artifacts.require("ContentFi");
module.exports = function(deployer) {
  //deployer.deploy(DTube);
  deployer.deploy(ContentFi);
};
