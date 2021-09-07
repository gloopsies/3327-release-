// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

interface ISupportChildren {
    struct Campaign {
        string name;
        uint endTimestamp;
        address payable beneficiary;
        bool completed;
        uint goal;
        address cryptocurrency;
        string uri;
    }



    event CampaignCreated(uint campaignId, Campaign campaign);
    event Donation(string name, address from, uint campaignId, uint amount, address tokenAddress, address beneficiary);
    event GoalReached(string name, uint campaignId, uint _raisedAmount, address beneficiary, address[] contributors);


    function isCompleted(uint _campaignId) external view returns(bool);
    function approve(address organization) external;
    function isCampaignActive(uint _campaignId) external view returns(bool);
    function getCampaign(uint _campaignId) external view returns(Campaign memory);
    function getCampaigns() external view returns(Campaign[] memory);
    function newCurrency(address _token) external;
    function createCampaign(string memory name, address payable _beneficiary, uint _endTimestamp, uint _goal, address _cryptocurrency, string calldata uri) external;
    function donate(uint _campaignId, address _token, uint _amount) external;
    function donateETH(uint _campaignId) external payable;
    function finalPayment(uint _campaignId) external payable;
    function getRefund(uint _campaignId) external payable;

}
