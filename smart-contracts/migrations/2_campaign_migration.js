const SupportChildren= artifacts.require("SupportChildren.sol");
const Swap = artifacts.require("Swap.sol");
const Award = artifacts.require("Award.sol");


module.exports = function (deployer) {
  deployer.deploy(SupportChildren);
  deployer.deploy(Swap);
  deployer.deploy(Award, "Support Children", "SC");
};
